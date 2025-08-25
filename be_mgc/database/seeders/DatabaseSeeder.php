<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seeders en orden de dependencias
        $this->call([
            // Tablas base sin dependencias
            ModalidadesSeeder::class,
            RolesSeeder::class,
            SucursalesSeeder::class,
            AreasSeeder::class,
            MotivosSeeder::class,
            ConfiguracionesSeeder::class,
            TiposArchivosSeeder::class,    // Tipos de archivos sin dependencias
            
            // Tablas con una dependencia
            PuestosSeeder::class,          // Depende de Areas
            UsuariosSeeder::class,         // Depende de Roles y Sucursales
            RecursoHumanoSeeder::class,    // Depende de Puestos y Sucursales
            
            // Tablas con múltiples dependencias
           // CoberturasSeeder::class,       // Depende de Usuarios, RecursoHumano, Puestos, Motivos, Modalidades
           // HonorariosSeeder::class,       // Depende de RecursoHumano
            //LogsSeeder::class,             // Depende de Usuarios
            //ArchivosSeeder::class,         // Depende de Coberturas y TiposArchivos
        ]);
    }
}
