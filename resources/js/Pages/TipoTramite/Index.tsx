import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable, { Column, PaginatedMeta } from '@/Components/DataTable';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { highlightText } from '@/Components/DataTable';
interface TipoTramite {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
    tramites_count: number;
}
interface PaginatedData {
    data: TipoTramite[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
export default function Index({ tiposTramite }: PageProps<{ tiposTramite: PaginatedData }>) {
    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este tipo de trámite?')) {
            router.delete(route('tipos-tramite.destroy', id));
        }
    };
    const filterFn = (t: TipoTramite, q: string) => {
        const query = q.toLowerCase();
        return (
            t.nombre.toLowerCase().includes(query) ||
            t.slug.toLowerCase().includes(query) ||
            (t.descripcion ?? '').toLowerCase().includes(query)
        );
    };
    const columns: Column<TipoTramite>[] = [
        { key: 'nombre', label: 'Nombre', render: (t, q) => highlightText(t.nombre, q) },
        { key: 'slug', label: 'Slug', render: (t, q) => highlightText(t.slug, q) },
        { key: 'descripcion', label: 'Descripción', render: (t, q) => highlightText(t.descripcion ?? '-', q) },
        { key: 'tramites', label: 'Trámites', render: (t) => t.tramites_count },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (t) => (
                <div className="flex items-center gap-2">
                    {' '}
                    <Link href={route('tipos-tramite.edit', t.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Editar{' '}
                    </Link>{' '}
                    <span className="text-gray-300">|</span>{' '}
                    <button onClick={() => handleDelete(t.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Eliminar{' '}
                    </button>{' '}
                </div>
            ),
        },
    ];
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tipos de Trámite</h2>}
        >
            {' '}
            <Head title="Tipos de Trámite" />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <DataTable
                        data={tiposTramite.data}
                        columns={columns}
                        meta={tiposTramite}
                        searchPlaceholder="Buscar por nombre, slug o descripción..."
                        createRoute={route('tipos-tramite.create')}
                        emptyMessage="No hay tipos de trámite registrados."
                        noResultsMessage="No se encontraron tipos de trámite."
                        filterFn={filterFn}
                    />{' '}
                </div>{' '}
            </div>{' '}
        </AuthenticatedLayout>
    );
}
