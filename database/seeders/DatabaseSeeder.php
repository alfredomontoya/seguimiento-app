<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Departamento;
use App\Models\Derivacion;
use App\Models\Funcionario;
use App\Models\Persona;
use App\Models\TipoTramite;
use App\Models\Tramite;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    private array $tables = [
        'derivaciones',
        'tramites',
        'personas',
        'funcionarios',
        'departamentos',
        'tipo_tramites',
        'permiso_rol',
        'permisos',
        'users',
        'roles',
    ];

    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        foreach ($this->tables as $table) {
            DB::table($table)->truncate();
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $this->call(RolSeeder::class);

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'rol_id' => 1,
        ]);

        User::factory(2)->create(['rol_id' => 2]);
        User::factory(3)->create(['rol_id' => 3]);

        $admin = User::first();

        $departamentos = Departamento::factory(4)
            ->sequence(
                ['nombre' => 'Dirección General', 'sigla' => 'DG'],
                ['nombre' => 'Recursos Humanos', 'sigla' => 'RRHH'],
                ['nombre' => 'Tecnología de la Información', 'sigla' => 'TI'],
                ['nombre' => 'Asuntos Jurídicos', 'sigla' => 'AJ'],
            )
            ->create([
                'creado_por_id' => $admin->id,
                'actualizado_por_id' => $admin->id,
            ]);

        Funcionario::factory(15)
            ->sequence(fn ($seq) => [
                'departamento_id' => $departamentos->get($seq->index % 4)->id,
            ])
            ->create([
                'creado_por_id' => $admin->id,
                'actualizado_por_id' => $admin->id,
            ]);

        TipoTramite::factory(5)
            ->sequence(
                ['nombre' => 'Solicitud', 'slug' => 'solicitud', 'descripcion' => 'Solicitud general'],
                ['nombre' => 'Informe', 'slug' => 'informe', 'descripcion' => 'Informe técnico o legal'],
                ['nombre' => 'Expediente', 'slug' => 'expediente', 'descripcion' => 'Expediente administrativo'],
                ['nombre' => 'Memorándum', 'slug' => 'memorandum', 'descripcion' => 'Comunicación interna'],
                ['nombre' => 'Certificado', 'slug' => 'certificado', 'descripcion' => 'Certificación oficial'],
            )
            ->create([
                'creado_por_id' => $admin->id,
                'actualizado_por_id' => $admin->id,
            ]);

        Persona::factory(50)->create([
            'creado_por_id' => $admin->id,
            'actualizado_por_id' => $admin->id,
        ]);

        $secretarias = User::where('rol_id', 2)->get();
        $profesionales = Funcionario::all();
        $personas = Persona::all();
        $tiposTramite = TipoTramite::all();

        $tramites = Tramite::factory(4)
            ->sequence(
                ['estado' => 'recibido', 'fecha_recepcion' => now()->subDays(rand(1, 30))],
                ['estado' => 'recibido', 'fecha_recepcion' => now()->subDays(rand(1, 30))],
                ['estado' => 'recibido', 'fecha_recepcion' => now()->subDays(rand(1, 30))],
                ['estado' => 'recibido', 'fecha_recepcion' => now()->subDays(rand(1, 30))],
            )
            ->create([
                'creado_por_id' => $secretarias->random()->id,
                'persona_id' => fn () => $personas->random()->id,
                'tipo_tramite_id' => fn () => $tiposTramite->random()->id,
            ]);

        $factoryMethod = [
            'en_proceso' => 'enProceso',
            'derivado' => 'derivado',
            'terminado' => 'terminado',
            'entregado' => 'entregado',
            'cancelado' => 'cancelado',
        ];

        foreach (['en_proceso', 'derivado', 'terminado', 'entregado', 'cancelado'] as $estado) {
            $count = match ($estado) {
                'en_proceso' => 6,
                'derivado' => 3,
                'terminado' => 3,
                'entregado' => 2,
                'cancelado' => 2,
                default => 1,
            };

            $tramites = Tramite::factory($count)
                ->{$factoryMethod[$estado]}()
                ->create([
                    'creado_por_id' => $secretarias->random()->id,
                    'persona_id' => fn () => $personas->random()->id,
                    'tipo_tramite_id' => fn () => $tiposTramite->random()->id,
                    'departamento_id' => fn () => $departamentos->random()->id,
                ]);

            if (in_array($estado, ['en_proceso', 'derivado', 'terminado', 'entregado'])) {
                foreach ($tramites as $tramite) {
                    $funcionario = $profesionales->where('departamento_id', $tramite->departamento_id)->first()
                        ?? $profesionales->random();

                    Derivacion::create([
                        'tramite_id' => $tramite->id,
                        'departamento_origen_id' => $departamentos->random()->id,
                        'departamento_destino_id' => $tramite->departamento_id,
                        'funcionario_id' => $funcionario->id,
                        'fecha_asignacion' => $tramite->fecha_recepcion,
                        'creado_por_id' => $secretarias->random()->id,
                    ]);
                }
            }
        }
    }
}
