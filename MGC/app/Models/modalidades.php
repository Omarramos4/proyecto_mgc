<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class modalidades extends Model
{
    protected $table = 'modalidades';
    protected $fillable = ["Descripcion"];
    public $timestamps = false;
    public function cobertura()
    {
        return $this->belongsToMany(coberturas::class, 'ID_modalidad', 'id');
    }
}
