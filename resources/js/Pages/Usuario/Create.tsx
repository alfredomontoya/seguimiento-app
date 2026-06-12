import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ComboboxInput } from '@/Components/ComboboxInput';

interface Rol {
    id: number;
    nombre: string;
}

export default function Create({ roles }: PageProps<{ roles: Rol[] }>) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol_id: '',
        activo: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('usuarios.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Usuario</h2>
            }
        >
            <Head title="Crear Usuario" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nombre" />
                                <TextInput id="name" type="text" className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Contraseña" />
                                <TextInput id="password" type="password" className="mt-1 block w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                                <TextInput id="password_confirmation" type="password" className="mt-1 block w-full" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="rol_id" value="Rol" />
                                <ComboboxInput
                                    options={[{ value: '', label: 'Seleccionar rol' }, ...roles.map((r) => ({ value: r.id.toString(), label: r.nombre }))]}
                                    value={data.rol_id}
                                    onChange={(val) => setData('rol_id', val.toString())}
                                    placeholder="Seleccionar rol"
                                />
                                <InputError message={errors.rol_id} className="mt-1" />
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="activo" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} />
                                <InputLabel htmlFor="activo" value="Activo" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Guardar</PrimaryButton>
                                <Link href={route('usuarios.index')} className="text-sm text-gray-600 hover:text-gray-900">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
