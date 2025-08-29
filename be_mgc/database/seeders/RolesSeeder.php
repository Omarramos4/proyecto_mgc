<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('Roles')->insert([
            ['NombreRol' => 'Administrador', 'Descripcion' => 'Usuario con permisos completos del sistema'],
            ['NombreRol' => 'Editor', 'Descripcion' => 'Usuario con permisos de lectura y gestión'],
            ['NombreRol' => 'Lector', 'Descripcion' => 'Usuario con permisos de lectura'],
            ['NombreRol' => 'Gerente', 'Descripcion' => 'Usuario con permisos de gerencia departamental'],

        ]);
    }
}
