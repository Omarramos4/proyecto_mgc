<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RecursoHumanoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('RecursoHumano')->insert([
            [
                'Nombres' => 'Juan Carlos',
                'Apellidos' => 'Pérez García',
                'DNI' => '2345678901234',
                'CtaBanco' => '1234567890123456',
                'Origen' => 'Interno',
                'ID_Puesto' => 1,
                'ID_Sucursal' => 1,
                'Estado' => 1
            ],
            [
                'Nombres' => 'Sofía Andrea',
                'Apellidos' => 'Martínez López',
                'DNI' => '3456789012345',
                'CtaBanco' => '2345678901234567',
                'Origen' => 'Interno',
                'ID_Puesto' => 2,
                'ID_Sucursal' => 1,
                'Estado' => 1
            ],
            [
                'Nombres' => 'Luis Fernando',
                'Apellidos' => 'Rodríguez Morales',
                'DNI' => '4567890123456',
                'CtaBanco' => '3456789012345678',
                'Origen' => 'Externo',
                'ID_Puesto' => 3,
                'ID_Sucursal' => 2,
                'Estado' => 1
            ],
            [
                'Nombres' => 'Carmen Elena',
                'Apellidos' => 'Hernández Vega',
                'DNI' => '5678901234567',
                'CtaBanco' => '4567890123456789',
                'Origen' => 'Interno',
                'ID_Puesto' => 4,
                'ID_Sucursal' => 1,
                'Estado' => 1
            ],
            [
                'Nombres' => 'Diego Alejandro',
                'Apellidos' => 'Castro Ruiz',
                'DNI' => '6789012345678',
                'CtaBanco' => '5678901234567890',
                'Origen' => 'Externo',
                'ID_Puesto' => 5,
                'ID_Sucursal' => 2,
                'Estado' => 1
            ],
        ]);
    }
}
