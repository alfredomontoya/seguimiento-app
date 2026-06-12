---
name: test-suite
description: Run tests for Laravel (Pest) and frontend (Vitest). Use when asked to run tests, check test coverage, or verify code.
---

# Test Suite — Sistema de Seguimiento

## Commands

### Backend (Pest + PHPUnit)

| Command | Description |
|---------|-------------|
| `php artisan test` | Run all tests |
| `php artisan test --filter={TestName}` | Run specific test |
| `php artisan test --testsuite=Feature` | Feature tests only |
| `php artisan test --testsuite=Unit` | Unit tests only |
| `php artisan test --coverage` | Coverage report (requires Xdebug/PCOV) |
| `./vendor/bin/pest --filter={TestName}` | Run with Pest binary directly |
| `./vendor/bin/pest --parallel` | Run in parallel (if ParaTest installed) |

### Frontend (Vitest)

| Command | Description |
|---------|-------------|
| `npm run test` | Run all frontend tests |
| `npm run test -- --run` | Run once (CI mode) |
| `npm run test -- --ui` | UI mode (browser) |
| `npx vitest --filter {testName}` | Run specific test file |

### Run both

```bash
php artisan test && npm run test -- --run
```

## Project structure

```
tests/
├── Feature/     # Controller + route tests
├── Unit/        # Service, Repository, DTO tests
├── Pest.php     # Pest config
└── TestCase.php # Base test class
```

## Writing tests

### Backend (Pest)

```php
// Feature test
it('lists all entities', function () {
    actingAsAdmin();
    Entity::factory(3)->create();

    $response = get(route('entities.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Entity/Index')
        ->has('entities.data', 3)
    );
});

// Unit test (Service)
it('creates an entity', function () {
    $service = app(EntityService::class);
    $data = new EntityData(nombre: 'Test');

    $entity = $service->create($data);

    expect($entity)->toBeInstanceOf(Entity::class);
    expect($entity->nombre)->toBe('Test');
});
```

### Frontend (Vitest)

```ts
import { render, screen } from '@testing-library/react';
import EntityForm from './EntityForm';

describe('EntityForm', () => {
    it('renders form fields', () => {
        render(<EntityForm onSubmit={vi.fn()} />);
        expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    });
});
```

## To verify after changes

```bash
php artisan test --filter={Entity}
npm run test -- --run
```
