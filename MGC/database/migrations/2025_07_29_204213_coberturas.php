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
        Schema::create('Coberturas', function(Blueprint $table){
            $table->id();
            $table->foreignId('ID_solicitante')->constrained('Usuarios')->onDelete('cascade');
            $table->foreignId('ID_cobertura')->constrained('RecursoHumano')->onDelete('cascade');
            $table->foreignId('ID_cubierto')->constrained('RecursoHumano')->onDelete('cascade');
            $table->foreignId('ID_puesto')->constrained('Puestos')->onDelete('cascade');
            $table->foreignId('ID_motivo')->constrained('Motivos')->onDelete('cascade');
            $table->date('FechaInicio');
            $table->date('FechaFin');
            $table->foreignId('ID_modalidad')->constrained('Modalidades')->onDelete('cascade');
            $table->string('Justificacion');
            $table->timestamp('FechaSolicitud')->useCurrent(); 
            $table->string('Estado')->default('Pendiente');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Coberturas');
    }
};
