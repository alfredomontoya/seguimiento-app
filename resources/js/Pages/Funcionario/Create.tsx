import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ComboboxInput } from '@/Components/ComboboxInput';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Departamento {
    id: number;
    nombre: string;
}

export default function Create({ users, departamentos }: PageProps<{ users: User[]; departamentos: Departamento[] }>) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        nombres: '',
        apellidos: '',
        cargo: '',
        profesion: '',
        departamento_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('funcionarios.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Funcionario</h2>
            }
        >
            <Head title="Crear Funcionario" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="user_id" value="Usuario (acceso al sistema)" />
                                <ComboboxInput
                                    options={[{ value: '', label: 'Sin usuario' }, ...users.map((u) => ({ value: u.id.toString(), label: `${u.name} (${u.email})` }))]}
                                    value={data.user_id}
                                    onChange={(val) => setData('user_id', val.toString())}
                                    placeholder="Sin usuario"
                                />
                                <InputError message={errors.user_id} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="nombres" value="Nombres" />
                                <TextInput id="nombres" type="text" className="mt-1 block w-full" value={data.nombres} onChange={(e) => setData('nombres', e.target.value)} required />
                                <InputError message={errors.nombres} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="apellidos" value="Apellidos" />
                                <TextInput id="apellidos" type="text" className="mt-1 block w-full" value={data.apellidos} onChange={(e) => setData('apellidos', e.target.value)} required />
                                <InputError message={errors.apellidos} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="cargo" value="Cargo" />
                                <TextInput id="cargo" type="text" className="mt-1 block w-full" value={data.cargo} onChange={(e) => setData('cargo', e.target.value)} />
                                <InputError message={errors.cargo} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="profesion" value="Profesión" />
                                <TextInput id="profesion" type="text" className="mt-1 block w-full" value={data.profesion} onChange={(e) => setData('profesion', e.target.value)} />
                                <InputError message={errors.profesion} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="departamento_id" value="Departamento" />
                                <ComboboxInput
                                    options={[{ value: '', label: 'Seleccionar departamento' }, ...departamentos.map((d) => ({ value: d.id.toString(), label: d.nombre }))]}
                                    value={data.departamento_id}
                                    onChange={(val) => setData('departamento_id', val.toString())}
                                    placeholder="Seleccionar departamento"
                                />
                                <InputError message={errors.departamento_id} className="mt-1" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Guardar</PrimaryButton>
                                <Link href={route('funcionarios.index')} className="text-sm text-gray-600 hover:text-gray-900">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
