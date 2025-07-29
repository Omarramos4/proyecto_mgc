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
        Schema::create('Logs', function(Blueprint $table){
            $table->id();
            $table->foreignId('ID_Usuario')->constrained('Usuarios')->onDelete('cascade');
            $table->string('tabla');
            $table->string('accion');
            $table->string('estado');
            $table->string('severidad');
            $table->string('descripcion');
            $table->timestamp('fechahora_registro')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Logs');
    }
};
