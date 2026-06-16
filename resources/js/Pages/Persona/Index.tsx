import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable, { Column, PaginatedMeta } from '@/Components/DataTable';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { highlightText } from '@/Components/DataTable';
interface Persona {
    id: number;
    nro_documento: string;
    nombres: string;
    apellidos: string;
    telefono: string | null;
    email: string | null;
}
interface PaginatedData {
    data: Persona[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
export default function Index({ personas }: PageProps<{ personas: PaginatedData }>) {
    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar esta persona?')) {
            router.delete(route('personas.destroy', id));
        }
    };
    const filterFn = (p: Persona, q: string) => {
        const query = q.toLowerCase();
        return (
            p.nro_documento.toLowerCase().includes(query) ||
            p.nombres.toLowerCase().includes(query) ||
            p.apellidos.toLowerCase().includes(query)
        );
    };
    const columns: Column<Persona>[] = [
        { key: 'documento', label: 'Nro. Documento', render: (p, q) => highlightText(p.nro_documento, q) },
        { key: 'nombres', label: 'Nombres', render: (p, q) => highlightText(p.nombres, q) },
        { key: 'apellidos', label: 'Apellidos', render: (p, q) => highlightText(p.apellidos, q) },
        { key: 'telefono', label: 'Teléfono', render: (p) => p.telefono ?? '-' },
        { key: 'email', label: 'Email', render: (p) => p.email ?? '-' },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (p) => (
                <div className="flex items-center gap-2">
                    {' '}
                    <Link href={route('personas.edit', p.id)} className="text-indigo-600 hover:text-indigo-900">
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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Personas</h2>}>
            {' '}
            <Head title="Personas" />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <DataTable
                        data={personas.data}
                        columns={columns}
                        meta={personas}
                        searchPlaceholder="Buscar por documento, nombres o apellidos..."
                        createRoute={route('personas.create')}
                        createLabel="Nueva"
                        emptyMessage="No hay personas registradas."
                        noResultsMessage="No se encontraron personas."
                        filterFn={filterFn}
                    />{' '}
                </div>{' '}
            </div>{' '}
        </AuthenticatedLayout>
    );
}
