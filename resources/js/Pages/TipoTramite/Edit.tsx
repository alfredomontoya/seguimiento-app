import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
interface TipoTramite {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
}
export default function Edit({ tipo_tramite }: PageProps<{ tipo_tramite: TipoTramite }>) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: tipo_tramite.nombre,
        slug: tipo_tramite.slug,
        descripcion: tipo_tramite.descripcion ?? '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('tipos-tramite.update', tipo_tramite.id));
    };
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Tipo de Trámite</h2>}
        >
            {' '}
            <Head title="Editar Tipo de Trámite" />{' '}
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
                                <InputLabel htmlFor="slug" value="Slug" />{' '}
                                <TextInput
                                    id="slug"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    required
                                />{' '}
                                <InputError message={errors.slug} className="mt-1" />{' '}
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
                            <div className="flex items-center gap-4">
                                {' '}
                                <PrimaryButton disabled={processing}>Actualizar</PrimaryButton>{' '}
                                <Link
                                    href={route('tipos-tramite.index')}
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
