<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\TipoTramite;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TipoTramite>
 */
class TipoTramiteFactory extends Factory
{
    protected $model = TipoTramite::class;

    public function definition(): array
    {
        $nombre = fake()->unique()->word();

        return [
            'nombre' => ucfirst($nombre),
            'slug' => $nombre,
            'descripcion' => fake()->sentence(),
            'creado_por_id' => User::factory(),
            'actualizado_por_id' => User::factory(),
        ];
    }
}
