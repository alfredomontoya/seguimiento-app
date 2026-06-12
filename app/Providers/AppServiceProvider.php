<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Departamento;
use App\Models\Tramite;
use App\Models\User;
use App\Policies\DepartamentoPolicy;
use App\Policies\TramitePolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);

        Gate::policy(Tramite::class, TramitePolicy::class);
        Gate::policy(Departamento::class, DepartamentoPolicy::class);
        Gate::policy(User::class, UserPolicy::class);

        $permisos = \App\Models\Permiso::all();
        foreach ($permisos as $permiso) {
            Gate::define($permiso->slug, fn (User $user) => $user->tienePermiso($permiso->slug));
        }
    }
}
