import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable, { Column, PaginatedMeta } from '@/Components/DataTable';
import { Head, Link } from '@inertiajs/react';
interface Tramite {
    id: number;
    nro_secuencial: string;
    fecha_recepcion: string;
    referencia: string;
    estado: string;
    tipo_tramite: { id: number; nombre: string } | null;
    persona: { id: number; nombres: string; apellidos: string } | null;
    departamento: { id: number; nombre: string } | null;
}
interface PaginatedData {
    data: Tramite[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
const badgeColors: Record<string, string> = {
    recibido: 'bg-gray-100 text-gray-800',
    en_proceso: 'bg-blue-100 text-blue-800',
    derivado: 'bg-amber-100 text-amber-800',
    terminado: 'bg-green-100 text-green-800',
    entregado: 'bg-emerald-100 text-emerald-800',
    cancelado: 'bg-red-100 text-red-800',
};
export default function Index({ tramites, estados }: { tramites: PaginatedData; estados: string[] }) {
    const columns: Column<Tramite>[] = [
        { key: 'nro_secuencial', label: 'N° Secuencial', render: (t) => t.nro_secuencial },
        { key: 'fecha_recepcion', label: 'Fecha Recepción', render: (t) => t.fecha_recepcion },
        { key: 'referencia', label: 'Referencia', cellClassName: 'max-w-xs truncate', render: (t) => t.referencia },
        { key: 'tipo', label: 'Tipo', render: (t) => t.tipo_tramite?.nombre ?? '-' },
        {
            key: 'solicitante',
            label: 'Solicitante',
            render: (t) => (t.persona ? `${t.persona.apellidos}, ${t.persona.nombres}` : '-'),
        },
        { key: 'departamento', label: 'Departamento', render: (t) => t.departamento?.nombre ?? '-' },
        {
            key: 'estado',
            label: 'Estado',
            render: (t) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${badgeColors[t.estado] || 'bg-gray-100 text-gray-800'}`}
                >
                    {' '}
                    {t.estado}{' '}
                </span>
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (t) => (
                <div className="flex items-center gap-2">
                    {' '}
                    <Link href={route('tramites.show', t.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Ver{' '}
                    </Link>{' '}
                    <span className="text-gray-300">|</span>{' '}
                    <Link href={route('tramites.edit', t.id)} className="text-indigo-600 hover:text-indigo-900">
                        {' '}
                        Editar{' '}
                    </Link>{' '}
                </div>
            ),
        },
    ];
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Trámites</h2>}>
            {' '}
            <Head title="Trámites" />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <div className="mb-6 flex items-center justify-between">
                        {' '}
                        <div className="flex items-center gap-2">
                            {' '}
                            {estados.map((estado) => (
                                <span
                                    key={estado}
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColors[estado] || 'bg-gray-100 text-gray-800'}`}
                                >
                                    {' '}
                                    {estado}{' '}
                                </span>
                            ))}{' '}
                        </div>{' '}
                        <Link
                            href={route('tramites.create')}
                            className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {' '}
                            + Nuevo Trámite{' '}
                        </Link>{' '}
                    </div>{' '}
                    <DataTable
                        data={tramites.data}
                        columns={columns}
                        meta={tramites}
                        emptyMessage="No hay trámites registrados."
                    />{' '}
                </div>{' '}
            </div>{' '}
        </AuthenticatedLayout>
    );
}
