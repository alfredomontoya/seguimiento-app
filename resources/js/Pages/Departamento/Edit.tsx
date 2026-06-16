import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ComboboxInput } from '@/Components/ComboboxInput';
interface Departamento {
    id: number;
    nombre: string;
    sigla: string;
    descripcion: string | null;
    activo: boolean;
    departamento_padre_id: number | null;
    padre_id: number | null;
}
function buildOptions(departamentos: Departamento[], depth: number = 0): { value: string; label: string }[] {
    const result: { value: string; label: string }[] = [];
    for (const d of departamentos) {
        result.push({ value: d.id.toString(), label: `${'—'.repeat(depth)} ${d.nombre} (${d.sigla})`.trim() });
        result.push(
            ...buildOptions(
                departamentos.filter((c) => c.padre_id === d.id),
                depth + 1,
            ),
        );
    }
    return result;
}
export default function Edit({
    departamento,
    departamentos,
}: PageProps<{ departamento: Departamento; departamentos: Departamento[] }>) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: departamento.nombre,
        sigla: departamento.sigla,
        descripcion: departamento.descripcion ?? '',
        departamento_padre_id: departamento.departamento_padre_id?.toString() ?? '',
        activo: departamento.activo,
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('departamentos.update', departamento.id));
    };
    const filtered = departamentos.filter((d) => d.id !== departamento.id);
    const padreOptions = buildOptions(filtered);
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Departamento</h2>}
        >
            {' '}
            <Head title="Editar Departamento" />{' '}
            <div className="py-2">
                {' '}
                <div className="w-full">
                    {' '}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        {' '}
                        <form onSubmit={submit} className="space-y-6">
                            {' '}
                            <div>
                                {' '}
                                <InputLabel htmlFor="nombre" value="Nombre" />{' '}
                                <TextInput
                                    id="nombre"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    required
                                />{' '}
                                <InputError message={errors.nombre} className="mt-1" />{' '}
                            </div>{' '}
                            <div>
                                {' '}
                                <InputLabel htmlFor="sigla" value="Sigla" />{' '}
                                <TextInput
                                    id="sigla"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.sigla}
                                    onChange={(e) => setData('sigla', e.target.value)}
                                    required
                                />{' '}
                                <InputError message={errors.sigla} className="mt-1" />{' '}
                            </div>{' '}
                            <div>
                                {' '}
                                <InputLabel htmlFor="descripcion" value="Descripción" />{' '}
                                <textarea
                                    id="descripcion"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={3}
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                />{' '}
                                <InputError message={errors.descripcion} className="mt-1" />{' '}
                            </div>{' '}
                            <div>
                                {' '}
                                <InputLabel htmlFor="departamento_padre_id" value="Departamento Padre" />{' '}
                                <ComboboxInput
                                    options={[{ value: '', label: 'Sin padre (raíz)' }, ...padreOptions]}
                                    value={data.departamento_padre_id}
                                    onChange={(val) => setData('departamento_padre_id', val.toString())}
                                    placeholder="Sin padre (raíz)"
                                />{' '}
                                <InputError message={errors.departamento_padre_id} className="mt-1" />{' '}
                            </div>{' '}
                            <div className="flex items-center gap-2">
                                {' '}
                                <input
                                    type="checkbox"
                                    id="activo"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    checked={data.activo}
                                    onChange={(e) => setData('activo', e.target.checked)}
                                />{' '}
                                <InputLabel htmlFor="activo" value="Activo" />{' '}
                            </div>{' '}
                            <div className="flex items-center gap-4">
                                {' '}
                                <PrimaryButton disabled={processing}>Actualizar</PrimaryButton>{' '}
                                <Link
                                    href={route('departamentos.index')}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancelar
                                </Link>{' '}
                            </div>{' '}
                        </form>{' '}
                    </div>{' '}
                </div>{' '}
            </div>{' '}
        </AuthenticatedLayout>
    );
}
