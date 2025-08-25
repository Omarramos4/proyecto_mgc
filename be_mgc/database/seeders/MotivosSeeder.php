<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MotivosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('Motivos')->insert([
            ['Descripcion' => 'Retiro por Copi'],
            ['Descripcion' => 'Vacaciones Ordinarias'],
            ['Descripcion' => 'Reposo Laboral'],
        ]);
    }
}
