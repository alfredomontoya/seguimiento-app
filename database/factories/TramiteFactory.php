<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Departamento;
use App\Models\Persona;
use App\Models\TipoTramite;
use App\Models\Tramite;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tramite>
 */
class TramiteFactory extends Factory
{
    protected $model = Tramite::class;

    private static int $sequentialCounter = 1;

    public function definition(): array
    {
        $year = now()->format('Y');
        $numero = self::$sequentialCounter++;

        return [
            'nro_secuencial' => sprintf('%s-%04d', $year, $numero),
            'fecha_recepcion' => fake()->dateTimeBetween('-6 months', 'now'),
            'referencia' => fake()->sentence(4),
            'tipo_tramite_id' => TipoTramite::factory(),
            'persona_id' => Persona::factory(),
            'departamento_id' => null,
            'estado' => 'recibido',
            'fecha_termino' => null,
            'glosa_entrega' => null,
            'creado_por_id' => User::factory(),
            'actualizado_por_id' => null,
        ];
    }

    public function enProceso(): static
    {
        return $this->state(fn (array $attrs) => [
            'estado' => 'en_proceso',
            'departamento_id' => Departamento::factory(),
        ]);
    }

    public function derivado(): static
    {
        return $this->state(fn (array $attrs) => [
            'estado' => 'derivado',
            'departamento_id' => Departamento::factory(),
        ]);
    }

    public function terminado(): static
    {
        return $this->state(fn (array $attrs) => [
            'estado' => 'terminado',
            'fecha_termino' => fake()->dateTimeBetween('-30 days', 'now'),
            'glosa_entrega' => fake()->sentence(),
        ]);
    }

    public function entregado(): static
    {
        return $this->state(fn (array $attrs) => [
            'estado' => 'entregado',
            'fecha_termino' => fake()->dateTimeBetween('-30 days', 'now'),
            'glosa_entrega' => fake()->sentence(),
        ]);
    }

    public function cancelado(): static
    {
        return $this->state(fn (array $attrs) => [
            'estado' => 'cancelado',
        ]);
    }
}
