<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\AsignarTramiteRequest;
use App\Http\Requests\DerivarTramiteRequest;
use App\Http\Requests\StoreTramiteRequest;
use App\Models\Departamento;
use App\Models\Derivacion;
use App\Models\Persona;
use App\Models\TipoTramite;
use App\Models\Tramite;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TramiteController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Tramite::class);

        $query = Tramite::with(['tipoTramite', 'persona', 'departamento']);

        if (!auth()->user()->tienePermiso('tramites.ver_todos')) {
            $query->whereHas('derivaciones', function ($q) {
                $q->where('user_id', auth()->id());
            });
        }

        return Inertia::render('Tramite/Index', [
            'tramites' => $query->orderBy('created_at', 'desc')->paginate(10),
            'estados' => ['recibido', 'en_proceso', 'derivado', 'terminado', 'entregado', 'cancelado'],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Tramite::class);

        return Inertia::render('Tramite/Create', [
            'tiposTramite' => TipoTramite::orderBy('nombre')->get(),
            'departamentos' => Departamento::orderBy('nombre')->get(),
            'personas' => Persona::orderBy('apellidos')->get(),
            'usuarios' => User::orderBy('name')->get(),
        ]);
    }

    public function store(StoreTramiteRequest $request): RedirectResponse
    {
        $year = now()->format('Y');
        $last = Tramite::whereYear('created_at', $year)
            ->where('nro_secuencial', 'like', "$year-%")
            ->orderBy('nro_secuencial', 'desc')
            ->first();

        $numero = $last ? (int) explode('-', $last->nro_secuencial)[1] + 1 : 1;
        $nroSecuencial = sprintf('%s-%04d', $year, $numero);

        $tramite = Tramite::create([
            'nro_secuencial' => $nroSecuencial,
            'fecha_recepcion' => $request->fecha_recepcion,
            'referencia' => $request->referencia,
            'tipo_tramite_id' => $request->tipo_tramite_id,
            'persona_id' => $request->persona_id,
            'estado' => 'recibido',
            'creado_por_id' => $request->user()->id,
        ]);

        if ($request->departamento_id && $request->user_id) {
            $this->asignarTramite($tramite, $request->departamento_id, (int) $request->user_id, $request->user()->id);
        }

        return redirect()->route('tramites.show', $tramite)->with('success', 'Trámite creado correctamente.');
    }

    public function show(Tramite $tramite): Response
    {
        $this->authorize('view', $tramite);

        return Inertia::render('Tramite/Show', [
            'tramite' => $tramite->load([
                'tipoTramite',
                'persona',
                'departamento',
                'creadoPor',
                'derivaciones.user',
                'derivaciones.departamentoOrigen',
                'derivaciones.departamentoDestino',
                'derivaciones.creadoPor',
            ]),
            'departamentos' => Departamento::orderBy('nombre')->get(),
            'usuarios' => User::orderBy('name')->get(),
        ]);
    }

    public function edit(Tramite $tramite): Response
    {
        $this->authorize('update', $tramite);

        return Inertia::render('Tramite/Edit', [
            'tramite' => $tramite,
            'tiposTramite' => TipoTramite::orderBy('nombre')->get(),
            'personas' => Persona::orderBy('apellidos')->get(),
        ]);
    }

    public function update(Request $request, Tramite $tramite): RedirectResponse
    {
        $this->authorize('update', $tramite);

        $data = $request->validate([
            'fecha_recepcion' => ['required', 'date'],
            'referencia' => ['required', 'string', 'max:255'],
            'tipo_tramite_id' => ['required', 'exists:tipo_tramites,id'],
            'persona_id' => ['required', 'exists:personas,id'],
        ]);

        $data['actualizado_por_id'] = $request->user()->id;

        $tramite->update($data);

        return redirect()->route('tramites.show', $tramite)->with('success', 'Trámite actualizado correctamente.');
    }

    public function derivar(DerivarTramiteRequest $request, Tramite $tramite): RedirectResponse
    {
        if (!$tramite->estado === 'en_proceso') {
            return back()->withErrors(['error' => 'Solo se pueden derivar trámites en proceso.']);
        }

        $derivacion = Derivacion::create([
            'tramite_id' => $tramite->id,
            'departamento_origen_id' => $tramite->departamento_id ?? $request->departamento_destino_id,
            'departamento_destino_id' => $request->departamento_destino_id,
            'user_id' => $request->user_id,
            'fecha_asignacion' => now(),
            'comentarios_internos' => $request->comentarios_internos,
            'glosa' => $request->glosa,
            'creado_por_id' => $request->user()->id,
        ]);

        $tramite->update([
            'estado' => 'derivado',
            'departamento_id' => $request->departamento_destino_id,
            'actualizado_por_id' => $request->user()->id,
        ]);

        return redirect()->route('tramites.show', $tramite)->with('success', 'Trámite derivado correctamente.');
    }

    public function reasignar(AsignarTramiteRequest $request, Tramite $tramite): RedirectResponse
    {
        $this->authorize('reasignar', $tramite);

        $this->asignarTramite($tramite, $request->departamento_id, (int) $request->user_id, $request->user()->id);

        return redirect()->route('tramites.show', $tramite)->with('success', 'Trámite reasignado correctamente.');
    }

    public function cancelar(Request $request, Tramite $tramite): RedirectResponse
    {
        $this->authorize('cancelar', $tramite);

        $tramite->update([
            'estado' => 'cancelado',
            'actualizado_por_id' => $request->user()->id,
        ]);

        return redirect()->route('tramites.show', $tramite)->with('success', 'Trámite cancelado correctamente.');
    }

    public function entregar(Request $request, Tramite $tramite): RedirectResponse
    {
        $this->authorize('entregar', $tramite);

        $data = $request->validate([
            'glosa_entrega' => ['nullable', 'string'],
        ]);

        $tramite->update([
            'estado' => 'entregado',
            'fecha_termino' => now(),
            'glosa_entrega' => $data['glosa_entrega'],
            'actualizado_por_id' => $request->user()->id,
        ]);

        return redirect()->route('tramites.show', $tramite)->with('success', 'Trámite entregado correctamente.');
    }

    public function pendientes(): Response
    {
        $this->authorize('viewAny', Tramite::class);

        $query = Tramite::with(['tipoTramite', 'persona'])
            ->whereIn('estado', ['recibido', 'en_proceso']);

        if (!auth()->user()->tienePermiso('tramites.ver_todos')) {
            $query->whereHas('derivaciones', function ($q) {
                $q->where('user_id', auth()->id());
            });
        }

        return Inertia::render('Tramite/Pendientes', [
            'tramites' => $query->orderBy('created_at', 'desc')->paginate(10),
        ]);
    }

    public function terminados(): Response
    {
        $this->authorize('viewAny', Tramite::class);

        $query = Tramite::with(['tipoTramite', 'persona'])
            ->whereIn('estado', ['terminado', 'entregado']);

        if (!auth()->user()->tienePermiso('tramites.ver_todos')) {
            $query->whereHas('derivaciones', function ($q) {
                $q->where('user_id', auth()->id());
            });
        }

        return Inertia::render('Tramite/Terminados', [
            'tramites' => $query->orderBy('fecha_termino', 'desc')->paginate(10),
        ]);
    }

    private function asignarTramite(Tramite $tramite, int $departamentoId, int $userId, int $creadoPorId): void
    {
        Derivacion::create([
            'tramite_id' => $tramite->id,
            'departamento_origen_id' => $tramite->departamento_id ?? $departamentoId,
            'departamento_destino_id' => $departamentoId,
            'user_id' => $userId,
            'fecha_asignacion' => now(),
            'creado_por_id' => $creadoPorId,
        ]);

        $tramite->update([
            'estado' => 'en_proceso',
            'departamento_id' => $departamentoId,
        ]);
    }
}
