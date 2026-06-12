<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AsignarTramiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->tienePermiso('tramites.asignar');
    }

    public function rules(): array
    {
        return [
            'departamento_id' => ['required', 'exists:departamentos,id'],
            'funcionario_id' => ['required', 'exists:funcionarios,id'],
        ];
    }
}
