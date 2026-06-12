---
name: start-app
description: Inicia los servidores de desarrollo Laravel + Vite simultáneamente
---

# Start App

Inicia los servidores de desarrollo Laravel + Vite simultáneamente.

## Qué hace

Ejecuta `npm run start` que corre en paralelo:

- `php artisan serve` — Backend en **http://localhost:8000**
- `npm run dev` — Frontend con hot reload en **http://localhost:5173**

## Requisitos

- PHP 8.2+
- Node.js
- Composer dependencies instaladas (`composer install`)
- NPM dependencies instaladas (`npm install`)
- Base de datos migrada y seedeada (`php artisan migrate:fresh --seed`)
