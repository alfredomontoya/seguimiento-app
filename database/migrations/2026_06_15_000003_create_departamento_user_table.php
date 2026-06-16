<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departamento_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('departamento_id')->constrained('departamentos')->cascadeOnDelete();
            $table->boolean('activo')->default(false);
            $table->timestamps();

            $table->primary(['user_id', 'departamento_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departamento_user');
    }
};
