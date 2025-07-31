<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class coberturas extends Model
{
    protected $table = 'coberturas';
    protected $fillable = ["ID_solicitante, ID_cobertura", "ID_cubierto", "ID_puesto",
    "ID_motivo", "FechaInicio", "FechaFin", "ID_modalidad", 
    "Justificacion", "FechaSolicitud"];
    
    public $timestamps = false;
    public function puesto()
    {
        return $this->belongsTo(puestos::class, 'ID_Puesto', 'id');
    }
    public function usuario_solicitante()
    {
        return $this->belongsTo(usuarios::class, 'ID_solicitante', 'id');
    }
    public function recursohumano_cubierto()
    {
        return $this->belongsTo(recursohumano::class, 'ID_cubierto', 'id');
    }
    public function recursohumano_cobertura()
    {
        return $this->belongsTo(recursohumano::class, 'ID_cobertura', 'id');
    }
    public function modalidad()
    {
        return $this->belongsTo(modalidad::class, 'ID_modalidad', 'id');
    }
    public function motivo()
    {
        return $this->belongsTo(motivo::class, 'ID_motivo', 'id');
    }

}
