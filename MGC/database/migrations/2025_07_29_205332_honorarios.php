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
        Schema::create('Honorarios', function(Blueprint $table){
            $table->id();
            $table->foreignId('ID_recursohumano')->constrained('RecursoHumano')->onDelete('cascade');
            $table->decimal('totalGeneral', 10, 2);
            $table->decimal('ISR', 7, 2);
            $table->decimal('Imp1', 7, 2);
            $table->decimal('RelojMarcador', 7, 2);
            $table->decimal('totalDeduccion', 7, 2);
            $table->decimal('pagoNeto', 7, 2);
            $table->timestamp('fechaHora_honorario')->useCurrent();
            
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Honorarios');
    }
};
