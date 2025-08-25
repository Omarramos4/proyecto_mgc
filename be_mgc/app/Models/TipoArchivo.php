<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoArchivo extends Model
{
    protected $table = 'tiposarchivos';
    protected $fillable = ["descripcion"];
    public $timestamps = false;

    public function archivos()
    {
        return $this->hasMany(Archivo::class, 'ID_tipoarchivo');
    }
}