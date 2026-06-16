import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable, { Column, PaginatedMeta } from '@/Components/DataTable';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { highlightText } from '@/Components/DataTable';
interface Rol {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
    usuarios_count: number;
    permisos_count: number;
}
interface PaginatedData {
    data: Rol[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
export default function Index({ roles }: PageProps<{ roles: PaginatedData }>) {
    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este rol?')) {
            router.delete(route('roles.destroy', id));
        }
    };
    const filterFn = (r: Rol, q: string) => {
        const query = q.toLowerCase();
        return r.nombre.toLowerCase().includes(query) || r.slug.toLowerCase().includes(query);
    };
    const columns: Column<Rol>[] = [
        { key: 'nombre', label: 'Nombre', render: (r, q) => highlightText(r.nombre, q) },
        { key: 'slug', label: 'Slug', render: (r, q) => highlightText(r.slug, q) },
        { key: 'usuarios', label: 'Usuarios', render: (r) => r.usuarios_count },
        { key: 'permisos', label: 'Permisos', render: (r) => r.permisos_count },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (r) => (
                <div className="flex items-center gap-2">
                    {' '}
                    <Link href={route('roles.edit', r.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Editar{' '}
                    </Link>{' '}
                    <span className="text-gray-300">|</span>{' '}
                    <button onClick={() => handleDelete(r.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Eliminar{' '}
                    </button>{' '}
                </div>
            ),
        },
    ];
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Roles</h2>}>
            {' '}
            <Head title="Roles" />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <DataTable
                        data={roles.data}
                        columns={columns}
                        meta={roles}
                        searchPlaceholder="Buscar por nombre o slug..."
                        createRoute={route('roles.create')}
                        emptyMessage="No hay roles registrados."
                        noResultsMessage="No se encontraron roles."
                        filterFn={filterFn}
                    />{' '}
                </div>{' '}
            </div>{' '}
        </AuthenticatedLayout>
    );
}
