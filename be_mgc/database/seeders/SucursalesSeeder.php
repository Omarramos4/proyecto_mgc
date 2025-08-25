<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SucursalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('Sucursales')->insert([
            [
                'NombreSucursal' => 'Hospital M. Central',
                'Direccion' => 'Av. Principal 123, Centro',
                'ContactoPrincipal' => 'María González',
                'Telefono' => '+502 2234-5678',
                'Estado' => 1
            ],
            [
                'NombreSucursal' => 'Hospital M. Regional',
                'Direccion' => 'Zona 17, Calzada Roosevelt 456',
                'ContactoPrincipal' => 'Carlos Méndez',
                'Telefono' => '+502 2345-6789',
                'Estado' => 1
            ],
        ]);
    }
}
