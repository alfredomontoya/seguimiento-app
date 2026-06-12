<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Tramite;
use App\Models\User;

class TramitePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->tienePermiso('tramites.ver_todos');
    }

    public function view(User $user, Tramite $tramite): bool
    {
        if ($user->tienePermiso('tramites.ver_todos')) {
            return true;
        }

        return $user->tienePermiso('tramites.derivar');
    }

    public function create(User $user): bool
    {
        return $user->tienePermiso('tramites.crear');
    }

    public function update(User $user, Tramite $tramite): bool
    {
        return $user->tienePermiso('tramites.crear');
    }

    public function asignar(User $user): bool
    {
        return $user->tienePermiso('tramites.asignar');
    }

    public function reasignar(User $user): bool
    {
        return $user->tienePermiso('tramites.reasignar');
    }

    public function derivar(User $user): bool
    {
        return $user->tienePermiso('tramites.derivar');
    }

    public function cancelar(User $user): bool
    {
        return $user->tienePermiso('tramites.cancelar');
    }

    public function entregar(User $user): bool
    {
        return $user->tienePermiso('tramites.entregar');
    }
}
