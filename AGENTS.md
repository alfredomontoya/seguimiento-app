# AGENTS — Sistema de Seguimiento de Trámites y Solicitudes

## Descripción del proyecto

Sistema para digitalizar y automatizar el control de solicitudes y trámites que
gestionan las secretarias de una oficina. Los trámites pasan por diferentes
departamentos de una institución y son asignados a profesionales para su proceso.

Actualmente el control se lleva en un Excel con: número secuencial, fecha de
recepción, referencia, área asignada y profesional asignado. Al finalizar, el
trámite se deriva a un área con estado "terminado" y una glosa para su entrega
al solicitante.

## Stack técnico

### Backend

| Tecnología       | Versión | Uso                              |
|------------------|---------|----------------------------------|
| PHP              | ^8.2    | Lenguaje base                    |
| Laravel          | ^11.x   | Framework principal              |
| MySQL/MariaDB    | 8.x/10.x| Base de datos relacional         |
| Laravel Sanctum  | —       | Autenticación SPA (Inertia)      |
| Laravel Policies | —       | Autorización (roles/permisos)    |
| Laravel Notifications | — | Notificaciones (email/BD)        |
| Laravel Scout    | —       | Búsqueda de expedientes          |
| Laravel Horizon  | —       | Gestión de colas / workers       |
| Laravel Filesystem | —     | Almacenamiento de documentos     |

### Frontend

| Tecnología        | Uso                                         |
|-------------------|---------------------------------------------|
| Inertia.js v2     | Conexión backend–frontend                   |
| React ^19         | UI basada en componentes                    |
| TypeScript ^5.x   | Tipado estático                             |
| Tailwind CSS ^4.x | Estilos utilitarios                         |
| shadcn/ui / Headless UI | Componentes accesibles y reutilizables |
| Zustand           | Estado global ligero                        |
| TanStack Query    | Cache y estado del servidor                 |
| Axios             | HTTP client                                 |

### Herramientas de desarrollo

| Herramienta        | Uso                         |
|--------------------|-----------------------------|
| Composer           | Dependencias PHP            |
| Node.js / npm      | Dependencias JS             |
| Pest + PHPUnit     | Tests backend               |
| Vitest             | Tests frontend              |
| Laravel Pint       | Formateo PHP                |
| ESLint + Prettier  | Calidad código JS/TS        |
| GitHub Actions     | CI/CD                       |

### Infraestructura

| Servicio                | Uso                          |
|-------------------------|------------------------------|
| Redis                   | Cache + colas + sesiones     |
| Mailpit / Mailtrap      | Correo en desarrollo         |
| Local / S3-compatible   | Almacenamiento de documentos |

## Arquitectura

```
app/
├── Services/          # Lógica de negocio
├── Repositories/      # Acceso a datos
├── DTOs/              # Objetos de transferencia
├── Models/            # Eloquent
├── Http/
│   ├── Controllers/   # Capa delgada (orquesta Services)
│   ├── Requests/      # Validación (Form Requests)
│   └── Resources/     # Respuestas JSON
├── Notifications/     # Notificaciones
├── Policies/          # Autorización
└── Jobs/              # Tareas en cola
```

## Modelos de datos

### User
- `id`, `name`, `email`, `password`, `rol_id`, `activo`, `email_verified_at`
- `$fillable`: `name`, `email`, `password`, `rol_id`, `activo`
- `$hidden`: `password`, `remember_token`
- `$casts`: `email_verified_at` → `datetime`, `password` → `hashed`, `activo` → `boolean`
- Relaciones:
  - `belongsTo(Rol::class)`
  - `hasOne(Funcionario::class)`

### Rol
- `id`, `nombre`, `slug`, `descripcion`, `created_at`, `updated_at`
- Slugs predefinidos: `admin`, `secretaria`, `profesional`
- Relaciones:
  - `hasMany(User::class)`
  - `belongsToMany(Permiso::class)->withTimestamps()`

### Permiso
- `id`, `nombre`, `slug`, `descripcion`, `created_at`, `updated_at`
- Ejemplos de slugs: `tramites.crear`, `tramites.asignar`, `tramites.derivar`,
  `tramites.cancelar`, `usuarios.gestionar`, `departamentos.gestionar`,
  `reportes.ver`
- Relaciones:
  - `belongsToMany(Rol::class)->withTimestamps()`

### TipoTramite
- `id`, `nombre`, `slug`, `descripcion`, `creado_por_id`, `actualizado_por_id`,
  `created_at`, `updated_at`
- Ejemplos: `solicitud`, `informe`, `expediente`, `memorandum`
- Relaciones:
  - `belongsTo(User::class, 'creado_por_id')`
  - `belongsTo(User::class, 'actualizado_por_id')`
  - `hasMany(Tramite::class)`

### Persona
- Datos del solicitante (externo, no tiene acceso al sistema)
- `id`, `nro_documento`, `nombres`, `apellidos`, `telefono`, `email`,
  `direccion`, `creado_por_id`, `actualizado_por_id`, `created_at`, `updated_at`
- Relaciones:
  - `belongsTo(User::class, 'creado_por_id')`
  - `belongsTo(User::class, 'actualizado_por_id')`
  - `hasMany(Tramite::class)`

### Funcionario
- Datos laborales del empleado (profesional, jefe, secretaria). Si tiene
  acceso al sistema, se vincula con `User` mediante `user_id` nullable.
- `id`, `user_id` (nullable), `nombres`, `apellidos`, `cargo`, `profesion`,
  `departamento_id`, `creado_por_id`, `actualizado_por_id`, `created_at`,
  `updated_at`
- Relaciones:
  - `belongsTo(User::class, 'user_id')`
  - `belongsTo(Departamento::class)`
  - `belongsTo(User::class, 'creado_por_id')`
  - `belongsTo(User::class, 'actualizado_por_id')`
  - `hasMany(Derivacion::class, 'funcionario_id')`

### Departamento
- `id`, `nombre`, `sigla`, `descripcion`, `departamento_padre_id` (nullable),
  `activo`, `creado_por_id`, `actualizado_por_id`, `created_at`, `updated_at`
- Relaciones:
  - `belongsTo(Departamento::class, 'departamento_padre_id')`
  - `hasMany(Departamento::class, 'departamento_padre_id')`
  - `belongsTo(User::class, 'creado_por_id')`
  - `belongsTo(User::class, 'actualizado_por_id')`
  - `hasMany(Tramite::class)`
  - `hasMany(Funcionario::class)`
  - `hasMany(Derivacion::class, 'departamento_origen_id')`
  - `hasMany(Derivacion::class, 'departamento_destino_id')`

### Tramite
- `id`, `nro_secuencial` (formato `AAAA-NNNN`), `fecha_recepcion`, `referencia`,
  `tipo_tramite_id`, `persona_id`, `departamento_id`, `estado`,
  `fecha_termino`, `glosa_entrega`, `creado_por_id`, `actualizado_por_id`,
  `deleted_at`, `created_at`, `updated_at`
- Estados: `recibido`, `en_proceso`, `derivado`, `terminado`, `entregado`,
  `cancelado`
- Relaciones:
  - `belongsTo(TipoTramite::class)`
  - `belongsTo(Persona::class)`
  - `belongsTo(Departamento::class)`
  - `belongsTo(User::class, 'creado_por_id')`
  - `belongsTo(User::class, 'actualizado_por_id')`
  - `hasMany(Derivacion::class)`

### Derivacion
- `id`, `tramite_id`, `departamento_origen_id`, `departamento_destino_id`,
  `funcionario_id`, `fecha_asignacion`, `comentarios_internos`, `glosa`,
  `creado_por_id`, `created_at`, `updated_at`
- Relaciones:
  - `belongsTo(Tramite::class)`
  - `belongsTo(Departamento::class, 'departamento_origen_id')`
  - `belongsTo(Departamento::class, 'departamento_destino_id')`
  - `belongsTo(Funcionario::class, 'funcionario_id')`
  - `belongsTo(User::class, 'creado_por_id')`

## Roles y permisos

### Roles del sistema

| Rol           | Descripción                                                |
|---------------|------------------------------------------------------------|
| `admin`       | Acceso total. Gestiona usuarios, roles, permisos, depas.   |
| `secretaria`  | Crea y asigna trámites, reasigna profesionales.             |
| `profesional` | Ve y procesa sus trámites asignados, puede derivar.         |

### Asignación de roles

- La columna `rol_id` en `users` define el rol del usuario.
- Solo los usuarios con rol `admin` pueden gestionar usuarios, roles y
  permisos.

### Permisos por rol

| Permiso                    | admin | secretaria | profesional |
|----------------------------|:-----:|:----------:|:-----------:|
| `usuarios.gestionar`       |   ✓   |            |             |
| `roles.gestionar`          |   ✓   |            |             |
| `permisos.gestionar`       |   ✓   |            |             |
| `departamentos.gestionar`  |   ✓   |            |             |
| `tramites.crear`           |   ✓   |     ✓      |             |
| `tramites.asignar`         |   ✓   |     ✓      |             |
| `tramites.reasignar`       |   ✓   |     ✓      |             |
| `tramites.derivar`         |   ✓   |            |     ✓      |
| `tramites.ver_todos`       |   ✓   |     ✓      |             |
| `tramites.cancelar`        |   ✓   |            |             |
| `tramites.entregar`        |   ✓   |     ✓      |             |
| `reportes.ver`             |   ✓   |     ✓      |     ✓      |

### Implementación

- **Policies de Laravel** para autorización por modelo:
  - `TramitePolicy` — secretaria puede crear/asignar, profesional solo ver
    sus asignados
  - `DepartamentoPolicy` — solo admin gestiona departamentos
  - `UserPolicy` — solo admin gestiona usuarios
- **Middleware** opcional por rol para rutas específicas.
- En el frontend, usar `can` de Inertia o el objeto `auth.user.rol` para UI
  condicional.
- Los permisos se verifican vía `$user->rol->permisos` o mediante Gates
  registrados en `AppServiceProvider`.

## Gestión de usuarios

### Creación de usuarios

- Solo los usuarios con rol `admin` pueden acceder a la gestión de usuarios.
- El formulario de creación incluye: nombre, email, contraseña, rol y estado
  activo/inactivo.
- Al crear un usuario, se envía un email con sus credenciales de acceso
  (opcional).

### Administración de roles y permisos

- El admin puede crear, editar y eliminar roles.
- El admin puede asignar/desasignar permisos a cada rol.
- La tabla pivote `permiso_rol` almacena la relación muchos a muchos.

### Rutas de administración de usuarios

```
GET      /usuarios                       → UsuarioController@index
GET      /usuarios/crear                 → UsuarioController@create
POST     /usuarios                       → UsuarioController@store
GET      /usuarios/{usuario}             → UsuarioController@show
GET      /usuarios/{usuario}/editar      → UsuarioController@edit
PUT      /usuarios/{usuario}             → UsuarioController@update
DELETE   /usuarios/{usuario}             → UsuarioController@destroy

GET      /roles                          → RolController@index
GET      /roles/crear                    → RolController@create
POST     /roles                          → RolController@store
GET      /roles/{rol}/editar             → RolController@edit
PUT      /roles/{rol}                    → RolController@update
DELETE   /roles/{rol}                    → RolController@destroy
POST     /roles/{rol}/permisos           → RolController@syncPermisos

GET      /permisos                       → PermisoController@index
GET      /permisos/crear                 → PermisoController@create
POST     /permisos                       → PermisoController@store
GET      /permisos/{permiso}/editar      → PermisoController@edit
PUT      /permisos/{permiso}             → PermisoController@update
```

## Reglas de negocio

1. **Nro secuencial por año fiscal** — Formato `AAAA-NNNN` (ej: `2026-0001`).
   Se reinicia cada año. Generado automáticamente al crear el trámite.

2. **Máquina de estados** — Transiciones válidas restringidas:
   - `recibido → en_proceso`
   - `en_proceso → derivado`
   - `derivado → en_proceso` (cuando lo recibe el nuevo profesional)
   - `en_proceso → terminado`
   - `terminado → entregado`
   - Cualquier estado → `cancelado` (solo admin)

3. **Trazabilidad completa** — Cada derivación es inmutable: no se edita ni
   elimina. Todo movimiento queda registrado con fecha, usuario y cambios de
   estado.

4. **Recepción** — La secretaria registra el trámite con nro secuencial,
   fecha de recepción, referencia y datos del solicitante.

5. **Asignación inicial** — La secretaria asigna el trámite a un departamento
   y a un profesional específico dentro de ese departamento.

6. **Asignación exclusiva** — Solo secretarias y admin pueden crear y asignar
   trámites. Los profesionales solo ven sus trámites asignados.

7. **Reasignación** — Solo secretarias y admin pueden reasignar un trámite
   de un profesional a otro.

8. **Derivación entre departamentos** — Si el profesional lo requiere, deriva
   el trámite a otro departamento con comentarios. Se registra origen, destino,
   profesional y glosa.

9. **Cierre** — Cuando el trámite está completado, se marca como `terminado`
   con una glosa final. Se deriva al área de entrega.

10. **Entrega** — El trámite se entrega al solicitante y se marca como
    `entregado`.

11. **Cancelación** — Solo admin puede cancelar trámites desde cualquier
    estado.

12. **Notificaciones** — Al asignar o derivar un trámite, el profesional
    recibe notificación (email/BD).

13. **Comentarios internos** — Cada derivación puede contener observaciones
    internas no visibles al solicitante.

14. **Soft deletes** — Los trámites usan soft deletes. No se eliminan
    físicamente, solo se cancelan.

15. **Búsqueda y filtros** — Por nro secuencial, referencia, solicitante,
    fechas, estado y departamento.

16. **Dashboard con KPIs** — Panel principal con:
    - **Tarjetas de resumen:** total trámites del mes, pendientes
      (recibido + en_proceso), completados (terminado + entregado),
      tiempo promedio de resolución en días.
    - **Gráficos:**
      - Trámites ingresados por día (línea/barras, últimos 30 días)
      - Trámites ingresados por semana (barras, últimas 12 semanas)
      - Distribución por estado (pastel/dona)
    - **Tablas auxiliares:**
      - Últimos 10 trámites ingresados
      - Top 5 trámites con más días en proceso (urgentes)
      - Carga por departamento (cantidad de trámites por área)
    - **Filtros:** por rango de fechas, departamento y profesional.

17. **Reportes exportables** — Listados de trámites y derivaciones exportables
    a Excel/PDF.

18. **Auditoría** — Todo cambio de estado, asignación y derivación se audita
    con usuario y timestamp.

## Convenciones de código

### PHP / Laravel

- **Tipado estricto:** `declare(strict_types=1)` en todos los archivos PHP
- **Controllers:** Delgados, solo orquestan Services. Usan Inertia para
  renderizar vistas React.
- **Services:** Contienen toda la lógica de negocio.
- **Repositories:** Encapsulan consultas Eloquent complejas.
- **Form Requests:** Validación y autorización por request.
  Ej: `StoreTramiteRequest`, `DerivarTramiteRequest`, `AsignarTramiteRequest`,
  `StoreUsuarioRequest`, `StoreRolRequest`
- **DTOs:** Para datos de entrada/salida entre capas.
- **Policies:** Autorización por modelo. Usar `Gate` y `@can` en frontend.
- **Relaciones:** Definir explícitamente con type hints en los modelos.
- **Naming archivos:** PascalCase (`TramiteService.php`)
- **Naming métodos/variables:** camelCase (`getTramitesPendientes()`)
- **Naming BD:** snake_case (`nro_secuencial`, `fecha_recepcion`)
- **Naming rutas:** kebab-case (`/tramites/pendientes`,
  `/tramites/{tramite}/derivar`)
- **Naming tablas:** snake_case plural (`tramites`, `derivaciones`,
  `permiso_rol`)
- **Atributos PHP 8:** Usar `#[Fillable]`, `#[Hidden]` en lugar de propiedades

### React / TypeScript

- **Componentes:** Funcionales con hooks
- **Props:** Tipadas con TypeScript interfaces
- **Estado global:** Zustand para estado compartido
- **Server state:** TanStack Query para cache y sincronización
- **HTTP:** Axios con instancia configurada
- **UI:** shadcn/ui con Headless UI para componentes accesibles
- **Estilos:** Tailwind CSS v4
- **Naming componentes:** PascalCase (`TramiteList.tsx`)
- **Naming archivos:** PascalCase para componentes, camelCase para hooks/utils
- **Páginas Inertia:** Una por ruta en `resources/js/Pages/`

### UI / Diseño de interfaz

- **Componente base:** shadcn/ui sobre Headless UI (Radix UI).
- **Paleta de colores institucional** (Tailwind CSS v4):
  - **Primarios (verdes):** `green-800` (`#166534`) para botones y header,
    `green-600` (`#16a34a`) para hover/links, `green-100` (`#dcfce7`)
    para fondos de secciones.
  - **Secundarios:** `slate-600` (`#475569`) para texto secundario,
    `slate-100` (`#f1f5f9`) para bordes y fondos de tabla.
  - **Acentos:** `red-600` (`#dc2626`) para errores/cancelado,
    `amber-600` (`#d97706`) para advertencias/derivado,
    `blue-600` (`#2563eb`) para en_proceso,
    `emerald-600` (`#059669`) para entregado/completado.
  - **Neutrales:** `slate-50` (`#f8fafc`) fondo principal,
    `slate-900` (`#0f172a`) texto principal.
- **Campos de selección de relaciones (FK):** Usar siempre el componente
  `Combobox` de shadcn/ui (basado en `Command` + `Popover`) con búsqueda
  por texto (autocomplete). Aplica a:
  - `tipo_tramite_id` — seleccionar tipo de trámite
  - `persona_id` — buscar/crear solicitante
  - `departamento_id` — seleccionar departamento/área
  - `funcionario_id` — buscar profesional asignado
  - `rol_id` — seleccionar rol de usuario
  - `departamento_padre_id` — seleccionar departamento padre
  - Cualquier otra FK en el sistema
- **Formularios:** Diseño vertical con labels arriba del campo. Agrupación
  visual por secciones (datos del trámite, datos del solicitante, etc.).
- **Tablas:** Usar `Table` de shadcn/ui con soporte de ordenamiento y
  paginado. Acciones por fila (editar, eliminar, derivar) en menú de tres
  puntos.
- **Estados/etiquetas:** `Badge` de shadcn/ui con colores semánticos:
  - `recibido` → gray
  - `en_proceso` → blue
  - `derivado` → yellow
  - `terminado` → green
  - `entregado` → emerald
  - `cancelado` → red
- **Diálogos:** Usar `Dialog` de shadcn/ui para confirmaciones,
  derivaciones y asignaciones rápidas.
- **Navegación:** Sidebar lateral con iconos (Layout tipo dashboard).
  Breadcrumbs para mostrar ruta de navegación actual.
- **Responsive:** Adaptable a tablet y desktop (mobile primero no es
  prioritario, es uso interno de oficina). Sidebar colapsable en tablet.
- **Formularios:** React Hook Form + Zod para validación tipada del lado
  del cliente, consistente en todo el sistema.
- **Tablas avanzadas:** shadcn DataTable (basada en TanStack Table) con
  ordenamiento de columnas, filtros y paginación server-side.
- **Feedback al usuario:**
  - `Toast` de shadcn/ui para notificaciones de acción (guardado, error)
  - `Skeleton` para estados de carga de contenido
  - Componente `EmptyState` con mensaje e icono cuando no hay datos
- **Diálogos de confirmación:** `AlertDialog` de shadcn/ui para acciones
  destructivas (cancelar trámite, eliminar).
- **Estado global:** Zustand para UI state (sidebar abierto/cerrado, tema,
  filtros globales). TanStack Query para server state (datos del backend).

## Patrón de vista Index (listado)

Todas las vistas `Index` (listados) siguen esta estructura unificada:

```
<AuthenticatedLayout header={<h2>Título</h2>}>
    <Head title="Título" />

    <div className="py-2">
        <div className="w-full">
            {# Barra de acciones: búsqueda + botón nuevo #}
            <div className="mb-6 flex items-center justify-between">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    onSearch={handleSearch}
                    onClear={handleClear}
                    placeholder="Buscar por campos relevantes..."
                />
                <Link href={route('entidad.create')}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo
                </Link>
            </div>

            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="overflow-x-auto p-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-b from-green-800 to-green-600">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Columna</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={N} className="px-6 py-12 text-center text-sm text-gray-500">
                                        Mensaje vacío / "No se encontraron resultados"
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="group transition-all hover:bg-green-50 hover:shadow-[0_0_0_1px_#16a34a]">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 group-hover:rounded-l-lg group-hover:shadow-[0_0_0_1px_#16a34a]">...</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 group-hover:shadow-[0_0_0_1px_#16a34a]">...</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 group-hover:rounded-r-lg group-hover:shadow-[0_0_0_1px_#16a34a]">
                                            <div className="flex items-center gap-2">
                                                <Link href={route('entidad.edit', item.id)}
                                                    className="text-indigo-600 hover:text-indigo-900">Editar</Link>
                                                <span className="text-gray-300">|</span>
                                                <button onClick={() => ...}
                                                    className="text-indigo-600 hover:text-indigo-900">Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {!search && last_page > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Mostrando {from} a {to} de {total} registros
                            </div>
                            <div className="flex gap-1">
                                {links.map((link, i) => {
                                    const isPrev = link.label.toLowerCase().includes('previous');
                                    const isNext = link.label.toLowerCase().includes('next');
                                    return (
                                        <button key={i} disabled={!link.url}
                                            onClick={() => { if (link.url) router.get(link.url); }}
                                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                                                link.active
                                                    ? 'bg-gray-800 text-white'
                                                    : link.url ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                    : 'cursor-not-allowed text-gray-400'
                                            }`}>
                                            {isPrev ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            ) : isNext ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
</AuthenticatedLayout>
```

### Reglas del patrón

1. **Header:** Solo el título `<h2>`. Sin botones ni búsqueda.
2. **Padding:** `py-2` en el contenedor principal.
3. **Barra de acciones:** `mb-6 flex items-center justify-between` con input de búsqueda a la izquierda y botón "+ Nuevo" `bg-gray-800` a la derecha.
5. **Input de búsqueda:** Usar el componente reutilizable `<SearchInput>` de `@/Components/SearchInput`. Props: `value`, `onChange`, `onSearch`, `onClear`, `placeholder`. Estilo Google: `rounded-full`, `py-2 pl-10 pr-20`, lupa SVG dentro del input con posición absoluta a la izquierda. Borde `gray-300`, focus `indigo-500`, placeholder descriptivo.
6. **Botón "+ Nuevo":** `rounded-full`, `bg-gray-800`, icono SVG de `+`, texto "Nuevo". Mismo estilo que el botón de búsqueda.
7. **Tabla:** `min-w-full divide-y divide-gray-200`. Headers en `uppercase tracking-wider text-gray-500`. Celdas `px-6 py-4 text-sm text-gray-500`, primera celda `font-medium text-gray-900`. `<tbody>` sin `divide-y`.
8. **Hover de fila:** `<tr className="group transition-all hover:bg-green-50">`. Primera `<td>` con `group-hover:rounded-l-lg group-hover:shadow-[1px_0_0_0_#16a34a,0_-1px_0_0_#16a34a,0_1px_0_0_#16a34a]` (izquierda + arriba + abajo), última `<td>` con similarly `rounded-r-lg` y sombra solo derecha + arriba + abajo, `<td>` intermedias con `group-hover:shadow-[0_-1px_0_0_#16a34a,0_1px_0_0_#16a34a]` (solo arriba/abajo). Sin sombras entre celdas adyacentes.
9. **Acciones:** Enlaces `text-indigo-600` con separador `|` gris (`text-gray-300`).
10. **Estado vacío:** `px-6 py-12 text-center text-sm text-gray-500` con mensaje distinto según haya búsqueda activa o no.
11. **Paginación:** Botones circulares (no `<Link>`) con `router.get(url)`. `rounded-full h-8 w-8 inline-flex items-center justify-center`. Previous/Next renderizan solo iconos SVG de chevron (detectados por `link.label.includes('previous'/'next')`). Activo `bg-gray-800 text-white`, inactivo `bg-white text-gray-700 hover:bg-gray-100`, deshabilitado `cursor-not-allowed text-gray-400`.
12. **Búsqueda client-side:** Usa dos estados: `search` (input) y `searchQuery` (filtro). `searchQuery` se actualiza solo al presionar Enter o el botón de lupa. Filtra con `useMemo` y oculta paginación mientras hay búsqueda activa.
13. **Highlight:** Función `highlightText()` que envuelve coincidencias con `<mark className="rounded bg-yellow-200 px-0.5">`. Usa `searchQuery` como criterio, no `search`.
14. **Interfaz PaginatedData:** Debe incluir `current_page`, `last_page`, `per_page`, `total`, `from`, `to` y `links`.

## Rutas planeadas

```
web.php (Inertia) — Autenticadas:

GET      /dashboard                          → DashboardController@index

# Trámites
GET      /tramites                           → TramiteController@index
GET      /tramites/crear                     → TramiteController@create
POST     /tramites                           → TramiteController@store
GET      /tramites/{tramite}                 → TramiteController@show
GET      /tramites/{tramite}/editar          → TramiteController@edit
PUT      /tramites/{tramite}                 → TramiteController@update
POST     /tramites/{tramite}/derivar         → TramiteController@derivar
POST     /tramites/{tramite}/reasignar       → TramiteController@reasignar
POST     /tramites/{tramite}/cancelar        → TramiteController@cancelar
POST     /tramites/{tramite}/entregar        → TramiteController@entregar
GET      /tramites/pendientes                → TramiteController@pendientes
GET      /tramites/terminados                → TramiteController@terminados

# Tipos de trámite
GET      /tipos-tramite                      → TipoTramiteController@index
GET      /tipos-tramite/crear                → TipoTramiteController@create
POST     /tipos-tramite                      → TipoTramiteController@store
GET      /tipos-tramite/{tipo_tramite}       → TipoTramiteController@show
GET      /tipos-tramite/{tipo_tramite}/editar→ TipoTramiteController@edit
PUT      /tipos-tramite/{tipo_tramite}       → TipoTramiteController@update

# Personas (solicitantes)
GET      /personas                           → PersonaController@index
GET      /personas/crear                     → PersonaController@create
POST     /personas                           → PersonaController@store
GET      /personas/{persona}                 → PersonaController@show
GET      /personas/{persona}/editar          → PersonaController@edit
PUT      /personas/{persona}                 → PersonaController@update

# Departamentos
GET      /departamentos                      → DepartamentoController@index
GET      /departamentos/crear                → DepartamentoController@create
POST     /departamentos                      → DepartamentoController@store
GET      /departamentos/{departamento}       → DepartamentoController@show
GET      /departamentos/{departamento}/editar→ DepartamentoController@edit
PUT      /departamentos/{departamento}       → DepartamentoController@update

# Funcionarios (profesionales, jefes)
GET      /funcionarios                       → FuncionarioController@index
GET      /funcionarios/crear                 → FuncionarioController@create
POST     /funcionarios                       → FuncionarioController@store
GET      /funcionarios/{funcionario}         → FuncionarioController@show
GET      /funcionarios/{funcionario}/editar  → FuncionarioController@edit
PUT      /funcionarios/{funcionario}         → FuncionarioController@update

# Usuarios (solo admin)
GET      /usuarios                           → UsuarioController@index
GET      /usuarios/crear                     → UsuarioController@create
POST     /usuarios                           → UsuarioController@store
GET      /usuarios/{usuario}                 → UsuarioController@show
GET      /usuarios/{usuario}/editar          → UsuarioController@edit
PUT      /usuarios/{usuario}                 → UsuarioController@update
DELETE   /usuarios/{usuario}                 → UsuarioController@destroy

# Roles (solo admin)
GET      /roles                              → RolController@index
GET      /roles/crear                        → RolController@create
POST     /roles                              → RolController@store
GET      /roles/{rol}/editar                 → RolController@edit
PUT      /roles/{rol}                        → RolController@update
DELETE   /roles/{rol}                        → RolController@destroy
POST     /roles/{rol}/permisos               → RolController@syncPermisos

# Permisos (solo admin)
GET      /permisos                           → PermisoController@index
GET      /permisos/crear                     → PermisoController@create
POST     /permisos                           → PermisoController@store
GET      /permisos/{permiso}/editar          → PermisoController@edit
PUT      /permisos/{permiso}                 → PermisoController@update

# Reportes
GET      /reportes/tramites                  → ReporteController@tramites
GET      /reportes/derivaciones              → ReporteController@derivaciones

# Notificaciones
GET      /notificaciones                     → NotificacionController@index
POST     /notificaciones/{id}/leer           → NotificacionController@marcarLeida
```

## Estilo de commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar creación de trámites
feat: implementar gestión de usuarios y roles
fix: corregir cálculo de nro secuencial anual
refactor: extraer lógica de derivación a TramiteService
test: agregar tests para máquina de estados
docs: actualizar AGENTS.md con nuevas rutas
```

## Tests

### Backend (Pest)
- **Unit:** Services, Repositories, DTOs, máquina de estados
- **Feature:** Controladores, rutas, autorización (Policies)
- **Factories:** Para todos los modelos
- Cobertura mínima esperada: 80%

### Frontend (Vitest)
- **Unit:** Componentes individuales, hooks, utils
- **Integration:** Páginas completas con renderizado
