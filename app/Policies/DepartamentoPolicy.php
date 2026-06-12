<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

class DepartamentoPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->tienePermiso('departamentos.gestionar');
    }

    public function update(User $user): bool
    {
        return $user->tienePermiso('departamentos.gestionar');
    }

    public function delete(User $user): bool
    {
        return $user->tienePermiso('departamentos.gestionar');
    }
}
