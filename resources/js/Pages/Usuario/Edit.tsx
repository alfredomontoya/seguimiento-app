import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import UsuarioForm from './Form';

interface Rol {
    id: number;
    nombre: string;
}

interface Usuario {
    id: number;
    name: string;
    email: string;
    nombres: string;
    apellidos: string;
    nro_documento: string | null;
    telefono: string | null;
    profesion: string | null;
    activo: boolean;
    rol: { id: number } | null;
}

export default function Edit({ usuario, roles }: PageProps<{ usuario: Usuario; roles: Rol[] }>) {
    const { data, setData, put, processing, errors } = useForm({
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        nro_documento: usuario.nro_documento ?? '',
        telefono: usuario.telefono ?? '',
        email: usuario.email,
        profesion: usuario.profesion ?? '',
        name: usuario.name,
        password: '',
        rol_id: usuario.rol?.id?.toString() ?? '',
        activo: usuario.activo,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('usuarios.update', usuario.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Usuario</h2>}
        >
            <Head title="Editar Usuario" />
            <div className="py-2">
                <form onSubmit={submit}>
                    <UsuarioForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        roles={roles}
                        isEditing
                        onCancel={route('usuarios.index')}
                    />
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
