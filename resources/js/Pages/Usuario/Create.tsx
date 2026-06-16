import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import UsuarioForm from './Form';

interface Rol {
    id: number;
    nombre: string;
}

export default function Create({ roles }: PageProps<{ roles: Rol[] }>) {
    const { data, setData, post, processing, errors } = useForm({
        nombres: '',
        apellidos: '',
        nro_documento: '',
        telefono: '',
        email: '',
        profesion: '',
        name: '',
        password: '',
        rol_id: '',
        activo: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('usuarios.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Usuario</h2>}
        >
            <Head title="Crear Usuario" />
            <div className="py-2">
                <form onSubmit={submit}>
                    <UsuarioForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        roles={roles}
                        onCancel={route('usuarios.index')}
                    />
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
