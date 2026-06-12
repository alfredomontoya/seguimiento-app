import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

interface DashboardProps extends PageProps {
    kpis: {
        total_mes: number;
        pendientes: number;
        completados: number;
        tiempo_promedio: number;
    };
    por_dia: Array<{ fecha: string; total: number }>;
    por_semana: Array<{ semana: number; total: number }>;
    por_estado: Array<{ estado: string; total: number }>;
    ultimos_tramites: Array<{
        id: number;
        nro_secuencial: string;
        referencia: string;
        estado: string;
    }>;
    top_urgentes: Array<{
        id: number;
        nro_secuencial: string;
        referencia: string;
        dias: number;
        estado: string;
    }>;
    carga_departamentos: Array<{ nombre: string; tramites_count: number }>;
}

const estadoColors: Record<string, string> = {
    recibido: 'bg-gray-100 text-gray-800',
    en_proceso: 'bg-blue-100 text-blue-800',
    derivado: 'bg-amber-100 text-amber-800',
    terminado: 'bg-green-100 text-green-800',
    entregado: 'bg-emerald-100 text-emerald-800',
    cancelado: 'bg-red-100 text-red-800',
};

const estadoLabels: Record<string, string> = {
    recibido: 'Recibido',
    en_proceso: 'En Proceso',
    derivado: 'Derivado',
    terminado: 'Terminado',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
};

function Badge({ estado }: { estado: string }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                estadoColors[estado] ?? 'bg-gray-100 text-gray-800'
            }`}
        >
            {estadoLabels[estado] ?? estado}
        </span>
    );
}

function maxTotal(items: { total: number }[]): number {
    return Math.max(1, ...items.map((i) => i.total));
}

export default function Dashboard({
    kpis,
    por_dia,
    por_semana,
    por_estado,
    ultimos_tramites,
    top_urgentes,
    carga_departamentos,
}: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* KPI Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border-l-4 border-green-600 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Total del Mes
                            </p>
                            <p className="mt-1 text-3xl font-bold text-green-700">
                                {kpis.total_mes}
                            </p>
                        </div>
                        <div className="rounded-lg border-l-4 border-amber-500 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Pendientes
                            </p>
                            <p className="mt-1 text-3xl font-bold text-amber-600">
                                {kpis.pendientes}
                            </p>
                        </div>
                        <div className="rounded-lg border-l-4 border-emerald-500 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Completados
                            </p>
                            <p className="mt-1 text-3xl font-bold text-emerald-600">
                                {kpis.completados}
                            </p>
                        </div>
                        <div className="rounded-lg border-l-4 border-blue-500 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Tiempo Promedio
                            </p>
                            <p className="mt-1 text-3xl font-bold text-blue-700">
                                {kpis.tiempo_promedio}
                                <span className="ml-1 text-base font-normal text-gray-500">
                                    días
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Por Día */}
                        <div className="rounded-lg bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
                                Trámites por Día
                            </h3>
                            <div className="space-y-1.5">
                                {por_dia.map((item) => {
                                    const pct =
                                        (item.total / maxTotal(por_dia)) * 100;
                                    return (
                                        <div key={item.fecha} className="flex items-center gap-2">
                                            <span className="w-24 shrink-0 text-xs text-gray-500">
                                                {item.fecha}
                                            </span>
                                            <div className="flex h-5 flex-1 overflow-hidden rounded bg-gray-100">
                                                <div
                                                    className="h-full rounded bg-green-500 transition-all"
                                                    style={{
                                                        width: `${pct}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="w-6 text-right text-xs font-medium text-gray-700">
                                                {item.total}
                                            </span>
                                        </div>
                                    );
                                })}
                                {por_dia.length === 0 && (
                                    <p className="text-sm text-gray-400">
                                        Sin datos
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Por Semana */}
                        <div className="rounded-lg bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
                                Trámites por Semana
                            </h3>
                            <div className="space-y-1.5">
                                {por_semana.map((item) => {
                                    const pct =
                                        (item.total / maxTotal(por_semana)) *
                                        100;
                                    return (
                                        <div key={item.semana} className="flex items-center gap-2">
                                            <span className="w-24 shrink-0 text-xs text-gray-500">
                                                Sem {item.semana}
                                            </span>
                                            <div className="flex h-5 flex-1 overflow-hidden rounded bg-gray-100">
                                                <div
                                                    className="h-full rounded bg-blue-500 transition-all"
                                                    style={{
                                                        width: `${pct}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="w-6 text-right text-xs font-medium text-gray-700">
                                                {item.total}
                                            </span>
                                        </div>
                                    );
                                })}
                                {por_semana.length === 0 && (
                                    <p className="text-sm text-gray-400">
                                        Sin datos
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Por Estado */}
                        <div className="rounded-lg bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
                                Distribución por Estado
                            </h3>
                            <div className="space-y-3">
                                {por_estado.map((item) => {
                                    const total = por_estado.reduce(
                                        (s, i) => s + i.total,
                                        0,
                                    );
                                    const pct =
                                        total > 0
                                            ? (item.total / total) * 100
                                            : 0;
                                    return (
                                        <div key={item.estado}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <Badge estado={item.estado} />
                                                <span className="font-medium text-gray-700">
                                                    {item.total}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-gray-500 transition-all"
                                                    style={{
                                                        width: `${pct}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {por_estado.length === 0 && (
                                    <p className="text-sm text-gray-400">
                                        Sin datos
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tables Section */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Últimos Trámites */}
                        <div className="rounded-lg bg-white p-5 shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                                    Últimos Ingresados
                                </h3>
                                <Link
                                    href={route('tramites.index')}
                                    className="text-xs font-medium text-green-600 hover:text-green-800"
                                >
                                    Ver todos
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                                            <th className="pb-2 pr-2 font-medium">
                                                N°
                                            </th>
                                            <th className="pb-2 pr-2 font-medium">
                                                Referencia
                                            </th>
                                            <th className="pb-2 font-medium">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ultimos_tramites.map((t) => (
                                            <tr
                                                key={t.id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-2 pr-2 font-mono text-xs text-gray-700">
                                                    <Link
                                                        href={route(
                                                            'tramites.show',
                                                            t.id,
                                                        )}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        {t.nro_secuencial}
                                                    </Link>
                                                </td>
                                                <td className="max-w-32 truncate py-2 pr-2 text-gray-700">
                                                    {t.referencia}
                                                </td>
                                                <td className="py-2">
                                                    <Badge estado={t.estado} />
                                                </td>
                                            </tr>
                                        ))}
                                        {ultimos_tramites.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="py-4 text-center text-gray-400"
                                                >
                                                    Sin trámites recientes
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Urgentes */}
                        <div className="rounded-lg bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
                                Trámites Urgentes
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                                            <th className="pb-2 pr-2 font-medium">
                                                N°
                                            </th>
                                            <th className="pb-2 pr-2 font-medium">
                                                Referencia
                                            </th>
                                            <th className="pb-2 pr-2 font-medium">
                                                Días
                                            </th>
                                            <th className="pb-2 font-medium">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top_urgentes.map((t) => (
                                            <tr
                                                key={t.id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-2 pr-2 font-mono text-xs text-gray-700">
                                                    <Link
                                                        href={route(
                                                            'tramites.show',
                                                            t.id,
                                                        )}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        {t.nro_secuencial}
                                                    </Link>
                                                </td>
                                                <td className="max-w-24 truncate py-2 pr-2 text-gray-700">
                                                    {t.referencia}
                                                </td>
                                                <td className="py-2 pr-2 font-medium text-red-600">
                                                    {t.dias}
                                                </td>
                                                <td className="py-2">
                                                    <Badge estado={t.estado} />
                                                </td>
                                            </tr>
                                        ))}
                                        {top_urgentes.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="py-4 text-center text-gray-400"
                                                >
                                                    Sin trámites urgentes
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Carga por Departamento */}
                        <div className="rounded-lg bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
                                Carga por Departamento
                            </h3>
                            <div className="space-y-2">
                                {carga_departamentos.map((dept) => {
                                    const maxCarga = Math.max(
                                        1,
                                        ...carga_departamentos.map(
                                            (d) => d.tramites_count,
                                        ),
                                    );
                                    const pct =
                                        (dept.tramites_count / maxCarga) * 100;
                                    return (
                                        <div key={dept.nombre}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="text-gray-700">
                                                    {dept.nombre}
                                                </span>
                                                <span className="font-medium text-gray-700">
                                                    {dept.tramites_count}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-indigo-500 transition-all"
                                                    style={{
                                                        width: `${pct}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {carga_departamentos.length === 0 && (
                                    <p className="text-sm text-gray-400">
                                        Sin datos
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
