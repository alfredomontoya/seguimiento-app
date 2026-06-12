<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Departamento;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Departamento>
 */
class DepartamentoFactory extends Factory
{
    protected $model = Departamento::class;

    public function definition(): array
    {
        return [
            'nombre' => fake()->unique()->company(),
            'sigla' => strtoupper(fake()->lexify('???')),
            'descripcion' => fake()->sentence(),
            'departamento_padre_id' => null,
            'activo' => true,
            'creado_por_id' => User::factory(),
            'actualizado_por_id' => User::factory(),
        ];
    }

    public function padre(?Departamento $padre = null): static
    {
        return $this->state(fn (array $attrs) => [
            'departamento_padre_id' => $padre ?? Departamento::factory(),
        ]);
    }
}
