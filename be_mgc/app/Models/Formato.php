<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formato extends Model
{
    protected $table = 'formatos';
    protected $fillable = ["rutaArchivo","descripcion","id_sucursal"];
    public $timestamps = false;

    public function sucursales()
    {
        return $this->belongsTo(Sucursal::class, 'id_sucursal');
    }
}
