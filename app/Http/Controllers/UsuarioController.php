<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreUsuarioRequest;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('Usuario/Index', [
            'usuarios' => User::with('rol')->orderBy('name')->paginate(10),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('Usuario/Create', [
            'roles' => Rol::orderBy('nombre')->get(),
        ]);
    }

    public function store(StoreUsuarioRequest $request): RedirectResponse
    {
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol_id' => $request->rol_id,
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'nro_documento' => $request->nro_documento,
            'telefono' => $request->telefono,
            'profesion' => $request->profesion,
            'activo' => $request->boolean('activo', true),
        ]);

        return redirect()->route('usuarios.index')->with('success', 'Usuario creado correctamente.');
    }

    public function show(User $usuario): Response
    {
        $this->authorize('view', $usuario);

        return Inertia::render('Usuario/Show', [
            'usuario' => $usuario->load('rol'),
        ]);
    }

    public function edit(User $usuario): Response
    {
        $this->authorize('update', $usuario);

        return Inertia::render('Usuario/Edit', [
            'usuario' => $usuario->load('rol'),
            'roles' => Rol::orderBy('nombre')->get(),
        ]);
    }

    public function update(Request $request, User $usuario): RedirectResponse
    {
        $this->authorize('update', $usuario);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $usuario->id],
            'rol_id' => ['required', 'exists:roles,id'],
            'nombres' => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],
            'nro_documento' => ['nullable', 'string', 'max:20', 'unique:users,nro_documento,' . $usuario->id],
            'telefono' => ['nullable', 'string', 'max:20'],
            'profesion' => ['nullable', 'string', 'max:255'],
            'activo' => ['boolean'],
        ]);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $usuario->update($data);

        return redirect()->route('usuarios.index')->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $usuario): RedirectResponse
    {
        $this->authorize('delete', $usuario);

        $usuario->delete();

        return redirect()->route('usuarios.index')->with('success', 'Usuario eliminado correctamente.');
    }
}
