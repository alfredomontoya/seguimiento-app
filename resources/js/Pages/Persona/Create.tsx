import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
export default function Create(_props: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        nro_documento: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        email: '',
        direccion: '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('personas.store'));
    };
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Persona</h2>}
        >
            {' '}
            <Head title="Crear Persona" />{' '}
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
                                <InputLabel htmlFor="nro_documento" value="Nro. Documento" />{' '}
                                <TextInput
                                    id="nro_documento"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.nro_documento}
                                    onChange={(e) => setData('nro_documento', e.target.value)}
                                    required
                                />{' '}
                                <InputError message={errors.nro_documento} className="mt-1" />{' '}
                            </div>{' '}
                            <div>
                                {' '}
                                <InputLabel htmlFor="nombres" value="Nombres" />{' '}
                                <TextInput
                                    id="nombres"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.nombres}
                                    onChange={(e) => setData('nombres', e.target.value)}
                                    required
                                />{' '}
                                <InputError message={errors.nombres} className="mt-1" />{' '}
                            </div>{' '}
                            <div>
                                {' '}
                                <InputLabel htmlFor="apellidos" value="Apellidos" />{' '}
                                <TextInput
                                    id="apellidos"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.apellidos}
                                    onChange={(e) => setData('apellidos', e.target.value)}
                                    required
                                />{' '}
                                <InputError message={errors.apellidos} className="mt-1" />{' '}
                            </div>{' '}
                            <div>
                                {' '}
                                <InputLabel htmlFor="telefono" value="Teléfono" />{' '}
                                <TextInput
                                    id="telefono"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                />{' '}
                                <InputError message={errors.telefono} className="mt-1" />{' '}
                            </div>{' '}
                            <div>
                                {' '}
                                <InputLabel htmlFor="email" value="Email" />{' '}
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />{' '}
                                <InputError message={errors.email} className="mt-1" />{' '}
                            </div>{' '}
                            <div>
                                {' '}
                                <InputLabel htmlFor="direccion" value="Dirección" />{' '}
                                <textarea
                                    id="direccion"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={3}
                                    value={data.direccion}
                                    onChange={(e) => setData('direccion', e.target.value)}
                                />{' '}
                                <InputError message={errors.direccion} className="mt-1" />{' '}
                            </div>{' '}
                            <div className="flex items-center gap-4">
                                {' '}
                                <PrimaryButton disabled={processing}>Guardar</PrimaryButton>{' '}
                                <Link
                                    href={route('personas.index')}
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
