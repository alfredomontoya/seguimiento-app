import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Link } from '@inertiajs/react';
interface Rol {
    id: number;
    nombre: string;
}
interface UsuarioFormData {
    nombres: string;
    apellidos: string;
    nro_documento: string;
    telefono: string;
    email: string;
    profesion: string;
    name: string;
    password: string;
    rol_id: string;
    activo: boolean;
}
interface UsuarioFormProps {
    data: UsuarioFormData;
    setData: (field: keyof UsuarioFormData, value: string | boolean) => void;
    errors: Record<string, string>;
    processing: boolean;
    roles: Rol[];
    isEditing?: boolean;
    onCancel: string;
}
export default function UsuarioForm({
    data,
    setData,
    errors,
    processing,
    roles,
    isEditing = false,
    onCancel,
}: UsuarioFormProps) {
    return (
        <div className="w-full">
            <div className="bg-white p-6 shadow sm:rounded-lg">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="nombres" value="Nombres" required />
                        <TextInput
                            id="nombres"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.nombres}
                            onChange={(e) => setData('nombres', e.target.value)}
                            required
                        />
                        <InputError message={errors.nombres} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="apellidos" value="Apellidos" required />
                        <TextInput
                            id="apellidos"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.apellidos}
                            onChange={(e) => setData('apellidos', e.target.value)}
                            required
                        />
                        <InputError message={errors.apellidos} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="nro_documento" value="Nro. Documento" />
                        <TextInput
                            id="nro_documento"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.nro_documento}
                            onChange={(e) => setData('nro_documento', e.target.value)}
                        />
                        <InputError message={errors.nro_documento} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="telefono" value="Teléfono" />
                        <TextInput
                            id="telefono"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.telefono}
                            onChange={(e) => setData('telefono', e.target.value)}
                        />
                        <InputError message={errors.telefono} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="email" value="Email" required />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="profesion" value="Profesión" />
                        <TextInput
                            id="profesion"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.profesion}
                            onChange={(e) => setData('profesion', e.target.value)}
                        />
                        <InputError message={errors.profesion} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="name" value="Nombre de usuario" required />
                        <TextInput
                            id="name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="password" value="Contraseña" required={!isEditing} />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required={!isEditing}
                        />
                        {isEditing && (
                            <p className="mt-1 text-xs text-gray-500">Dejar vacío para mantener la actual.</p>
                        )}
                        <InputError message={errors.password} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel value="Rol" required />
                        <div className="mt-1 flex flex-wrap gap-4">
                            {roles.map((r) => (
                                <label key={r.id} className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        name="rol_id"
                                        value={r.id}
                                        checked={data.rol_id === r.id.toString()}
                                        onChange={() => setData('rol_id', r.id.toString())}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">{r.nombre}</span>
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.rol_id} className="mt-1" />
                    </div>
                    <div className="flex items-end pb-3">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                id="activo"
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                checked={data.activo}
                                onChange={(e) => setData('activo', e.target.checked)}
                            />
                            <InputLabel htmlFor="activo" value="Activo" />
                        </label>
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isEditing ? 'Actualizar' : 'Guardar'}
                    </button>
                    <Link href={onCancel} className="text-sm text-gray-600 hover:text-gray-900">
                        Cancelar
                    </Link>
                </div>
            </div>
        </div>
    );
}
