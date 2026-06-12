<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departamentos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('sigla')->nullable();
            $table->text('descripcion')->nullable();
            $table->foreignId('departamento_padre_id')->nullable()->constrained('departamentos')->nullOnDelete();
            $table->boolean('activo')->default(true);
            $table->foreignId('creado_por_id')->nullable()->constrained('users');
            $table->foreignId('actualizado_por_id')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departamentos');
    }
};
