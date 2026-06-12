<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Departamento;
use App\Models\Tramite;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = now();
        $inicioMes = $now->copy()->startOfMonth();

        $totalMes = Tramite::where('created_at', '>=', $inicioMes)->count();
        $pendientes = Tramite::whereIn('estado', ['recibido', 'en_proceso'])->count();
        $completados = Tramite::whereIn('estado', ['terminado', 'entregado'])
            ->where('fecha_termino', '>=', $inicioMes)
            ->count();

        $tiempoPromedio = Tramite::whereIn('estado', ['terminado', 'entregado'])
            ->whereNotNull('fecha_termino')
            ->selectRaw('avg(datediff(fecha_termino, fecha_recepcion)) as promedio')
            ->value('promedio');

        $porDia = Tramite::where('created_at', '>=', $now->copy()->subDays(30))
            ->selectRaw('date(created_at) as fecha, count(*) as total')
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        $porSemana = Tramite::where('created_at', '>=', $now->copy()->subWeeks(12))
            ->selectRaw('yearweek(created_at) as semana, count(*) as total')
            ->groupBy('semana')
            ->orderBy('semana')
            ->get();

        $porEstado = Tramite::selectRaw('estado, count(*) as total')
            ->groupBy('estado')
            ->get();

        $ultimosTramites = Tramite::with(['tipoTramite', 'persona'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $topUrgentes = Tramite::whereIn('estado', ['recibido', 'en_proceso'])
            ->selectRaw('*, datediff(now(), created_at) as dias')
            ->orderBy('dias', 'desc')
            ->limit(5)
            ->get();

        $cargaDepartamentos = Departamento::withCount(['tramites' => function ($q) {
            $q->whereIn('estado', ['recibido', 'en_proceso', 'derivado']);
        }])->get();

        return Inertia::render('Dashboard', [
            'kpis' => [
                'total_mes' => $totalMes,
                'pendientes' => $pendientes,
                'completados' => $completados,
                'tiempo_promedio' => round((float) ($tiempoPromedio ?? 0), 1),
            ],
            'por_dia' => $porDia,
            'por_semana' => $porSemana,
            'por_estado' => $porEstado,
            'ultimos_tramites' => $ultimosTramites,
            'top_urgentes' => $topUrgentes,
            'carga_departamentos' => $cargaDepartamentos,
        ]);
    }
}
