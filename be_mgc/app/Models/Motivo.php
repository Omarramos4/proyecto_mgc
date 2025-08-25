<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cobertura;

class Motivo extends Model
{
    use HasFactory;

    protected $table = 'motivos';
    public $timestamps = false;

    protected $fillable = [
        'Descripcion',
    ];

    public function coberturas()
    {
        return $this->hasMany(Cobertura::class, 'ID_motivo');
    }
}
