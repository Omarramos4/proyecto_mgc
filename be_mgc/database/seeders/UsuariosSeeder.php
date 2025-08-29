<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuariosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('Usuarios')->insert([
            [
                'NombreUsuario' => 'admin',
                'NombreCompleto' => 'Administrador Sistema',
                'Contrasenia' => Hash::make('admin'),
                'CorreoElectronico' => 'admin@empresa.com',
                'ID_Rol' => 1,
                'ID_sucursal' => 1,
                'Estado' => 1
            ],
            [
                'NombreUsuario' => 'benoni',
                'NombreCompleto' => 'Ben Oni Benajamín Benguché',
                'Contrasenia' => Hash::make('password123'),
                'CorreoElectronico' => 'benoni.benguche@empresa.com',
                'ID_Rol' => 2,
                'ID_sucursal' => 1,
                'Estado' => 1
            ],
            [
                'NombreUsuario' => 'omarramos',
                'NombreCompleto' => 'Omar Alejandro Ramos Cáceres',
                'Contrasenia' => Hash::make('password123'),
                'CorreoElectronico' => 'omar.ramos@empresa.com',
                'ID_Rol' => 3,
                'ID_sucursal' => 2,
                'Estado' => 1
            ],
            [
                'NombreUsuario' => 'alopez',
                'NombreCompleto' => 'Ana López Martínez',
                'Contrasenia' => Hash::make('password123'),
                'CorreoElectronico' => 'ana.lopez@empresa.com',
                'ID_Rol' => 4,
                'ID_sucursal' => 1,
                'Estado' => 1
            ],
        ]);
    }
}
