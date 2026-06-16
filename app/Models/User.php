<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'rol_id', 'nombres', 'apellidos', 'nro_documento', 'telefono', 'profesion', 'activo'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'activo' => 'boolean',
        ];
    }

    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class);
    }

    public function cargos(): BelongsToMany
    {
        return $this->belongsToMany(Cargo::class, 'cargo_user')
            ->withPivot('activo')
            ->withTimestamps();
    }

    public function departamentos(): BelongsToMany
    {
        return $this->belongsToMany(Departamento::class, 'departamento_user')
            ->withPivot('activo')
            ->withTimestamps();
    }

    public function historialRoles(): BelongsToMany
    {
        return $this->belongsToMany(Rol::class, 'role_user')
            ->withPivot('asignado_en')
            ->withTimestamps()
            ->orderByPivot('asignado_en', 'desc');
    }

    public function tienePermiso(string $slug): bool
    {
        return $this->rol?->permisos->contains('slug', $slug) ?? false;
    }
}
