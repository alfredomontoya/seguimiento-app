<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Departamento;
use App\Models\Funcionario;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FuncionarioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Funcionario/Index', [
            'funcionarios' => Funcionario::with('departamento', 'user')
                ->orderBy('apellidos')
                ->paginate(10),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Funcionario/Create', [
            'departamentos' => Departamento::orderBy('nombre')->get(),
            'usuarios' => User::whereDoesntHave('funcionario')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id', 'unique:funcionarios,user_id'],
            'nombres' => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],
            'cargo' => ['nullable', 'string', 'max:255'],
            'profesion' => ['nullable', 'string', 'max:255'],
            'departamento_id' => ['nullable', 'exists:departamentos,id'],
        ]);

        $data['creado_por_id'] = $request->user()->id;

        Funcionario::create($data);

        return redirect()->route('funcionarios.index')->with('success', 'Funcionario registrado correctamente.');
    }

    public function edit(Funcionario $funcionario): Response
    {
        return Inertia::render('Funcionario/Edit', [
            'funcionario' => $funcionario,
            'departamentos' => Departamento::orderBy('nombre')->get(),
            'usuarios' => User::whereDoesntHave('funcionario')
                ->orWhere('id', $funcionario->user_id)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(Request $request, Funcionario $funcionario): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id', 'unique:funcionarios,user_id,' . $funcionario->id],
            'nombres' => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],
            'cargo' => ['nullable', 'string', 'max:255'],
            'profesion' => ['nullable', 'string', 'max:255'],
            'departamento_id' => ['nullable', 'exists:departamentos,id'],
        ]);

        $data['actualizado_por_id'] = $request->user()->id;

        $funcionario->update($data);

        return redirect()->route('funcionarios.index')->with('success', 'Funcionario actualizado correctamente.');
    }
}
