<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Departamento;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartamentoController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Departamento::class);

        return Inertia::render('Departamento/Index', [
            'departamentos' => Departamento::with('padre')
                ->withCount('usuarios', 'tramites')
                ->orderBy('nombre')
                ->paginate(10),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Departamento::class);

        return Inertia::render('Departamento/Create', [
            'departamentos' => Departamento::whereNull('departamento_padre_id')->orderBy('nombre')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Departamento::class);

        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'sigla' => ['nullable', 'string', 'max:20'],
            'descripcion' => ['nullable', 'string'],
            'departamento_padre_id' => ['nullable', 'exists:departamentos,id'],
            'activo' => ['boolean'],
        ]);

        $data['creado_por_id'] = $request->user()->id;

        Departamento::create($data);

        return redirect()->route('departamentos.index')->with('success', 'Departamento creado correctamente.');
    }

    public function edit(Departamento $departamento): Response
    {
        $this->authorize('update', Departamento::class);

        return Inertia::render('Departamento/Edit', [
            'departamento' => $departamento,
            'departamentos' => Departamento::whereNull('departamento_padre_id')
                ->where('id', '!=', $departamento->id)
                ->orderBy('nombre')
                ->get(),
        ]);
    }

    public function update(Request $request, Departamento $departamento): RedirectResponse
    {
        $this->authorize('update', Departamento::class);

        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'sigla' => ['nullable', 'string', 'max:20'],
            'descripcion' => ['nullable', 'string'],
            'departamento_padre_id' => ['nullable', 'exists:departamentos,id'],
            'activo' => ['boolean'],
        ]);

        $data['actualizado_por_id'] = $request->user()->id;

        $departamento->update($data);

        return redirect()->route('departamentos.index')->with('success', 'Departamento actualizado correctamente.');
    }
}
