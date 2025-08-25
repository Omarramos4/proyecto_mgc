<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PuestosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('Puestos')->insert([
            ['Descripcion' => 'Licencia en Enfermería','SueldoGeneral'=>15500.00, 'ID_Area' => 1],
            ['Descripcion' => 'Médico General', 'SueldoGeneral'=>5666.66, 'ID_Area' => 1],
            ['Descripcion' => 'Médico Anestesiólogo', 'SueldoGeneral'=>30000.00, 'ID_Area' => 1],
            ['Descripcion' => 'Cirujano General', 'SueldoGeneral'=>30000.00, 'ID_Area' => 1],
            ['Descripcion' => 'Médico Pediatra', 'SueldoGeneral'=>10000.00, 'ID_Area' => 1],
            ['Descripcion' => 'Médico Ortopeda', 'SueldoGeneral'=>21500.00, 'ID_Area' => 1],
            ['Descripcion' => 'Médico Intensivista', 'SueldoGeneral'=>20000.00, 'ID_Area' => 1],
            ['Descripcion' => 'Técnico en Laboratorio', 'SueldoGeneral'=>10947.27, 'ID_Area' => 1],
        ]);
    }
}
