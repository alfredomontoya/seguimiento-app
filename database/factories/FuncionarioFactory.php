<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Departamento;
use App\Models\Funcionario;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Funcionario>
 */
class FuncionarioFactory extends Factory
{
    protected $model = Funcionario::class;

    public function definition(): array
    {
        return [
            'nombres' => fake()->firstName(),
            'apellidos' => fake()->lastName(),
            'cargo' => fake()->jobTitle(),
            'profesion' => fake()->jobTitle(),
            'departamento_id' => Departamento::factory(),
            'user_id' => null,
            'creado_por_id' => User::factory(),
            'actualizado_por_id' => User::factory(),
        ];
    }

    public function conUsuario(?User $user = null): static
    {
        return $this->state(fn (array $attrs) => [
            'user_id' => $user ?? User::factory(),
        ]);
    }

    public function enDepartamento(Departamento $departamento): static
    {
        return $this->state(fn (array $attrs) => [
            'departamento_id' => $departamento->id,
        ]);
    }
}
