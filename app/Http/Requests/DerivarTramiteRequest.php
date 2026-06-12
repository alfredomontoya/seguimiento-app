<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DerivarTramiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->tienePermiso('tramites.derivar');
    }

    public function rules(): array
    {
        return [
            'departamento_destino_id' => ['required', 'exists:departamentos,id'],
            'funcionario_id' => ['nullable', 'exists:funcionarios,id'],
            'glosa' => ['nullable', 'string'],
            'comentarios_internos' => ['nullable', 'string'],
        ];
    }
}
