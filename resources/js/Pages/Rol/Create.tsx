import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create(_props: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        slug: '',
        descripcion: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Rol</h2>
            }
        >
            <Head title="Crear Rol" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="nombre" value="Nombre" />
                                <TextInput id="nombre" type="text" className="mt-1 block w-full" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} required />
                                <InputError message={errors.nombre} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="slug" value="Slug" />
                                <TextInput id="slug" type="text" className="mt-1 block w-full" value={data.slug} onChange={(e) => setData('slug', e.target.value)} required />
                                <InputError message={errors.slug} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="descripcion" value="Descripción" />
                                <textarea id="descripcion" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows={3} value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} />
                                <InputError message={errors.descripcion} className="mt-1" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Guardar</PrimaryButton>
                                <Link href={route('roles.index')} className="text-sm text-gray-600 hover:text-gray-900">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
