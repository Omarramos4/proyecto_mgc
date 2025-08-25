<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Usuario;



class Rol extends Model
{
    use HasFactory;

    protected $table = 'roles';
    public $timestamps = false;

    protected $fillable = [
        'NombreRol',
        'Descripcion',
    ];

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'ID_Rol');
    }
}
