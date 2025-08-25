<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Sucursal;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class SucursalesResolver
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $query = Sucursal::query();

        $requestedRelations = array_keys($resolveInfo->getFieldSelection(2));

        // Lista de relaciones permitidas para el modelo Sucursal
        $allowedRelations = ['usuarios', 'recursosHumanos'];
        $relationsToLoad = array_intersect($allowedRelations, $requestedRelations);

        if (!empty($relationsToLoad)) {
            $query->with($relationsToLoad);
        }

        return $query->get();
    }
}
