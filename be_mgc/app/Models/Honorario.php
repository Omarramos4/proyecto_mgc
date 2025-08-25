<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RecursoHumano;

class Honorario extends Model
{
    protected $table = 'honorarios';

    protected $fillable = [
        'ID_recursohumano',
        'ID_cobertura',
        'ISR',
        'ISS',
        'RelojMarcador',
        'totalDeduccion',
        'pagoNeto',
        'fechaHora_honorario'
    ];

    public $timestamps = false;

    public function recursoHumano()
    {
        return $this->belongsTo(RecursoHumano::class, 'ID_recursohumano');
    }
    public function cobertura()
    {
        return $this->belongsTo(Cobertura::class, 'ID_cobertura');
    }
}
