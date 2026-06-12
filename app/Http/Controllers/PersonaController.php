<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Persona;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PersonaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Persona/Index', [
            'personas' => Persona::orderBy('apellidos')->paginate(10),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Persona/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nro_documento' => ['required', 'string', 'max:50', 'unique:personas,nro_documento'],
            'nombres' => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'direccion' => ['nullable', 'string'],
        ]);

        $data['creado_por_id'] = $request->user()->id;

        Persona::create($data);

        return redirect()->route('personas.index')->with('success', 'Persona registrada correctamente.');
    }

    public function edit(Persona $persona): Response
    {
        return Inertia::render('Persona/Edit', [
            'persona' => $persona,
        ]);
    }

    public function update(Request $request, Persona $persona): RedirectResponse
    {
        $data = $request->validate([
            'nro_documento' => ['required', 'string', 'max:50', 'unique:personas,nro_documento,' . $persona->id],
            'nombres' => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'direccion' => ['nullable', 'string'],
        ]);

        $data['actualizado_por_id'] = $request->user()->id;

        $persona->update($data);

        return redirect()->route('personas.index')->with('success', 'Persona actualizada correctamente.');
    }
}
