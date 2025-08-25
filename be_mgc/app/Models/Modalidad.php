<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cobertura;

class Modalidad extends Model
{
    use HasFactory;

    protected $table = 'modalidades';
    public $timestamps = false;

    protected $fillable = [
        'Descripcion',
    ];

    public function coberturas()
    {
        return $this->hasMany(Cobertura::class, 'ID_modalidad');
    }
}
