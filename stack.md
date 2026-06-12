# Stack Tecnológico — Sistema de Seguimiento de Documentos

## Backend

| Tecnología     | Versión | Uso                              |
|----------------|---------|----------------------------------|
| PHP            | ^8.2    | Lenguaje base                    |
| Laravel        | ^11.x   | Framework principal              |
| MySQL/MariaDB  | 8.x/10.x| Base de datos relacional         |
| Laravel Sanctum| —       | Autenticación SPA (Inertia)      |
| Laravel Policies| —      | Autorización (roles/permisos)    |
| Laravel Notifications | — | Notificaciones (email/DB)     |
| Laravel Scout  | —       | Búsqueda de expedientes          |
| Laravel Horizon| —       | Gestión de colas / workers       |
| Laravel Filesystem | —    | Almacenamiento de documentos     |

## Frontend

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

## Herramientas de desarrollo

| Herramienta        | Uso                         |
|--------------------|-----------------------------|
| Composer           | Dependencias PHP            |
| Node.js / npm      | Dependencias JS             |
| Pest + PHPUnit     | Tests backend               |
| Vitest             | Tests frontend              |
| Laravel Pint       | Formateo PHP                |
| ESLint + Prettier  | Calidad código JS/TS        |
| GitHub Actions     | CI/CD                       |

## Autenticación

| Mecanismo                          | Uso                                           |
|------------------------------------|-----------------------------------------------|
| Sanctum (SPA) + cookies de sesión  | Autenticación web desde Inertia               |
| Sanctum (API tokens)               | Autenticación para consumidores externos (API) |
| CSRF Protection                    | Protección nativa contra CSRF                 |
| Middleware `auth:sanctum`          | Protección de rutas protegidas                |
| Rate limiting (`throttle:api`)     | Límite de peticiones en rutas de autenticación|

El flujo de autenticación usa **Sanctum SPA**: el frontend (Inertia) se comunica con Laravel mediante cookies de sesión. No se usan tokens JWT. Para clientes externos se emplean tokens de acceso personal (API tokens).

## Infraestructura

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
