<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->tienePermiso('usuarios.gestionar');
    }

    public function view(User $user): bool
    {
        return $user->tienePermiso('usuarios.gestionar');
    }

    public function create(User $user): bool
    {
        return $user->tienePermiso('usuarios.gestionar');
    }

    public function update(User $user): bool
    {
        return $user->tienePermiso('usuarios.gestionar');
    }

    public function delete(User $user): bool
    {
        return $user->tienePermiso('usuarios.gestionar');
    }
}
