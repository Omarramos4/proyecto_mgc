<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class sucursales extends Model
{
    protected $table = 'sucursales';
    protected $fillable = ["NombreSucursal","Direccion","ContactoPrincipal", "Telefono"];
    public $timestamps = false;
    public function usuarios()
    {
        return $this->belongsToMany(usuarios::class, 'ID_Sucursal', 'id');
    }
    public function recursohumano()
    {
        return $this->belongsToMany(recursohumano::class, 'ID_Sucursal', 'id');
    }
}
