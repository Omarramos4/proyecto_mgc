<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class departamentos extends Model
{
    protected $table = 'departamentos';
    protected $fillable = ["NombreDepartamento"];
    public $timestamps = false;
    public function areas()
    {
        return $this->hasMany(areas::class, 'ID_Departamento', 'id');
    }
}
