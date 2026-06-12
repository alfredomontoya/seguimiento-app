<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Derivacion extends Model
{
    use HasFactory;

    protected $table = 'derivaciones';

    protected $fillable = [
        'tramite_id', 'departamento_origen_id', 'departamento_destino_id',
        'funcionario_id', 'fecha_asignacion', 'comentarios_internos',
        'glosa', 'creado_por_id',
    ];

    public function tramite(): BelongsTo
    {
        return $this->belongsTo(Tramite::class);
    }

    public function departamentoOrigen(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'departamento_origen_id');
    }

    public function departamentoDestino(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'departamento_destino_id');
    }

    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(Funcionario::class, 'funcionario_id');
    }

    public function creadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por_id');
    }
}
