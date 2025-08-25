<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('archivos', function(Blueprint $table){
            $table->id();
            $table->string('rutaArchivo');
            $table->string('descripcion');
            $table->foreignId('ID_tipoarchivo')->constrained('tiposarchivos')->onDelete('cascade');
            $table->foreignId('ID_cobertura')->constrained('coberturas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archivos');
    }
};
