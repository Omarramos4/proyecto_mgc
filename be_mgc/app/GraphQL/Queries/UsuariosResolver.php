<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Usuario;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UsuariosResolver
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $query = Usuario::query();

        $requestedRelations = array_keys($resolveInfo->getFieldSelection(2));

        // Lista de relaciones permitidas para el modelo Usuario
        $allowedRelations = ['sucursales', 'roles', 'coberturasSolicitadas'];
        $relationsToLoad = array_intersect($allowedRelations, $requestedRelations);

        if (!empty($relationsToLoad)) {
            $query->with($relationsToLoad);
        }

        return $query->get();
    }
}
