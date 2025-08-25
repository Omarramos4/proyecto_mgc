<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Rol;
use App\Models\Sucursal;
use App\Models\Cobertura;


class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';
    public $timestamps = false;

    protected $fillable = [
        'NombreUsuario',
        'NombreCompleto',
        'CorreoElectronico',
        'Contrasenia',
        'ID_Rol',
        'ID_sucursal',
        'Estado',
        'ultimo_acceso',
    ];

    protected $hidden = [
        'Contrasenia',
        'remember_token',
    ];

    protected $casts = [
        'ultimo_acceso' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return $this->Contrasenia;
    }

    public function roles()
    {
        return $this->belongsTo(Rol::class, 'ID_Rol');
    }

    public function sucursales()
    {
        return $this->belongsTo(Sucursal::class, 'ID_sucursal');
    }

    public function coberturasSolicitadas()
    {
        return $this->hasMany(Cobertura::class, 'ID_solicitante');
    }
    public function setContraseniaAttribute($value)
    {
        $this->attributes['Contrasenia'] = Hash::make($value);
    }
}
