import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

interface Tramite {
    id: number;
    nro_secuencial: string;
    fecha_recepcion: string;
    referencia: string;
    estado: string;
    tipo_tramite: { id: number; nombre: string } | null;
    persona: { id: number; nombres: string; apellidos: string } | null;
    departamento: { id: number; nombre: string } | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: Tramite[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

export default function Index({ tramites, estados }: { tramites: PaginatedData; estados: string[] }) {
    const badgeColors: Record<string, string> = {
        recibido: 'bg-gray-100 text-gray-800',
        en_proceso: 'bg-blue-100 text-blue-800',
        derivado: 'bg-amber-100 text-amber-800',
        terminado: 'bg-green-100 text-green-800',
        entregado: 'bg-emerald-100 text-emerald-800',
        cancelado: 'bg-red-100 text-red-800',
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Trámites
                </h2>
            }
        >
            <Head title="Trámites" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {estados.map((estado) => (
                                <span
                                    key={estado}
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColors[estado] || 'bg-gray-100 text-gray-800'}`}
                                >
                                    {estado}
                                </span>
                            ))}
                        </div>
                        <Link
                            href={route('tramites.create')}
                            className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            + Nuevo Trámite
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">N° Secuencial</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha Recepción</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Referencia</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tipo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Solicitante</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Departamento</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {tramites.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                                                No hay trámites registrados.
                                            </td>
                                        </tr>
                                    ) : (
                                        tramites.data.map((tramite) => (
                                            <tr key={tramite.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {tramite.nro_secuencial}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {tramite.fecha_recepcion}
                                                </td>
                                                <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
                                                    {tramite.referencia}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {tramite.tipo_tramite?.nombre ?? '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {tramite.persona ? `${tramite.persona.apellidos}, ${tramite.persona.nombres}` : '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {tramite.departamento?.nombre ?? '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${badgeColors[tramite.estado] || 'bg-gray-100 text-gray-800'}`}
                                                    >
                                                        {tramite.estado}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('tramites.show', tramite.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <span className="text-gray-300">|</span>
                                                        <Link
                                                            href={route('tramites.edit', tramite.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Editar
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {tramites.last_page > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {tramites.from} a {tramites.to} de {tramites.total} registros
                                    </div>
                                    <div className="flex gap-1">
                                        {tramites.links.map((link, i) => (
                                            <button
                                                key={i}
                                                disabled={!link.url}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.get(link.url);
                                                    }
                                                }}
                                                className={`rounded-md px-3 py-1 text-sm ${
                                                    link.active
                                                        ? 'bg-gray-800 text-white'
                                                        : link.url
                                                          ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                          : 'cursor-not-allowed text-gray-400'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
