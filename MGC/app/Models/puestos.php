<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class puestos extends Model
{
    protected $table = 'puestos';
    protected $fillable = ["Descripcion", "ID_Area"];
    public $timestamps = false;
    public function area()
    {
        return $this->belongsTo(areas::class, 'ID_Area', 'id');
    }
    public function recursohumano()
    {
        return $this->belongsToMany(recursohumano::class, 'ID_Puesto', 'id');
    }
    public function cobertura()
    {
        return $this->belongsToMany(coberturas::class, 'ID_Puesto', 'id');
    }
}
