<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class areas extends Model
{
    protected $table = 'areas';
    protected $fillable = ["NombreArea", "ID_Departamento"];
    public $timestamps = false;
    public function departamento()
    {
        return $this->belongsTo(departamentos::class, 'ID_Departamento', 'id');
    }
    public function puestos()
    {
        return $this->hasMany(puestos::class, 'ID_Area', 'id');
    }
}
