import { useQuery } from '@tanstack/react-query';
import { toSentenceCase } from '@/utils/string';
import fetcher from '../fetcher';
import { pokemonTypes } from '@/types/pokemon';

// GraphQL query to fetch Pokémon and their types and efficacies based on dynamic input types
const getMergedPokemonQuery = (types: string[]) => /* GraphQL */ `
query fetchPokemonWithTypes {
  pokemon_v2_type(
    where: { name: { _in: ${JSON.stringify(types)} } }, 
    distinct_on: generation_id
  ) {
    id
    name
    pokemonV2TypeefficaciesByTargetTypeId {
      damage_factor
      pokemon_v2_type {
        name
      }
    }
    pokemon_v2_typeefficacies {
      damage_factor
      pokemonV2TypeByTargetTypeId {
        name
      }
    }
  }
  pokemon_v2_pokemon_aggregate(
    where: {
      _and: [
       
       
        ${
          types.length === 1
            ? `
            {
              pokemon_v2_pokemontypes: {
                pokemon_v2_type: { name: { _eq: ${JSON.stringify(types[0])} } }
              }
            },
           
        {
          pokemon_v2_pokemontypes_aggregate: {
            count: { predicate: { _eq: 1 } }
          }
        }
            `
            : types.length === 2
            ? `
            {
              _and: [
                {
                  pokemon_v2_pokemontypes: {
                    pokemon_v2_type: { name: { _eq: ${JSON.stringify(types[0])} } }
                  }
                },
                {
                  pokemon_v2_pokemontypes: {
                    pokemon_v2_type: { name: { _eq: ${JSON.stringify(types[1])} } }
                  }
                }
              ]
            }
            `
            : "{}"
        }
      ]
    }
  ) {
    aggregate {
      count
    }
    nodes {
      id
      name
      pokemon_v2_pokemonspecy {
        pokemon_v2_generation {
          id
          name
        }
      }
    }
  }
}
`;



// TypeScript types
type FetchMergedPokemonResponse = {
  pokemon_v2_type: {
    id: number;
    name: string;
    pokemonV2TypeefficaciesByTargetTypeId: {
      damage_factor: number;
      pokemon_v2_type: { name: string };
    }[];
    pokemon_v2_typeefficacies: {
      damage_factor: number;
      pokemonV2TypeByTargetTypeId: { name: string };
    }[];
  }[];
  pokemon_v2_pokemon_aggregate: {
    aggregate: {
      count: number;
    };
    nodes: {
      id: number;
      name: string;
      pokemon_v2_pokemonspecy: {
        pokemon_v2_generation: {
          id: number;
          name: string;
        };
      };
    }[];
  };
};

export type QueryMergedPokemonData = {
  types: pokemonTypes[];
  totalCount: number;
  pokemon: {
    id: number;
    name: string;
    generation: string;
  }[];
};

export const fetchMergedPokemon = async (
  types: string[]
): Promise<QueryMergedPokemonData> => {
  const query = getMergedPokemonQuery(types);

  const res = await fetcher<FetchMergedPokemonResponse>(query);

  console.log("res", res);

  return {
    types: res.pokemon_v2_type.map(({ id, name, pokemonV2TypeefficaciesByTargetTypeId, pokemon_v2_typeefficacies }) => ({
      id,
      name: toSentenceCase(name),
      incomingDamage: pokemonV2TypeefficaciesByTargetTypeId.map(efficacy => ({
        damage_factor: efficacy.damage_factor,
        pokemon_v2_type: efficacy.pokemon_v2_type,
      })),
      outgoingDamage: pokemon_v2_typeefficacies.map(efficacy => ({
        damage_factor: efficacy.damage_factor,
        pokemon_v2_type: efficacy.pokemonV2TypeByTargetTypeId,
      })),
    })),
    totalCount: res.pokemon_v2_pokemon_aggregate.aggregate.count,
    pokemon: res.pokemon_v2_pokemon_aggregate.nodes.map(({ id, name, pokemon_v2_pokemonspecy }) => ({
      id,
      name,
      generation: pokemon_v2_pokemonspecy.pokemon_v2_generation.name,
    })),
  };
};

export const useQueryMergedPokemon = (types: string[]) =>
  useQuery<
    QueryMergedPokemonData,
    unknown,
    QueryMergedPokemonData,
    ['pokemon', string[]]
  >(['pokemon', types], () => fetchMergedPokemon(types));
