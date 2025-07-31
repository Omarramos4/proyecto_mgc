<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class configuraciones extends Model
{
    protected $table = 'configuraciones';
    protected $fillable = ["nombre","valor", "descripcion"];
    public $timestamps = false;
}
