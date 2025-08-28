<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FormatosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('Formatos')->insert([
            ['rutaArchivo' => 'formatos\2025\FORMATO_PLANILLA_DE_PAGO_COBERTURAS_1_2025.pdf', 'descripcion' => 'Formato de planilla de pago de coberturas.', 'id_sucursal' => 1],
        ]);

    }
}
