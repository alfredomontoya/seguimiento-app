<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cargo_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('cargo_id')->constrained('cargos')->cascadeOnDelete();
            $table->boolean('activo')->default(false);
            $table->timestamps();

            $table->primary(['user_id', 'cargo_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cargo_user');
    }
};
