import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface TipoTramite {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
    tramites_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: TipoTramite[];
    links: PaginationLink[];
    total: number;
    per_page: number;
    from: number;
    to: number;
}

export default function Index({ tiposTramite }: PageProps<{ tiposTramite: PaginatedData }>) {
    const items = tiposTramite.data;
    const links = tiposTramite.links;

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este tipo de trámite?')) {
            router.delete(route('tipos-tramite.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Tipos de Trámite</h2>
                    <Link href={route('tipos-tramite.create')} className="rounded-md bg-green-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-green-700">
                        + Nuevo
                    </Link>
                </div>
            }
        >
            <Head title="Tipos de Trámite" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto p-6">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Nombre</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Slug</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Descripción</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Trámites</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-3 font-medium">{t.nombre}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-gray-600">{t.slug}</td>
                                            <td className="px-4 py-3 text-gray-600">{t.descripcion ?? '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{t.tramites_count}</td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <Link href={route('tipos-tramite.edit', t.id)} className="mr-2 text-amber-600 hover:text-amber-900">Editar</Link>
                                                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay tipos de trámite registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {tiposTramite.total > tiposTramite.per_page && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando {tiposTramite.from}–{tiposTramite.to} de {tiposTramite.total}
                                    </p>
                                    <div className="flex gap-1">
                                        {links.map((link: PaginationLink, i: number) => (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className={`rounded px-3 py-1 text-sm ${
                                                    link.active
                                                        ? 'bg-green-800 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                        : 'cursor-not-allowed text-gray-400'
                                                }`}
                                                preserveState
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
