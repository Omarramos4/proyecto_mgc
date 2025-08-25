<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Area;
use App\Models\RecursoHumano;
use App\Models\Cobertura;
    
class Puesto extends Model
{
    use HasFactory;

    protected $table = 'puestos';
    public $timestamps = false;

    protected $fillable = [
        'Descripcion',
        'SueldoGeneral',
        'ID_Area',
    ];

    public function area()
    {
        return $this->belongsTo(Area::class, 'ID_Area');
    }

    public function recursosHumanos()
    {
        return $this->hasMany(RecursoHumano::class, 'ID_Puesto');
    }

    public function coberturas()
    {
        return $this->hasMany(Cobertura::class, 'ID_puesto');
    }
}
