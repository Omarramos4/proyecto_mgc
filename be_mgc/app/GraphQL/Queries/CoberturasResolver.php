<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Cobertura;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CoberturasResolver
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $query = Cobertura::query();

        // Obtiene un array de las relaciones solicitadas en la consulta GraphQL.
        // La función `array_keys` extrae los nombres de las relaciones del árbol de selección.
        // Esto nos permite cargar dinámicamente solo lo que el cliente pide.
        $requestedRelations = array_keys($resolveInfo->getFieldSelection(2));

        // Filtramos para asegurarnos de que solo intentamos cargar relaciones válidas del modelo.
        $allowedRelations = ['solicitante', 'cobertura', 'cubierto', 'puesto', 'motivo', 'modalidad', 'archivos', 'honorarios'];
        $relationsToLoad = array_intersect($allowedRelations, $requestedRelations);

        if (!empty($relationsToLoad)) {
            $query->with($relationsToLoad);
        }

        return $query->get();
    }
}
