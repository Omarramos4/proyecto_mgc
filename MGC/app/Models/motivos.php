<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class motivos extends Model
{
    protected $table = 'motivos';
    protected $fillable = ["Descripcion"];
    public $timestamps = false;
    public function cobertura()
    {
        return $this->belongsToMany(coberturas::class, 'ID_motivo', 'id');
    }
}
