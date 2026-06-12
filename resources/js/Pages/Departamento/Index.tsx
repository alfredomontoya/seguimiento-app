import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Departamento {
    id: number;
    nombre: string;
    sigla: string;
    activo: boolean;
    departamento_padre: { id: number; nombre: string } | null;
    funcionarios_count: number;
    tramites_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: Departamento[];
    links: PaginationLink[];
    total: number;
    per_page: number;
    from: number;
    to: number;
}

export default function Index({ departamentos }: PageProps<{ departamentos: PaginatedData }>) {
    const items = departamentos.data;
    const links = departamentos.links;

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este departamento?')) {
            router.delete(route('departamentos.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Departamentos</h2>
                    <Link href={route('departamentos.create')} className="rounded-md bg-green-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-green-700">
                        + Nuevo
                    </Link>
                </div>
            }
        >
            <Head title="Departamentos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto p-6">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Nombre</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Sigla</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Padre</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Activo</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Funcionarios</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Trámites</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((d) => (
                                        <tr key={d.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-3 font-medium">{d.nombre}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-gray-600">{d.sigla}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-gray-600">{d.departamento_padre?.nombre ?? '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {d.activo ? <span className="text-green-600">Sí</span> : <span className="text-red-600">No</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">{d.funcionarios_count}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{d.tramites_count}</td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <Link href={route('departamentos.edit', d.id)} className="mr-2 text-amber-600 hover:text-amber-900">Editar</Link>
                                                <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No hay departamentos registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {departamentos.total > departamentos.per_page && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando {departamentos.from}–{departamentos.to} de {departamentos.total}
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
