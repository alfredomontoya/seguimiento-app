<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Departamento;
use App\Models\Funcionario;
use App\Models\Persona;
use App\Models\TipoTramite;
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
    }
}
