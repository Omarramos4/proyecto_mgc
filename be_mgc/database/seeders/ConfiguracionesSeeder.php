<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfiguracionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('Configuraciones')->insert([
            ['nombre' => 'ISR','valor'=>'12.5%', 'descripcion' =>'Impuesto sobre la Renta'],
            ['nombre' => 'ISS','valor'=>'1%', 'descripcion' =>'Impuesto sobre Salarios'],
        ]);
    }
}
