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
        Schema::create('RecursoHumano', function(Blueprint $table){
            $table->id();
            $table->string('Nombres');
            $table->string('Apellidos');
            $table->string('DNI');
            $table->string('CtaBanco');
            $table->string('Origen');
            $table->foreignId('ID_Puesto')->constrained('Puestos')->onDelete('cascade');
            $table->foreignId('ID_Sucursal')->constrained('Sucursales')->onDelete('cascade');
            $table->tinyInteger('Estado')->default(1); // 1: activo, 0: inactivo
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('RecursoHumano');
    }
};
