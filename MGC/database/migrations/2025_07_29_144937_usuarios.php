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
        Schema::create('Usuarios', function(Blueprint $table){
            $table->id();
            $table->string('NombreUsuario');
            $table->string('NombreCompleto');
            $table->string('Contrasenia');
            $table->string('CorreoElectronico');
            $table->foreignId('ID_Rol')->constrained('Roles')->onDelete('cascade');
            $table->tinyInteger('Estado')->default(1); // 1: activo, 0: inactivo
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Usuarios');
    }
};
