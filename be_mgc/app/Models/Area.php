<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Puesto;

class Area extends Model
{
    protected $table = 'areas';
    protected $fillable = ['NombreArea'];  // Asegúrate de usar comillas simples y corchetes
    public $timestamps = false;


    public function puestos()
    {
        return $this->hasMany(Puesto::class, 'ID_Area');
    }

}
