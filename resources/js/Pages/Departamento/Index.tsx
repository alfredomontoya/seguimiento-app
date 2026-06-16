import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable, { Column, PaginatedMeta } from '@/Components/DataTable';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { highlightText } from '@/Components/DataTable';
interface Departamento {
    id: number;
    nombre: string;
    sigla: string;
    activo: boolean;
    departamento_padre: { id: number; nombre: string } | null;
    usuarios_count: number;
    tramites_count: number;
}
interface PaginatedData {
    data: Departamento[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
export default function Index({ departamentos }: PageProps<{ departamentos: PaginatedData }>) {
    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este departamento?')) {
            router.delete(route('departamentos.destroy', id));
        }
    };
    const filterFn = (d: Departamento, q: string) => {
        const query = q.toLowerCase();
        return (
            d.nombre.toLowerCase().includes(query) ||
            d.sigla.toLowerCase().includes(query) ||
            (d.departamento_padre?.nombre ?? '').toLowerCase().includes(query)
        );
    };
    const columns: Column<Departamento>[] = [
        { key: 'nombre', label: 'Nombre', render: (d, q) => highlightText(d.nombre, q) },
        { key: 'sigla', label: 'Sigla', render: (d, q) => highlightText(d.sigla, q) },
        { key: 'padre', label: 'Padre', render: (d, q) => highlightText(d.departamento_padre?.nombre ?? '-', q) },
        {
            key: 'activo',
            label: 'Activo',
            render: (d) =>
                d.activo ? <span className="text-green-600">Sí</span> : <span className="text-red-600">No</span>,
        },
        { key: 'usuarios', label: 'Usuarios', render: (d) => d.usuarios_count },
        { key: 'tramites', label: 'Trámites', render: (d) => d.tramites_count },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (d) => (
                <div className="flex items-center gap-2">
                    {' '}
                    <Link href={route('departamentos.edit', d.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Editar{' '}
                    </Link>{' '}
                    <span className="text-gray-300">|</span>{' '}
                    <button onClick={() => handleDelete(d.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Eliminar{' '}
                    </button>{' '}
                </div>
            ),
        },
    ];
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Departamentos</h2>}
        >
            {' '}
            <Head title="Departamentos" />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <DataTable
                        data={departamentos.data}
                        columns={columns}
                        meta={departamentos}
                        searchPlaceholder="Buscar por nombre, sigla o departamento padre..."
                        createRoute={route('departamentos.create')}
                        emptyMessage="No hay departamentos registrados."
                        noResultsMessage="No se encontraron departamentos."
                        filterFn={filterFn}
                    />{' '}
                </div>{' '}
            </div>{' '}
        </AuthenticatedLayout>
    );
}
