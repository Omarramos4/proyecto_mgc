<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Honorario;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class HonorariosResolver
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $query = Honorario::query();

        $requestedRelations = array_keys($resolveInfo->getFieldSelection(2));

        // Lista de relaciones permitidas para el modelo Honorario
        $allowedRelations = ['recursoHumano', 'cobertura'];
        $relationsToLoad = array_intersect($allowedRelations, $requestedRelations);

        if (!empty($relationsToLoad)) {
            $query->with($relationsToLoad);
        }

        return $query->get();
    }
}
