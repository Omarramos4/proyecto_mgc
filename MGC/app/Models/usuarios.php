<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class usuarios extends Model
{
    protected $table = 'usuarios';
    protected $fillable = ["NombreUsuario","NombreCompleto", "Contrasenia", "CorreoElectronico", "ID_Rol", "ID_sucursal"];
    public $timestamps = false;

    protected $hidden = [
        'Contrasenia', // Para que no se devuelva en las consultas por defecto
    ];

    
    public function setContraseniaAttribute($value)
    {
        $this->attributes['Contrasenia'] = bcrypt($value);
    }

    public function rol()
    {
        return $this->belongsTo(roles::class, 'ID_Rol', 'id');
    }
    public function sucursal()
    {
        return $this->belongsTo(sucursales::class, 'ID_sucursal', 'id');
    }
    public function cobertura()
    {
        return $this->belongsToMany(coberturas::class, 'ID_solicitante', 'id');
    }
}
