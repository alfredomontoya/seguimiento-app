<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('derivaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tramite_id')->constrained('tramites')->cascadeOnDelete();
            $table->foreignId('departamento_origen_id')->constrained('departamentos');
            $table->foreignId('departamento_destino_id')->constrained('departamentos');
            $table->foreignId('funcionario_id')->nullable()->constrained('funcionarios')->nullOnDelete();
            $table->date('fecha_asignacion');
            $table->text('comentarios_internos')->nullable();
            $table->text('glosa')->nullable();
            $table->foreignId('creado_por_id')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('derivaciones');
    }
};
