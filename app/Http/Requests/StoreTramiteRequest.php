<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTramiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->tienePermiso('tramites.crear');
    }

    public function rules(): array
    {
        return [
            'fecha_recepcion' => ['required', 'date'],
            'referencia' => ['required', 'string', 'max:255'],
            'tipo_tramite_id' => ['required', 'exists:tipo_tramites,id'],
            'persona_id' => ['required', 'exists:personas,id'],
            'departamento_id' => ['nullable', 'exists:departamentos,id'],
            'glosa_entrega' => ['nullable', 'string'],
        ];
    }
}
