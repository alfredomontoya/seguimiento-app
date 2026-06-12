---
name: make-model
description: Generate a complete Eloquent Model with fillable, casts, relations, factory, and seeder following project conventions. Use when creating a new model.
---

# Make Model — Sistema de Seguimiento

## Step 1: Generate base files

```bash
php artisan make:model {Entity} -msf
```

Flags:
- `-m` → migration
- `-s` → seeder
- `-f` → factory

## Step 2: Edit the Model

File: `app/Models/{Entity}.php`

Follow existing models for style (`app/Models/*.php`).

### Required:

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class {Entity} extends Model
{
    use SoftDeletes; // if needed

    protected $fillable = [
        'nombre',
        // ...
    ];

    protected $casts = [
        'activo' => 'boolean',
        // ...
    ];

    // Relations with type hints
    public function creadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por_id');
    }
}
```

### Conventions:

| Element | Convention | Example |
|---------|-----------|---------|
| `$fillable` | snake_case | `'nro_documento'` |
| `$casts` | Explicit types | `'fecha' => 'datetime'` |
| `$hidden` | Sensitive fields | `'password'` |
| `$with` | Eager load defaults | `['creadoPor']` |
| Relations | camelCase + type hint | `public function creadoPor(): BelongsTo` |

### Audit fields pattern

If the model has `creado_por_id` and `actualizado_por_id`, add:

```php
public function creadoPor(): BelongsTo
{
    return $this->belongsTo(User::class, 'creado_por_id');
}

public function actualizadoPor(): BelongsTo
{
    return $this->belongsTo(User::class, 'actualizado_por_id');
}
```

## Step 3: Edit Migration

Ensure the migration follows the project schema style:
- Use `foreignId(...)->constrained()->cascadeOnDelete()` for FKs
- Use `softDeletes()` if applicable
- Include `creado_por_id` and `actualizado_por_id` if audit needed

## Step 4: Edit Factory

File: `database/factories/{Entity}Factory.php`

```php
public function definition(): array
{
    return [
        'nombre' => fake()->unique()->word(),
        'activo' => true,
    ];
}
```

## Step 5: Edit Seeder

File: `database/seeders/{Entity}Seeder.php`

```php
public function run(): void
{
    {Entity}::factory(10)->create();
}
```

Register in `DatabaseSeeder.php` if needed.

## Step 6: Run

```bash
php artisan migrate
php artisan db:seed --class={Entity}Seeder
```
