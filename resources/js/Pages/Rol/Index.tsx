import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Rol {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
    usuarios_count: number;
    permisos_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: Rol[];
    links: PaginationLink[];
    total: number;
    per_page: number;
    from: number;
    to: number;
}

export default function Index({ roles }: PageProps<{ roles: PaginatedData }>) {
    const items = roles.data;
    const links = roles.links;

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este rol?')) {
            router.delete(route('roles.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Roles</h2>
                    <Link href={route('roles.create')} className="rounded-md bg-green-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-green-700">
                        + Nuevo
                    </Link>
                </div>
            }
        >
            <Head title="Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto p-6">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Nombre</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Slug</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Usuarios</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Permisos</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-3 font-medium">{r.nombre}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-gray-600">{r.slug}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{r.usuarios_count}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{r.permisos_count}</td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <Link href={route('roles.edit', r.id)} className="mr-2 text-amber-600 hover:text-amber-900">Editar</Link>
                                                <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay roles registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {roles.total > roles.per_page && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando {roles.from}–{roles.to} de {roles.total}
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
