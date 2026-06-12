<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Departamento;
use App\Models\Derivacion;
use App\Models\Funcionario;
use App\Models\Tramite;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Derivacion>
 */
class DerivacionFactory extends Factory
{
    protected $model = Derivacion::class;

    public function definition(): array
    {
        $departamentoDestino = Departamento::factory();

        return [
            'tramite_id' => Tramite::factory(),
            'departamento_origen_id' => null,
            'departamento_destino_id' => $departamentoDestino,
            'funcionario_id' => Funcionario::factory(),
            'fecha_asignacion' => fake()->dateTimeBetween('-6 months', 'now'),
            'comentarios_internos' => fake()->optional()->sentence(),
            'glosa' => fake()->optional()->sentence(),
            'creado_por_id' => User::factory(),
        ];
    }
}
