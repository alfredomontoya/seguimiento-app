import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ComboboxInput } from '@/Components/ComboboxInput';
interface Option {
    id: number;
    nombre: string;
}
interface CreateTramiteForm {
    fecha_recepcion: string;
    referencia: string;
    tipo_tramite_id: string;
    persona_id: string;
    departamento_id: string;
    user_id: string;
}
export default function Create({
    tiposTramite = [],
    departamentos = [],
    personas = [],
    usuarios = [],
}: {
    tiposTramite?: Option[];
    departamentos?: Option[];
    personas?: { id: number; nro_documento: string; nombres: string; apellidos: string }[];
    usuarios?: { id: number; name: string; email: string }[];
}) {
    const { data, setData, post, errors, processing } = useForm<CreateTramiteForm>({
        fecha_recepcion: '',
        referencia: '',
        tipo_tramite_id: '',
        persona_id: '',
        departamento_id: '',
        user_id: '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tramites.store'));
    };
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800"> Nuevo Trámite </h2>}
        >
            {' '}
            <Head title="Nuevo Trámite" />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {' '}
                        <form onSubmit={submit} className="p-6">
                            {' '}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {' '}
                                <div>
                                    {' '}
                                    <InputLabel htmlFor="fecha_recepcion" value="Fecha de Recepción" />{' '}
                                    <TextInput
                                        id="fecha_recepcion"
                                        type="date"
                                        value={data.fecha_recepcion}
                                        onChange={(e) => setData('fecha_recepcion', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />{' '}
                                    <InputError message={errors.fecha_recepcion} className="mt-2" />{' '}
                                </div>{' '}
                                <div>
                                    {' '}
                                    <InputLabel htmlFor="referencia" value="Referencia" />{' '}
                                    <TextInput
                                        id="referencia"
                                        type="text"
                                        value={data.referencia}
                                        onChange={(e) => setData('referencia', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />{' '}
                                    <InputError message={errors.referencia} className="mt-2" />{' '}
                                </div>{' '}
                                <div>
                                    {' '}
                                    <InputLabel htmlFor="tipo_tramite_id" value="Tipo de Trámite" />{' '}
                                    <ComboboxInput
                                        options={tiposTramite.map((t) => ({ value: t.id.toString(), label: t.nombre }))}
                                        value={data.tipo_tramite_id}
                                        onChange={(val) => setData('tipo_tramite_id', val.toString())}
                                        placeholder="Seleccione un tipo"
                                    />{' '}
                                    <InputError message={errors.tipo_tramite_id} className="mt-2" />{' '}
                                </div>{' '}
                                <div>
                                    {' '}
                                    <InputLabel htmlFor="persona_id" value="Solicitante" />{' '}
                                    <ComboboxInput
                                        options={personas.map((p) => ({
                                            value: p.id.toString(),
                                            label: `${p.apellidos}, ${p.nombres} (${p.nro_documento})`,
                                        }))}
                                        value={data.persona_id}
                                        onChange={(val) => setData('persona_id', val.toString())}
                                        placeholder="Seleccione un solicitante"
                                    />{' '}
                                    <InputError message={errors.persona_id} className="mt-2" />{' '}
                                </div>{' '}
                                <div>
                                    {' '}
                                    <InputLabel htmlFor="departamento_id" value="Departamento" />{' '}
                                    <ComboboxInput
                                        options={departamentos.map((d) => ({
                                            value: d.id.toString(),
                                            label: d.nombre,
                                        }))}
                                        value={data.departamento_id}
                                        onChange={(val) => setData('departamento_id', val.toString())}
                                        placeholder="Seleccione un departamento"
                                    />{' '}
                                    <InputError message={errors.departamento_id} className="mt-2" />{' '}
                                </div>{' '}
                                <div>
                                    {' '}
                                    <InputLabel htmlFor="user_id" value="Usuario (opcional)" />{' '}
                                    <ComboboxInput
                                        options={[
                                            { value: '', label: 'Sin usuario' },
                                            ...usuarios.map((u) => ({
                                                value: u.id.toString(),
                                                label: `${u.name} (${u.email})`,
                                            })),
                                        ]}
                                        value={data.user_id}
                                        onChange={(val) => setData('user_id', val.toString())}
                                        placeholder="Sin usuario"
                                    />{' '}
                                    <InputError message={errors.user_id} className="mt-2" />{' '}
                                </div>{' '}
                            </div>{' '}
                            <div className="mt-6 flex items-center gap-4">
                                {' '}
                                <PrimaryButton disabled={processing}>Guardar</PrimaryButton>{' '}
                                <Link
                                    href={route('tramites.index')}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    {' '}
                                    Cancelar{' '}
                                </Link>{' '}
                            </div>{' '}
                        </form>{' '}
                    </div>{' '}
                </div>{' '}
            </div>{' '}
        </AuthenticatedLayout>
    );
}
