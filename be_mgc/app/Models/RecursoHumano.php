<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Puesto;
use App\Models\Sucursal;
use App\Models\Cobertura;
use App\Models\Honorario;

class RecursoHumano extends Model
{
    use HasFactory;

    protected $table = 'recursohumano';
    public $timestamps = false;

    protected $fillable = [
        'Nombres',
        'Apellidos',
        'DNI',
        'CtaBanco',
        'Origen',
        'ID_Puesto',
        'ID_Sucursal',
        'Estado',
    ];

    public function puesto()
    {
        return $this->belongsTo(Puesto::class, 'ID_Puesto');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'ID_Sucursal');
    }

    public function coberturas()
    {
        return $this->hasMany(Cobertura::class, 'ID_cobertura');
    }

    public function cubierto()
    {
        return $this->hasMany(Cobertura::class, 'ID_cubierto');
    }
    public function honorarios()
    {
        return $this->hasMany(Honorario::class, 'ID_recursohumano');
    }
}
