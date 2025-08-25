<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Cobertura;
use App\Models\TipoArchivo;


class Archivo extends Model
{
    protected $table = 'archivos';
    protected $fillable = ["rutaArchivo","descripcion", "ID_cobertura", "ID_tipoarchivo"];
    public $timestamps = false;
   
    public function coberturas()
    {
        return $this->belongsTo(Cobertura::class, 'ID_cobertura');
    }

    public function tipoArchivo()
    {
        return $this->belongsTo(TipoArchivo::class, 'ID_tipoarchivo');
    }
}
