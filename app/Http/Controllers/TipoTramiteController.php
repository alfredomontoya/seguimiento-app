<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\TipoTramite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TipoTramiteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('TipoTramite/Index', [
            'tiposTramite' => TipoTramite::orderBy('nombre')->paginate(10),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('TipoTramite/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:tipo_tramites,slug'],
            'descripcion' => ['nullable', 'string'],
        ]);

        $data['creado_por_id'] = $request->user()->id;

        TipoTramite::create($data);

        return redirect()->route('tipos-tramite.index')->with('success', 'Tipo de trámite creado correctamente.');
    }

    public function edit(TipoTramite $tipoTramite): Response
    {
        return Inertia::render('TipoTramite/Edit', [
            'tipoTramite' => $tipoTramite,
        ]);
    }

    public function update(Request $request, TipoTramite $tipoTramite): RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:tipo_tramites,slug,' . $tipoTramite->id],
            'descripcion' => ['nullable', 'string'],
        ]);

        $data['actualizado_por_id'] = $request->user()->id;

        $tipoTramite->update($data);

        return redirect()->route('tipos-tramite.index')->with('success', 'Tipo de trámite actualizado correctamente.');
    }
}
