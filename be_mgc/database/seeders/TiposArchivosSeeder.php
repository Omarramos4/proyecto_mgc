<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TiposArchivosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tiposarchivos')->insert([
            ['descripcion' => 'Justificación'],
            ['descripcion' => 'Solicitud de Cobertura'],
            ['descripcion' => 'Solicitud de Permiso'],
        ]);
    }
}
