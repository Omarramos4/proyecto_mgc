<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModalidadesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('Modalidades')->insert([
            ['Descripcion' => 'Según Rol'],
            ['Descripcion' => 'Guardia Presencial'],
            ['Descripcion' => 'Guardia al Llamado'],
        ]);
    }
}
