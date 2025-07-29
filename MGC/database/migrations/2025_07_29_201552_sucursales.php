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
        Schema::create('Sucursales', function(Blueprint $table){
            $table->id();
            $table->string('NombreSucursal');
            $table->string('Direccion');
            $table->string('ContactoPrincipal');
            $table->string('Telefono');
            $table->tinyInteger('Estado')->default(1); // 1: activo, 0: inactivo
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Sucursales');
    }
};
