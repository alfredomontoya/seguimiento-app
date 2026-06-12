<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Permiso;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PermisoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Permiso/Index', [
            'permisos' => Permiso::orderBy('nombre')->paginate(10),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Permiso/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:permisos,slug'],
            'descripcion' => ['nullable', 'string'],
        ]);

        Permiso::create($data);

        return redirect()->route('permisos.index')->with('success', 'Permiso creado correctamente.');
    }

    public function edit(Permiso $permiso): Response
    {
        return Inertia::render('Permiso/Edit', [
            'permiso' => $permiso,
        ]);
    }

    public function update(Request $request, Permiso $permiso): RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:permisos,slug,' . $permiso->id],
            'descripcion' => ['nullable', 'string'],
        ]);

        $permiso->update($data);

        return redirect()->route('permisos.index')->with('success', 'Permiso actualizado correctamente.');
    }
}
