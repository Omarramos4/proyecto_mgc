<?php

namespace App\GraphQL\Queries;

use Illuminate\Support\Facades\Auth;

class MeResolver
{
    public function __invoke($root, array $args, $context)
    {
        $user = Auth::user();
        
        if (!$user) {
            throw new \Exception('No autenticado');
        }
        
        // Verificar que el usuario sigue activo
        if ($user->Estado != 1) {
            throw new \Exception('Usuario deshabilitado');
        }
        
        return $user;
    }
}
