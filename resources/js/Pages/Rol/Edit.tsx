import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

interface Permiso {
    id: number;
    nombre: string;
    slug: string;
}

interface Rol {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
}

export default function Edit({ rol, permisos, permisoIds }: PageProps<{ rol: Rol; permisos: Permiso[]; permisoIds: number[] }>) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: rol.nombre,
        slug: rol.slug,
        descripcion: rol.descripcion ?? '',
    });

    const { data: permisoData, setData: setPermisoData, post: syncPermisos, processing: syncing } = useForm({
        permiso_ids: permisoIds,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('roles.update', rol.id));
    };

    const togglePermiso = (permisoId: number) => {
        const current = permisoData.permiso_ids;
        if (current.includes(permisoId)) {
            setPermisoData('permiso_ids', current.filter((id: number) => id !== permisoId));
        } else {
            setPermisoData('permiso_ids', [...current, permisoId]);
        }
    };

    const handleSyncPermisos = (e: React.FormEvent) => {
        e.preventDefault();
        syncPermisos(route('roles.permisos', rol.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Rol</h2>
            }
        >
            <Head title="Editar Rol" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl space-y-6 sm:px-6 lg:px-8">
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
                                <PrimaryButton disabled={processing}>Actualizar</PrimaryButton>
                                <Link href={route('roles.index')} className="text-sm text-gray-600 hover:text-gray-900">Cancelar</Link>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Permisos del Rol</h3>
                        <form onSubmit={handleSyncPermisos} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {permisos.map((p) => (
                                    <label key={p.id} className="flex items-center gap-2 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" checked={permisoData.permiso_ids.includes(p.id)} onChange={() => togglePermiso(p.id)} />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{p.nombre}</div>
                                            <div className="text-xs text-gray-500">{p.slug}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <PrimaryButton disabled={syncing}>Sincronizar Permisos</PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
