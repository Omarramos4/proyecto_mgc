<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Usuario;
use App\Models\RecursoHumano;
use App\Models\Puesto;
use App\Models\Motivo;
use App\Models\Modalidad;
use App\Models\Archivo;


class Cobertura extends Model
{
    use HasFactory;

    protected $table = 'coberturas';
    public $timestamps = false;

    protected $fillable = [
        'ID_solicitante',
        'ID_cobertura',
        'ID_cubierto',
        'ID_puesto',
        'ID_motivo',
        'FechaInicio',
        'FechaFin',
        'ID_modalidad',
        'Justificacion',
        'FechaSolicitud',
        'Estado'
    ];

    public function solicitante()
    {
        return $this->belongsTo(Usuario::class, 'ID_solicitante');
    }

    public function cobertura()
    {
        return $this->belongsTo(RecursoHumano::class, 'ID_cobertura');
    }

    public function cubierto()
    {
        return $this->belongsTo(RecursoHumano::class, 'ID_cubierto');
    }

    public function puesto()
    {
        return $this->belongsTo(Puesto::class, 'ID_puesto');
    }

    public function motivo()
    {
        return $this->belongsTo(Motivo::class , 'ID_motivo');
    }

    public function modalidad()
    {
        return $this->belongsTo(Modalidad::class, 'ID_modalidad');
    }
    public function archivos()
    {
        return $this->hasMany(Archivo::class, 'ID_cobertura');
    }
    public function honorarios()
    {
        return $this->hasMany(Honorario::class, 'ID_cobertura');
    }
}
