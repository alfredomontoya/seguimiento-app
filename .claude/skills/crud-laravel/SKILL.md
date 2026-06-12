---
name: crud-laravel
description: Generate a complete CRUD for Laravel + Inertia + React following project conventions. Use when asked to create CRUD, module, or scaffold for a new entity.
---

# CRUD Laravel — Sistema de Seguimiento

## Architecture

When generating a CRUD, follow this structure:

### Backend (`app/`)

```
app/
├── Models/{Entity}.php
├── Http/
│   ├── Controllers/{Entity}Controller.php
│   ├── Requests/Store{Entity}Request.php
│   ├── Requests/Update{Entity}Request.php
│   └── Resources/{Entity}Resource.php
├── Services/{Entity}Service.php
├── Repositories/{Entity}Repository.php
├── DTOs/{Entity}Data.php
└── Policies/{Entity}Policy.php
```

### Frontend (`resources/js/`)

```
resources/js/
├── Pages/{Entity}/
│   ├── Index.tsx
│   ├── Create.tsx
│   ├── Edit.tsx
│   └── Show.tsx
├── Components/{entity}/
│   ├── {Entity}Form.tsx
│   ├── {Entity}Table.tsx
│   └── {Entity}Filters.tsx
└── types/{entity}.ts
```

### Routes (`routes/web.php`)

```php
Route::resource('{entities}', {Entity}Controller::class)->except(['destroy']);
```

---

## Step 1: Create Model + Migration

Use `php artisan make:model {Entity} -m` then manually add:
- `declare(strict_types=1)`
- `$fillable`, `$casts`, `$hidden`, `$with`
- Relaciones tipadas con docblocks
- SoftDeletes trait si aplica

## Step 2: Create DTO

File: `app/DTOs/{Entity}Data.php`

```php
<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Store{Entity}Request;
use App\Http\Requests\Update{Entity}Request;

readonly class {Entity}Data
{
    public function __construct(
        public string $nombre,
        // ... campos
    ) {}

    public static function fromStoreRequest(Store{Entity}Request $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
        );
    }

    public static function fromUpdateRequest(Update{Entity}Request $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
        );
    }
}
```

## Step 3: Create Form Requests

Two files:
- `Store{Entity}Request` — rules for creation
- `Update{Entity}Request` — rules for update

Use `authorize()` with policy gates. For FK fields, use `exists:table,id`.

## Step 4: Create Policy

File: `app/Policies/{Entity}Policy.php`

Register in `AppServiceProvider`:

```php
Gate::policy({Entity}::class, {Entity}Policy::class);
```

## Step 5: Create Repository

File: `app/Repositories/{Entity}Repository.php`

Include methods:
- `getAll(array $filters)`
- `findById(int $id)`
- `create(array $data)`
- `update({Entity} $entity, array $data)`
- `delete({Entity} $entity)`

## Step 6: Create Service

File: `app/Services/{Entity}Service.php`

Orchestrates business logic using the Repository.

## Step 7: Create Controller

File: `app/Http/Controllers/{Entity}Controller.php`

Methods: `index`, `create`, `store`, `show`, `edit`, `update`

```php
public function index(): Response
{
    $entities = $this->service->getPaginated(filters: request()->all());
    return inertia('{Entity}/Index', compact('entities'));
}
```

## Step 8: Create Resource (optional)

File: `app/Http/Resources/{Entity}Resource.php`

## Step 9: Frontend Pages

### Types (`resources/js/types/{entity}.ts`)

```ts
export interface {Entity} {
    id: number;
    nombre: string;
    created_at: string;
    updated_at: string;
}

export interface {Entity}FormData {
    nombre: string;
}
```

### Index.tsx

- Use shadcn DataTable (TanStack Table) with server-side pagination
- Columns: nombre, fechas, acciones (dropdown de 3 puntos con Edit/Delete)
- Filtros: por nombre, fechas (componente {Entity}Filters)
- Botón "Nuevo" que navega a `/entities/create`

### Create.tsx + Edit.tsx

- Use `{Entity}Form` component
- React Hook Form + Zod validation
- On submit: axios POST/PUT, redirect to index with success toast

### Show.tsx

- Detail view with description list
- Botones de acción (Editar, Volver)

## Step 10: Form Component (`{Entity}Form.tsx`)

- Campos de texto con `TextInput` de shadcn/ui
- **FK fields MUST use `Combobox`** (shadcn Command + Popover) with search
- Submit button with loading state
- Error messages con `InputError`

## Step 11: Table Component (`{Entity}Table.tsx`)

- shadcn Table or DataTable
- Sorting, pagination
- Empty state when no data

## Naming conventions

| Concept | Convention | Example |
|---------|-----------|---------|
| Entity (PascalCase) | Singular | `TipoTramite` |
| Table (snake_case) | Plural | `tipos_tramite` |
| Route param (kebab-case) | Singular | `tipos-tramite` |
| Route path (kebab-case) | Plural | `/tipos-tramite` |
| Controller | Singular | `TipoTramiteController` |
| Frontend folder | Singular | `TipoTramite/` |

## To verify

1. Check `php artisan route:list` for new routes
2. Run `php artisan test --filter={Entity}`
3. Run `npx tsc --noEmit` for TypeScript errors
4. Run `./vendor/bin/pint` for PHP formatting
