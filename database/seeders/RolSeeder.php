<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Permiso;
use App\Models\Rol;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Rol::create(['nombre' => 'Administrador', 'slug' => 'admin', 'descripcion' => 'Acceso total al sistema']);
        $secretaria = Rol::create(['nombre' => 'Secretaria', 'slug' => 'secretaria', 'descripcion' => 'Crea y asigna trámites']);
        $profesional = Rol::create(['nombre' => 'Profesional', 'slug' => 'profesional', 'descripcion' => 'Procesa trámites asignados']);

        $permisos = [
            ['nombre' => 'Gestionar usuarios', 'slug' => 'usuarios.gestionar', 'descripcion' => 'Crear, editar y eliminar usuarios'],
            ['nombre' => 'Gestionar roles', 'slug' => 'roles.gestionar', 'descripcion' => 'Crear, editar y eliminar roles'],
            ['nombre' => 'Gestionar permisos', 'slug' => 'permisos.gestionar', 'descripcion' => 'Asignar permisos a roles'],
            ['nombre' => 'Gestionar departamentos', 'slug' => 'departamentos.gestionar', 'descripcion' => 'Crear, editar departamentos'],
            ['nombre' => 'Crear trámites', 'slug' => 'tramites.crear', 'descripcion' => 'Registrar nuevos trámites'],
            ['nombre' => 'Asignar trámites', 'slug' => 'tramites.asignar', 'descripcion' => 'Asignar trámites a profesionales'],
            ['nombre' => 'Reasignar trámites', 'slug' => 'tramites.reasignar', 'descripcion' => 'Reasignar trámites entre profesionales'],
            ['nombre' => 'Derivar trámites', 'slug' => 'tramites.derivar', 'descripcion' => 'Derivar trámites a otros departamentos'],
            ['nombre' => 'Ver todos los trámites', 'slug' => 'tramites.ver_todos', 'descripcion' => 'Ver trámites de todos los profesionales'],
            ['nombre' => 'Cancelar trámites', 'slug' => 'tramites.cancelar', 'descripcion' => 'Cancelar trámites en cualquier estado'],
            ['nombre' => 'Entregar trámites', 'slug' => 'tramites.entregar', 'descripcion' => 'Marcar trámites como entregados'],
            ['nombre' => 'Ver reportes', 'slug' => 'reportes.ver', 'descripcion' => 'Acceder a reportes y estadísticas'],
        ];

        foreach ($permisos as $data) {
            Permiso::create($data);
        }

        $admin->permisos()->attach(Permiso::all());

        $secretaria->permisos()->attach(Permiso::whereIn('slug', [
            'tramites.crear',
            'tramites.asignar',
            'tramites.reasignar',
            'tramites.ver_todos',
            'tramites.entregar',
            'reportes.ver',
        ])->get());

        $profesional->permisos()->attach(Permiso::whereIn('slug', [
            'tramites.derivar',
            'reportes.ver',
        ])->get());
    }
}
