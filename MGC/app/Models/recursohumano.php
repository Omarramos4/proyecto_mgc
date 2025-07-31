<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class recursohumano extends Model
{
    protected $table = 'recursohumano';
    protected $fillable = ["Nombres", "Apellidos", "DNI","CtaBanco","Origen", 
    "ID_Puesto", "ID_Sucursal"];
    public $timestamps = false;
    public function puesto()
    {
        return $this->belongsTo(puestos::class, 'ID_Puesto', 'id');
    }
    public function sucursal()
    {
        return $this->belongsTo(sucursales::class, 'ID_Sucursal', 'id');
    }
    public function cobertura()
    {
        return $this->belongsToMany(coberturas::class, 'ID_cobertura', 'id');
    }
    public function cobertura_cubierto()
    {
        return $this->belongsToMany(coberturas::class, 'ID_cubierto', 'id');
    }
}
