<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE users ADD UNIQUE INDEX users_nro_documento_unique (nro_documento)');
    }

    public function down(): void
    {
        Schema::table('users', function ($table) {
            $table->dropIndex('users_nro_documento_unique');
        });
    }
};
