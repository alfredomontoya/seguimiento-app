<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tramite extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nro_secuencial', 'fecha_recepcion', 'referencia',
        'tipo_tramite_id', 'persona_id', 'departamento_id',
        'estado', 'fecha_termino', 'glosa_entrega',
        'creado_por_id', 'actualizado_por_id',
    ];

    public function tipoTramite(): BelongsTo
    {
        return $this->belongsTo(TipoTramite::class);
    }

    public function persona(): BelongsTo
    {
        return $this->belongsTo(Persona::class);
    }

    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class);
    }

    public function creadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por_id');
    }

    public function actualizadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actualizado_por_id');
    }

    public function derivaciones(): HasMany
    {
        return $this->hasMany(Derivacion::class);
    }
}
