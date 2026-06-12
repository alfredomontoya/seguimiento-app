<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tramites', function (Blueprint $table) {
            $table->id();
            $table->string('nro_secuencial')->unique();
            $table->date('fecha_recepcion');
            $table->string('referencia');
            $table->foreignId('tipo_tramite_id')->constrained('tipo_tramites');
            $table->foreignId('persona_id')->constrained('personas');
            $table->foreignId('departamento_id')->nullable()->constrained('departamentos')->nullOnDelete();
            $table->string('estado')->default('recibido');
            $table->date('fecha_termino')->nullable();
            $table->text('glosa_entrega')->nullable();
            $table->foreignId('creado_por_id')->nullable()->constrained('users');
            $table->foreignId('actualizado_por_id')->nullable()->constrained('users');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tramites');
    }
};
