<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class roles extends Model
{
    protected $table = 'roles';
    protected $fillable = ["NombreRol","Descripcion"];
    public $timestamps = false;
    public function usuarios()
    {
        return $this->belongsToMany(usuarios::class, 'ID_Rol', 'id');
    }
}
