import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable, { Column, PaginatedMeta } from '@/Components/DataTable';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { highlightText } from '@/Components/DataTable';
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
interface PaginatedData {
    data: Usuario[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
export default function Index({ usuarios }: PageProps<{ usuarios?: PaginatedData }>) {
    if (!usuarios) return null;
    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este usuario?')) {
            router.delete(route('usuarios.destroy', id));
        }
    };
    const filterFn = (u: Usuario, q: string) => {
        const query = q.toLowerCase();
        return (
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            (u.rol?.nombre ?? '').toLowerCase().includes(query)
        );
    };
    const columns: Column<Usuario>[] = [
        { key: 'name', label: 'Nombre', render: (u, q) => highlightText(u.name, q) },
        { key: 'email', label: 'Email', render: (u, q) => highlightText(u.email, q) },
        { key: 'rol', label: 'Rol', render: (u, q) => highlightText(u.rol?.nombre ?? '-', q) },
        {
            key: 'activo',
            label: 'Activo',
            render: (u) =>
                u.activo ? <span className="text-green-600">Sí</span> : <span className="text-red-600">No</span>,
        },
        {
            key: 'acciones',
            label: 'Acciones',
            headerClassName: 'text-right',
            cellClassName: 'w-[1%] whitespace-nowrap text-right',
            render: (u) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Link
                        href={route('usuarios.show', u.id)}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-200"
                    >
                        Ver
                    </Link>
                    <Link
                        href={route('usuarios.edit', u.id)}
                        className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition-all hover:opacity-90"
                    >
                        Editar
                    </Link>
                    <button
                        onClick={() => handleDelete(u.id)}
                        className="inline-flex items-center rounded-full bg-red-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition-all hover:opacity-90"
                    >
                        Eliminar
                    </button>
                </div>
            ),
        },
    ];
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Usuarios</h2>}>
            {' '}
            <Head title="Usuarios" />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <DataTable
                        data={usuarios.data}
                        columns={columns}
                        meta={usuarios}
                        searchPlaceholder="Buscar por nombre, email o rol..."
                        createRoute={route('usuarios.create')}
                        emptyMessage="No hay usuarios registrados."
                        noResultsMessage="No se encontraron usuarios."
                        filterFn={filterFn}
                    />{' '}
                </div>{' '}
            </div>{' '}
        </AuthenticatedLayout>
    );
}
