import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Persona {
    id: number;
    nro_documento: string;
    nombres: string;
    apellidos: string;
    telefono: string | null;
    email: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: Persona[];
    links: PaginationLink[];
    total: number;
    per_page: number;
    from: number;
    to: number;
}

export default function Index({ personas }: PageProps<{ personas: PaginatedData }>) {
    const items = personas.data;
    const links = personas.links;

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar esta persona?')) {
            router.delete(route('personas.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Personas</h2>
                    <Link href={route('personas.create')} className="rounded-md bg-green-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-green-700">
                        + Nueva
                    </Link>
                </div>
            }
        >
            <Head title="Personas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto p-6">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Nro. Documento</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Nombres</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Apellidos</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Teléfono</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-3 font-medium">{p.nro_documento}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{p.nombres}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{p.apellidos}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{p.telefono ?? '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{p.email ?? '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <Link href={route('personas.edit', p.id)} className="mr-2 text-amber-600 hover:text-amber-900">Editar</Link>
                                                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No hay personas registradas.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {personas.total > personas.per_page && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando {personas.from}–{personas.to} de {personas.total}
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
