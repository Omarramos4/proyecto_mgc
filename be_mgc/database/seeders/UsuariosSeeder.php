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
                'Contrasenia' => Hash::make('admin123'),
                'CorreoElectronico' => 'admin@empresa.com',
                'ID_Rol' => 1,
                'ID_sucursal' => 1,
                'Estado' => 1
            ],
            [
                'NombreUsuario' => 'mgonzalez',
                'NombreCompleto' => 'María González Pérez',
                'Contrasenia' => Hash::make('password123'),
                'CorreoElectronico' => 'maria.gonzalez@empresa.com',
                'ID_Rol' => 2,
                'ID_sucursal' => 1,
                'Estado' => 1
            ],
            [
                'NombreUsuario' => 'cmendez',
                'NombreCompleto' => 'Carlos Méndez López',
                'Contrasenia' => Hash::make('password123'),
                'CorreoElectronico' => 'carlos.mendez@empresa.com',
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
            [
                'NombreUsuario' => 'rdiaz',
                'NombreCompleto' => 'Roberto Díaz Hernández',
                'Contrasenia' => Hash::make('password123'),
                'CorreoElectronico' => 'roberto.diaz@empresa.com',
                'ID_Rol' => 5,
                'ID_sucursal' => 2,
                'Estado' => 1
            ],
        ]);
    }
}
