<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreRolRequest;
use App\Models\Permiso;
use App\Models\Rol;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RolController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Rol/Index', [
            'roles' => Rol::withCount('usuarios', 'permisos')->orderBy('nombre')->paginate(10),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Rol/Create');
    }

    public function store(StoreRolRequest $request): RedirectResponse
    {
        Rol::create($request->validated());

        return redirect()->route('roles.index')->with('success', 'Rol creado correctamente.');
    }

    public function edit(Rol $rol): Response
    {
        return Inertia::render('Rol/Edit', [
            'rol' => $rol->load('permisos'),
            'permisos' => Permiso::orderBy('nombre')->get(),
        ]);
    }

    public function update(Request $request, Rol $rol): RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:roles,slug,' . $rol->id],
            'descripcion' => ['nullable', 'string'],
        ]);

        $rol->update($data);

        return redirect()->route('roles.index')->with('success', 'Rol actualizado correctamente.');
    }

    public function destroy(Rol $rol): RedirectResponse
    {
        $rol->delete();

        return redirect()->route('roles.index')->with('success', 'Rol eliminado correctamente.');
    }

    public function syncPermisos(Request $request, Rol $rol): RedirectResponse
    {
        $request->validate(['permisos' => ['array']]);

        $rol->permisos()->sync($request->permisos);

        return redirect()->route('roles.index')->with('success', 'Permisos actualizados correctamente.');
    }
}
