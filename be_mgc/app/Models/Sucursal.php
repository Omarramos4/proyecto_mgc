<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Usuario;
use App\Models\RecursoHumano;

class Sucursal extends Model
{
    use HasFactory;

    protected $table = 'sucursales';        
    public $timestamps = false;

    protected $fillable = [
        'NombreSucursal',
        'Direccion',
        'ContactoPrincipal',
        'Telefono',
        'Estado',
    ];

    protected $casts = [
        'Estado' => 'integer',
    ];

    public function usuarios()
    {
        return $this->hasMany(Usuario::class,'ID_Sucursal');
    }

    public function recursosHumanos()
    {
        return $this->hasMany(RecursoHumano::class, 'ID_Sucursal');
    }
}
