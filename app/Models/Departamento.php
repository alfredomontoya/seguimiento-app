<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Departamento extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre', 'sigla', 'descripcion', 'departamento_padre_id',
        'activo', 'creado_por_id', 'actualizado_por_id',
    ];

    public function padre(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'departamento_padre_id');
    }

    public function hijos(): HasMany
    {
        return $this->hasMany(Departamento::class, 'departamento_padre_id');
    }

    public function creadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por_id');
    }

    public function actualizadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actualizado_por_id');
    }

    public function tramites(): HasMany
    {
        return $this->hasMany(Tramite::class);
    }

    public function funcionarios(): HasMany
    {
        return $this->hasMany(Funcionario::class);
    }

    public function derivacionesOrigen(): HasMany
    {
        return $this->hasMany(Derivacion::class, 'departamento_origen_id');
    }

    public function derivacionesDestino(): HasMany
    {
        return $this->hasMany(Derivacion::class, 'departamento_destino_id');
    }
}
