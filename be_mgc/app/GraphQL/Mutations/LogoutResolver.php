<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;

class LogoutResolver
{
    public function __invoke($root, array $args, $context)
    {
        $user = Auth::user();
        
        if (!$user) {
            return false;
        }
        
        // Revocar el token actual del usuario
        $user->currentAccessToken()->delete();
        
        // Log del logout
        \Log::info('Logout exitoso', [
            'user_id' => $user->id,
            'ip' => $context->request()->ip(),
            'user_agent' => $context->request()->userAgent(),
            'timestamp' => now()
        ]);
        
        return true;
    }
}
