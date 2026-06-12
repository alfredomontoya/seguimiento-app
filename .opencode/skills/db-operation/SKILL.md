---
name: db-operation
description: Database operations — migrations, seeders, fresh reset. Use when asked about database changes, migrations, or seeding.
---

# DB Operations — Sistema de Seguimiento

## Commands

### Create migration

```bash
php artisan make:migration create_{table}_table
php artisan make:migration add_{column}_to_{table}_table
```

### Run migrations

```bash
php artisan migrate                    # Run pending
php artisan migrate --pretend          # Preview SQL
```

### Rollback

```bash
php artisan migrate:rollback           # Last batch
php artisan migrate:rollback --step=3  # Last 3 batches
```

### Reset + fresh

```bash
php artisan migrate:fresh              # Drop all tables + re-run
php artisan migrate:fresh --seed       # Drop + re-run + seed
php artisan migrate:fresh --seeder=DatabaseSeeder
```

### Seeders

```bash
php artisan db:seed                    # Run DatabaseSeeder (truncates + reseeds all tables)
php artisan db:seed --class=TramiteSeeder
php artisan make:seeder {Entity}Seeder
```

> **Nota:** `DatabaseSeeder` trunca todas las tablas (reinicia auto-incrementales)
> antes de ejecutar los seeders, por lo que `db:seed` funciona como un
> `migrate:fresh --seed` sin necesidad de migrar.

### Status

```bash
php artisan migrate:status             # Show migration status
```

### Batch create model + migration + seeder + factory

```bash
php artisan make:model {Entity} -msf
```

Flags:
- `-m` migration
- `-s` seeder
- `-f` factory
- `-c` controller
- `-p` policy (Laravel 11+)

## Migration style

Follow existing migrations:
- `up()`: `Schema::create()` with proper types
- `foreignId(...)->constrained()->cascadeOnDelete()`
- Use `softDeletes()` if needed
- Timestamps at the end
