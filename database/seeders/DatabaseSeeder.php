<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Cargo;
use App\Models\Departamento;
use App\Models\Derivacion;
use App\Models\Persona;
use App\Models\TipoTramite;
use App\Models\Tramite;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    private array $tables = [
        'cargo_user',
        'departamento_user',
        'derivaciones',
        'tramites',
        'personas',
        'departamentos',
        'tipo_tramites',
        'cargos',
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
            'email' => 'admin@diprove.com',
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

        $cargos = collect();
        foreach ([
            ['nombre' => 'Jefe', 'slug' => 'jefe'],
            ['nombre' => 'Analista', 'slug' => 'analista'],
            ['nombre' => 'Técnico', 'slug' => 'tecnico'],
            ['nombre' => 'Asistente', 'slug' => 'asistente'],
        ] as $cargoData) {
            $cargos->push(Cargo::create([...$cargoData, 'activo' => true]));
        }

        $users = User::all();
        foreach ($users as $i => $user) {
            DB::table('departamento_user')->insert([
                'user_id' => $user->id,
                'departamento_id' => $departamentos->get($i % 4)->id,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            DB::table('cargo_user')->insert([
                'user_id' => $user->id,
                'cargo_id' => $cargos->get($i % 4)->id,
                'activo' => $i === 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

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
        $profesionales = User::where('rol_id', 3)->get();
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
                    $user = $profesionales->firstWhere(
                        fn ($u) => $u->departamentos()->wherePivot('activo', true)->first()?->id === $tramite->departamento_id
                    ) ?? $profesionales->random();

                    Derivacion::create([
                        'tramite_id' => $tramite->id,
                        'departamento_origen_id' => $departamentos->random()->id,
                        'departamento_destino_id' => $tramite->departamento_id,
                        'user_id' => $user->id,
                        'fecha_asignacion' => $tramite->fecha_recepcion,
                        'creado_por_id' => $secretarias->random()->id,
                    ]);
                }
            }
        }
    }
}
