import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Rol {
    id: number;
    nombre: string;
    slug: string;
}

interface Usuario {
    id: number;
    name: string;
    email: string;
    activo: boolean;
    rol: Rol | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    total: number;
    per_page: number;
    from: number;
    to: number;
}

export default function Index({ usuarios }: PageProps<{ usuarios?: PaginatedData<Usuario> }>) {
    if (!usuarios) return null;

    const items = usuarios.data;
    const links = usuarios.links;

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este usuario?')) {
            router.delete(route('usuarios.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Usuarios</h2>
                    <Link href={route('usuarios.create')} className="rounded-md bg-green-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-green-700">
                        + Nuevo
                    </Link>
                </div>
            }
        >
            <Head title="Usuarios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto p-6">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Nombre</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Rol</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Activo</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((u: Usuario) => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-3">{u.name}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{u.email}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{u.rol?.nombre ?? '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {u.activo ? <span className="text-green-600">Sí</span> : <span className="text-red-600">No</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <Link href={route('usuarios.show', u.id)} className="mr-2 text-blue-600 hover:text-blue-900">Ver</Link>
                                                <Link href={route('usuarios.edit', u.id)} className="mr-2 text-amber-600 hover:text-amber-900">Editar</Link>
                                                <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay usuarios registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {usuarios.total > usuarios.per_page && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando {usuarios.from}–{usuarios.to} de {usuarios.total}
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
