<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartamentoController;

use App\Http\Controllers\PermisoController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\TipoTramiteController;
use App\Http\Controllers\TramiteController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('tramites')->name('tramites.')->group(function () {
        Route::get('/', [TramiteController::class, 'index'])->name('index');
        Route::get('/crear', [TramiteController::class, 'create'])->name('create');
        Route::post('/', [TramiteController::class, 'store'])->name('store');
        Route::get('/pendientes', [TramiteController::class, 'pendientes'])->name('pendientes');
        Route::get('/terminados', [TramiteController::class, 'terminados'])->name('terminados');
        Route::get('/{tramite}', [TramiteController::class, 'show'])->name('show');
        Route::get('/{tramite}/editar', [TramiteController::class, 'edit'])->name('edit');
        Route::put('/{tramite}', [TramiteController::class, 'update'])->name('update');
        Route::post('/{tramite}/derivar', [TramiteController::class, 'derivar'])->name('derivar');
        Route::post('/{tramite}/reasignar', [TramiteController::class, 'reasignar'])->name('reasignar');
        Route::post('/{tramite}/cancelar', [TramiteController::class, 'cancelar'])->name('cancelar');
        Route::post('/{tramite}/entregar', [TramiteController::class, 'entregar'])->name('entregar');
    });

    Route::resource('departamentos', DepartamentoController::class);
    Route::resource('personas', PersonaController::class);
    Route::resource('tipos-tramite', TipoTramiteController::class);
    Route::resource('usuarios', UsuarioController::class);
    Route::resource('roles', RolController::class);
    Route::resource('permisos', PermisoController::class);
    Route::post('/roles/{rol}/permisos', [RolController::class, 'syncPermisos'])->name('roles.permisos');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
