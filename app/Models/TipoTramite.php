<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoTramite extends Model
{
    use HasFactory;
    protected $fillable = ['nombre', 'slug', 'descripcion', 'creado_por_id', 'actualizado_por_id'];

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
}
