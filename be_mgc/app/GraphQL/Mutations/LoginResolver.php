<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Carbon\Carbon;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;

class LoginResolver
{
    public function __invoke($root, array $args, $context)
    {
        $input = $args['input'];
        $request = $context->request();
        $clientIp = $request->ip();
        
        // Rate limiting - máximo 5 intentos por minuto por IP
        $key = 'login.' . $clientIp;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw new AuthenticationException("Demasiados intentos de login. Intente nuevamente en {$seconds} segundos.");
        }
        
        // Validar entrada
        if (empty($input['NombreUsuario']) || empty($input['Contrasenia'])) {
            RateLimiter::hit($key, 60); // Penalizar intentos con datos vacíos
            throw new AuthenticationException('Usuario y contraseña son requeridos');
        }
        
        // Buscar usuario activo
        $user = Usuario::where('NombreUsuario', $input['NombreUsuario'])
                      ->where('Estado', 1) // Solo usuarios activos
                      ->first();
        
        if (!$user || !Hash::check($input['Contrasenia'], $user->Contrasenia)) {
            RateLimiter::hit($key, 60); // Penalizar intento fallido
            
            // Log del intento fallido (sin exponer información sensible)
            \Log::warning('Login fallido', [
                'ip' => $clientIp,
                'user_agent' => $request->userAgent(),
                'attempted_username' => $input['NombreUsuario'],
                'timestamp' => now()
            ]);
            
            throw new AuthenticationException('Credenciales inválidas');
        }
        
        // Limpiar intentos fallidos en login exitoso
        RateLimiter::clear($key);
        
        // Invalidar tokens anteriores del usuario (opcional, para mayor seguridad)
        // $user->tokens()->delete();
        
        // Crear nuevo token con expiración
        $token = $user->createToken('auth_token', ['*'], now()->addHours(8))->plainTextToken;
        
        // Log del login exitoso
        \Log::info('Login exitoso', [
            'user_id' => $user->id,
            'ip' => $clientIp,
            'user_agent' => $request->userAgent(),
            'timestamp' => now()
        ]);
        
        // Actualizar última actividad del usuario
        $user->update(['ultimo_acceso' => now()]);
        
        return [
            'token' => $token,
            'expiresAt' => now()->addHours(8)->toISOString(),
            'user' => [
                'id' => $user->id,
                'NombreUsuario' => $user->NombreUsuario,
                'NombreCompleto' => $user->NombreCompleto,
                // NO enviar datos sensibles como roles al frontend
                // Estos se obtendrán en consultas separadas cuando se necesiten
            ],
        ];
    }
}
