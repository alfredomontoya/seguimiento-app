import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable, { Column, PaginatedMeta } from '@/Components/DataTable';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { highlightText } from '@/Components/DataTable';
interface Permiso {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
}
interface PaginatedData {
    data: Permiso[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
export default function Index({ permisos }: PageProps<{ permisos: PaginatedData }>) {
    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este permiso?')) {
            router.delete(route('permisos.destroy', id));
        }
    };
    const filterFn = (p: Permiso, q: string) => {
        const query = q.toLowerCase();
        return (
            p.nombre.toLowerCase().includes(query) ||
            p.slug.toLowerCase().includes(query) ||
            (p.descripcion ?? '').toLowerCase().includes(query)
        );
    };
    const columns: Column<Permiso>[] = [
        { key: 'nombre', label: 'Nombre', render: (p, q) => highlightText(p.nombre, q) },
        { key: 'slug', label: 'Slug', render: (p, q) => highlightText(p.slug, q) },
        { key: 'descripcion', label: 'Descripción', render: (p, q) => highlightText(p.descripcion ?? '-', q) },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (p) => (
                <div className="flex items-center gap-2">
                    {' '}
                    <Link href={route('permisos.edit', p.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Editar{' '}
                    </Link>{' '}
                    <span className="text-gray-300">|</span>{' '}
                    <button onClick={() => handleDelete(p.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Eliminar{' '}
                    </button>{' '}
                </div>
            ),
        },
    ];
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Permisos</h2>}>
            {' '}
            <Head title="Permisos" />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <DataTable
                        data={permisos.data}
                        columns={columns}
                        meta={permisos}
                        searchPlaceholder="Buscar por nombre, slug o descripción..."
                        createRoute={route('permisos.create')}
                        emptyMessage="No hay permisos registrados."
                        noResultsMessage="No se encontraron permisos."
                        filterFn={filterFn}
                    />{' '}
                </div>{' '}
            </div>{' '}
        </AuthenticatedLayout>
    );
}
