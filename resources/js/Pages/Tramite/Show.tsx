import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { ComboboxInput } from '@/Components/ComboboxInput';
interface Derivacion {
    id: number;
    fecha_asignacion: string;
    comentarios_internos: string | null;
    glosa: string | null;
    created_at: string;
    departamento_origen: { id: number; nombre: string };
    departamento_destino: { id: number; nombre: string };
    user: { id: number; name: string } | null;
    creado_por: { id: number; name: string } | null;
}
interface TramiteDetail {
    id: number;
    nro_secuencial: string;
    fecha_recepcion: string;
    referencia: string;
    estado: string;
    fecha_termino: string | null;
    glosa_entrega: string | null;
    tipo_tramite: { id: number; nombre: string } | null;
    persona: {
        id: number;
        nro_documento: string;
        nombres: string;
        apellidos: string;
        telefono: string | null;
        email: string | null;
        direccion: string | null;
    } | null;
    departamento: { id: number; nombre: string; sigla: string | null } | null;
    derivaciones: Derivacion[];
    creado_por: { id: number; name: string } | null;
}
interface Option {
    id: number;
    nombre: string;
}
const badgeColors: Record<string, string> = {
    recibido: 'bg-gray-100 text-gray-800',
    en_proceso: 'bg-blue-100 text-blue-800',
    derivado: 'bg-amber-100 text-amber-800',
    terminado: 'bg-green-100 text-green-800',
    entregado: 'bg-emerald-100 text-emerald-800',
    cancelado: 'bg-red-100 text-red-800',
};
export default function Show({
    tramite,
    departamentos,
    usuarios,
}: {
    tramite: TramiteDetail;
    departamentos: Option[];
    usuarios: { id: number; name: string; email: string }[];
}) {
    const [showDerivar, setShowDerivar] = useState(false);
    const [showReasignar, setShowReasignar] = useState(false);
    const [showCancelar, setShowCancelar] = useState(false);
    const [showEntregar, setShowEntregar] = useState(false);
    const derivarForm = useForm({
        departamento_destino_id: '',
        user_id: '',
        comentarios_internos: '',
        glosa: '',
    });
    const reasignarForm = useForm({ departamento_id: '', user_id: '' });
    const entregarForm = useForm({ glosa_entrega: '' });
    const handleDerivar = (e: React.FormEvent) => {
        e.preventDefault();
        derivarForm.post(route('tramites.derivar', tramite.id), { onSuccess: () => setShowDerivar(false) });
    };
    const handleReasignar = (e: React.FormEvent) => {
        e.preventDefault();
        reasignarForm.post(route('tramites.reasignar', tramite.id), { onSuccess: () => setShowReasignar(false) });
    };
    const handleCancelar = () => {
        router.post(route('tramites.cancelar', tramite.id));
    };
    const handleEntregar = (e: React.FormEvent) => {
        e.preventDefault();
        entregarForm.post(route('tramites.entregar', tramite.id), { onSuccess: () => setShowEntregar(false) });
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {' '}
                    Trámite {tramite.nro_secuencial}{' '}
                </h2>
            }
        >
            {' '}
            <Head title={`Trámite ${tramite.nro_secuencial}`} />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <div className="mb-6">
                        {' '}
                        <Link href={route('tramites.index')} className="text-sm text-indigo-600 hover:text-indigo-900">
                            {' '}
                            &larr; Volver a trámites{' '}
                        </Link>{' '}
                    </div>{' '}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {' '}
                        <div className="lg:col-span-2 space-y-6">
                            {' '}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                {' '}
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    {' '}
                                    <h3 className="text-base font-semibold text-gray-900">Datos del Trámite</h3>{' '}
                                </div>{' '}
                                <div className="p-6">
                                    {' '}
                                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {' '}
                                        <div>
                                            {' '}
                                            <dt className="text-sm font-medium text-gray-500">N° Secuencial</dt>{' '}
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {tramite.nro_secuencial}
                                            </dd>{' '}
                                        </div>{' '}
                                        <div>
                                            {' '}
                                            <dt className="text-sm font-medium text-gray-500">
                                                Fecha de Recepción
                                            </dt>{' '}
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {tramite.fecha_recepcion}
                                            </dd>{' '}
                                        </div>{' '}
                                        <div className="sm:col-span-2">
                                            {' '}
                                            <dt className="text-sm font-medium text-gray-500">Referencia</dt>{' '}
                                            <dd className="mt-1 text-sm text-gray-900">{tramite.referencia}</dd>{' '}
                                        </div>{' '}
                                        <div>
                                            {' '}
                                            <dt className="text-sm font-medium text-gray-500">Tipo de Trámite</dt>{' '}
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {tramite.tipo_tramite?.nombre ?? '-'}
                                            </dd>{' '}
                                        </div>{' '}
                                        <div>
                                            {' '}
                                            <dt className="text-sm font-medium text-gray-500">Estado</dt>{' '}
                                            <dd className="mt-1">
                                                {' '}
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${badgeColors[tramite.estado] || 'bg-gray-100 text-gray-800'}`}
                                                >
                                                    {' '}
                                                    {tramite.estado}{' '}
                                                </span>{' '}
                                            </dd>{' '}
                                        </div>{' '}
                                        {tramite.fecha_termino && (
                                            <div>
                                                {' '}
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Fecha de Término
                                                </dt>{' '}
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {tramite.fecha_termino}
                                                </dd>{' '}
                                            </div>
                                        )}{' '}
                                        {tramite.glosa_entrega && (
                                            <div className="sm:col-span-2">
                                                {' '}
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Glosa de Entrega
                                                </dt>{' '}
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {tramite.glosa_entrega}
                                                </dd>{' '}
                                            </div>
                                        )}{' '}
                                    </dl>{' '}
                                </div>{' '}
                            </div>{' '}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                {' '}
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    {' '}
                                    <h3 className="text-base font-semibold text-gray-900">Solicitante</h3>{' '}
                                </div>{' '}
                                <div className="p-6">
                                    {' '}
                                    {tramite.persona ? (
                                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {' '}
                                            <div>
                                                {' '}
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Nombre Completo
                                                </dt>{' '}
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {' '}
                                                    {tramite.persona.apellidos}, {tramite.persona.nombres}{' '}
                                                </dd>{' '}
                                            </div>{' '}
                                            <div>
                                                {' '}
                                                <dt className="text-sm font-medium text-gray-500">N° Documento</dt>{' '}
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {tramite.persona.nro_documento}
                                                </dd>{' '}
                                            </div>{' '}
                                            {tramite.persona.telefono && (
                                                <div>
                                                    {' '}
                                                    <dt className="text-sm font-medium text-gray-500">Teléfono</dt>{' '}
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {tramite.persona.telefono}
                                                    </dd>{' '}
                                                </div>
                                            )}{' '}
                                            {tramite.persona.email && (
                                                <div>
                                                    {' '}
                                                    <dt className="text-sm font-medium text-gray-500">Email</dt>{' '}
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {tramite.persona.email}
                                                    </dd>{' '}
                                                </div>
                                            )}{' '}
                                            {tramite.persona.direccion && (
                                                <div className="sm:col-span-2">
                                                    {' '}
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Dirección
                                                    </dt>{' '}
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {tramite.persona.direccion}
                                                    </dd>{' '}
                                                </div>
                                            )}{' '}
                                        </dl>
                                    ) : (
                                        <p className="text-sm text-gray-500">Sin solicitante registrado.</p>
                                    )}{' '}
                                </div>{' '}
                            </div>{' '}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                {' '}
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    {' '}
                                    <h3 className="text-base font-semibold text-gray-900">Departamento Actual</h3>{' '}
                                </div>{' '}
                                <div className="p-6">
                                    {' '}
                                    {tramite.departamento ? (
                                        <div>
                                            {' '}
                                            <p className="text-sm text-gray-900">{tramite.departamento.nombre}</p>{' '}
                                            {tramite.departamento.sigla && (
                                                <p className="text-sm text-gray-500">{tramite.departamento.sigla}</p>
                                            )}{' '}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Sin departamento asignado.</p>
                                    )}{' '}
                                </div>{' '}
                            </div>{' '}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                {' '}
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    {' '}
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Historial de Derivaciones
                                    </h3>{' '}
                                </div>{' '}
                                <div className="p-6">
                                    {' '}
                                    {tramite.derivaciones.length === 0 ? (
                                        <p className="text-sm text-gray-500">Sin derivaciones registradas.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            {' '}
                                            <table className="min-w-full divide-y divide-gray-200">
                                                {' '}
                                                <thead className="bg-gradient-to-b from-green-800 to-green-600">
                                                    {' '}
                                                    <tr>
                                                        {' '}
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                                                            Fecha
                                                        </th>{' '}
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                                                            Origen
                                                        </th>{' '}
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                                                            Destino
                                                        </th>{' '}
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                                                            Usuario
                                                        </th>{' '}
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                                                            Glosa
                                                        </th>{' '}
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                                                            Derivado por
                                                        </th>{' '}
                                                    </tr>{' '}
                                                </thead>{' '}
                                                <tbody className="divide-y divide-gray-200">
                                                    {' '}
                                                    {tramite.derivaciones.map((d) => (
                                                        <tr key={d.id} className="hover:bg-gray-50">
                                                            {' '}
                                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                                {' '}
                                                                {d.fecha_asignacion || d.created_at?.slice(0, 10)}{' '}
                                                            </td>{' '}
                                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                                {' '}
                                                                {d.departamento_origen?.nombre ?? '-'}{' '}
                                                            </td>{' '}
                                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                                {' '}
                                                                {d.departamento_destino?.nombre ?? '-'}{' '}
                                                            </td>{' '}
                                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                                {' '}
                                                                {d.user ? d.user.name : '-'}{' '}
                                                            </td>{' '}
                                                            <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-500">
                                                                {' '}
                                                                {d.glosa || d.comentarios_internos || '-'}{' '}
                                                            </td>{' '}
                                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                                {' '}
                                                                {d.creado_por?.name ?? '-'}{' '}
                                                            </td>{' '}
                                                        </tr>
                                                    ))}{' '}
                                                </tbody>{' '}
                                            </table>{' '}
                                        </div>
                                    )}{' '}
                                </div>{' '}
                            </div>{' '}
                        </div>{' '}
                        <div className="space-y-4">
                            {' '}
                            {tramite.estado === 'en_proceso' && (
                                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    {' '}
                                    <div className="p-4">
                                        {' '}
                                        <SecondaryButton
                                            onClick={() => setShowDerivar(true)}
                                            className="w-full justify-center"
                                        >
                                            {' '}
                                            Derivar Trámite{' '}
                                        </SecondaryButton>{' '}
                                    </div>{' '}
                                </div>
                            )}{' '}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                {' '}
                                <div className="p-4 space-y-3">
                                    {' '}
                                    <PrimaryButton
                                        onClick={() => setShowReasignar(true)}
                                        className="w-full justify-center"
                                    >
                                        {' '}
                                        Reasignar{' '}
                                    </PrimaryButton>{' '}
                                    <DangerButton
                                        onClick={() => setShowCancelar(true)}
                                        className="w-full justify-center"
                                    >
                                        {' '}
                                        Cancelar Trámite{' '}
                                    </DangerButton>{' '}
                                    <PrimaryButton
                                        onClick={() => setShowEntregar(true)}
                                        className="w-full justify-center"
                                    >
                                        {' '}
                                        Entregar{' '}
                                    </PrimaryButton>{' '}
                                </div>{' '}
                            </div>{' '}
                        </div>{' '}
                    </div>{' '}
                </div>{' '}
            </div>{' '}
            <Modal show={showDerivar} onClose={() => setShowDerivar(false)} maxWidth="lg">
                {' '}
                <form onSubmit={handleDerivar} className="p-6">
                    {' '}
                    <h3 className="mb-4 text-lg font-medium text-gray-900">Derivar Trámite</h3>{' '}
                    <div className="space-y-4">
                        {' '}
                        <div>
                            {' '}
                            <InputLabel htmlFor="derivar_departamento_destino_id" value="Departamento Destino" />{' '}
                            <ComboboxInput
                                options={departamentos.map((d) => ({ value: d.id.toString(), label: d.nombre }))}
                                value={derivarForm.data.departamento_destino_id}
                                onChange={(val) => derivarForm.setData('departamento_destino_id', val.toString())}
                                placeholder="Seleccione departamento"
                            />{' '}
                            <InputError message={derivarForm.errors.departamento_destino_id} className="mt-2" />{' '}
                        </div>{' '}
                        <div>
                            {' '}
                            <InputLabel htmlFor="derivar_user_id" value="Usuario" />{' '}
                            <ComboboxInput
                                options={[
                                    { value: '', label: 'Sin usuario' },
                                    ...usuarios.map((u) => ({
                                        value: u.id.toString(),
                                        label: `${u.name} (${u.email})`,
                                    })),
                                ]}
                                value={derivarForm.data.user_id}
                                onChange={(val) => derivarForm.setData('user_id', val.toString())}
                                placeholder="Sin usuario"
                            />{' '}
                            <InputError message={derivarForm.errors.user_id} className="mt-2" />{' '}
                        </div>{' '}
                        <div>
                            {' '}
                            <InputLabel htmlFor="derivar_comentarios" value="Comentarios Internos" />{' '}
                            <textarea
                                id="derivar_comentarios"
                                value={derivarForm.data.comentarios_internos}
                                onChange={(e) => derivarForm.setData('comentarios_internos', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />{' '}
                            <InputError message={derivarForm.errors.comentarios_internos} className="mt-2" />{' '}
                        </div>{' '}
                        <div>
                            {' '}
                            <InputLabel htmlFor="derivar_glosa" value="Glosa" />{' '}
                            <textarea
                                id="derivar_glosa"
                                value={derivarForm.data.glosa}
                                onChange={(e) => derivarForm.setData('glosa', e.target.value)}
                                rows={2}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />{' '}
                            <InputError message={derivarForm.errors.glosa} className="mt-2" />{' '}
                        </div>{' '}
                    </div>{' '}
                    <div className="mt-6 flex justify-end gap-3">
                        {' '}
                        <SecondaryButton type="button" onClick={() => setShowDerivar(false)}>
                            {' '}
                            Cancelar{' '}
                        </SecondaryButton>{' '}
                        <PrimaryButton disabled={derivarForm.processing}> Derivar </PrimaryButton>{' '}
                    </div>{' '}
                </form>{' '}
            </Modal>{' '}
            <Modal show={showReasignar} onClose={() => setShowReasignar(false)} maxWidth="lg">
                {' '}
                <form onSubmit={handleReasignar} className="p-6">
                    {' '}
                    <h3 className="mb-4 text-lg font-medium text-gray-900">Reasignar Trámite</h3>{' '}
                    <div className="space-y-4">
                        {' '}
                        <div>
                            {' '}
                            <InputLabel htmlFor="reasignar_departamento_id" value="Departamento" />{' '}
                            <ComboboxInput
                                options={departamentos.map((d) => ({ value: d.id.toString(), label: d.nombre }))}
                                value={reasignarForm.data.departamento_id}
                                onChange={(val) => reasignarForm.setData('departamento_id', val.toString())}
                                placeholder="Seleccione departamento"
                            />{' '}
                            <InputError message={reasignarForm.errors.departamento_id} className="mt-2" />{' '}
                        </div>{' '}
                        <div>
                            {' '}
                            <InputLabel htmlFor="reasignar_user_id" value="Usuario" />{' '}
                            <ComboboxInput
                                options={[
                                    { value: '', label: 'Sin usuario' },
                                    ...usuarios.map((u) => ({
                                        value: u.id.toString(),
                                        label: `${u.name} (${u.email})`,
                                    })),
                                ]}
                                value={reasignarForm.data.user_id}
                                onChange={(val) => reasignarForm.setData('user_id', val.toString())}
                                placeholder="Sin usuario"
                            />{' '}
                            <InputError message={reasignarForm.errors.user_id} className="mt-2" />{' '}
                        </div>{' '}
                    </div>{' '}
                    <div className="mt-6 flex justify-end gap-3">
                        {' '}
                        <SecondaryButton type="button" onClick={() => setShowReasignar(false)}>
                            {' '}
                            Cancelar{' '}
                        </SecondaryButton>{' '}
                        <PrimaryButton disabled={reasignarForm.processing}> Reasignar </PrimaryButton>{' '}
                    </div>{' '}
                </form>{' '}
            </Modal>{' '}
            <Modal show={showCancelar} onClose={() => setShowCancelar(false)} maxWidth="sm">
                {' '}
                <div className="p-6">
                    {' '}
                    <h3 className="mb-2 text-lg font-medium text-gray-900">Cancelar Trámite</h3>{' '}
                    <p className="mb-6 text-sm text-gray-600">
                        {' '}
                        ¿Está seguro de que desea cancelar el trámite {tramite.nro_secuencial}? Esta acción no se puede
                        deshacer.{' '}
                    </p>{' '}
                    <div className="flex justify-end gap-3">
                        {' '}
                        <SecondaryButton onClick={() => setShowCancelar(false)}> No, volver </SecondaryButton>{' '}
                        <DangerButton onClick={handleCancelar}> Sí, cancelar trámite </DangerButton>{' '}
                    </div>{' '}
                </div>{' '}
            </Modal>{' '}
            <Modal show={showEntregar} onClose={() => setShowEntregar(false)} maxWidth="lg">
                {' '}
                <form onSubmit={handleEntregar} className="p-6">
                    {' '}
                    <h3 className="mb-4 text-lg font-medium text-gray-900">Entregar Trámite</h3>{' '}
                    <div>
                        {' '}
                        <InputLabel htmlFor="glosa_entrega" value="Glosa de Entrega" />{' '}
                        <textarea
                            id="glosa_entrega"
                            value={entregarForm.data.glosa_entrega}
                            onChange={(e) => entregarForm.setData('glosa_entrega', e.target.value)}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />{' '}
                        <InputError message={entregarForm.errors.glosa_entrega} className="mt-2" />{' '}
                    </div>{' '}
                    <div className="mt-6 flex justify-end gap-3">
                        {' '}
                        <SecondaryButton type="button" onClick={() => setShowEntregar(false)}>
                            {' '}
                            Cancelar{' '}
                        </SecondaryButton>{' '}
                        <PrimaryButton disabled={entregarForm.processing}> Entregar </PrimaryButton>{' '}
                    </div>{' '}
                </form>{' '}
            </Modal>{' '}
        </AuthenticatedLayout>
    );
}
