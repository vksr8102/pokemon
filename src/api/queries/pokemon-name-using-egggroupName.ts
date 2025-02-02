import { QueryFunctionContext, useQuery, UseQueryOptions } from '@tanstack/react-query';
import fetcher from '../fetcher';

// GraphQL query to fetch Pokémon based on egg group ID
const EGG_GROUP_QUERY = /* GraphQL */ `
  query EggGroup($eggGroupId: Int!) {
    pokemon_v2_pokemonegggroup(where: {egg_group_id: {_eq: $eggGroupId}}) {
      pokemon_v2_pokemonspecy {
        name
        pokemon_v2_pokemons {
          id
          name
          height
          order
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
        }
      }
    }
  }
`;

// Type definitions
type PokemonType = {
  pokemon_v2_type: {
    name: string;
  };
};

type PokemonSpecies = {
  id: number;
  name: string;
  height: number;
  order: number;
  pokemon_v2_pokemontypes: PokemonType[];
};

type PokemonEggGroup = {
  pokemon_v2_pokemonspecy: {
    name: string;
    pokemon_v2_pokemons: PokemonSpecies[];
  };
};

type FetchEggGroupResponse = {
  pokemon_v2_pokemonegggroup: PokemonEggGroup[];
};

// Query key and data types for React Query
export type QueryEggGroupKey = ['eggGroup', number];
export type QueryEggGroupData = PokemonSpecies[];

// Function to fetch data based on egg group ID
export const fetchEggGroup = async (
  ctx: QueryFunctionContext<QueryEggGroupKey>
): Promise<PokemonSpecies[]> => {
  const [_, eggGroupId] = ctx.queryKey;
  const res = await fetcher<FetchEggGroupResponse>(EGG_GROUP_QUERY, { eggGroupId });

  return res.pokemon_v2_pokemonegggroup
    .map(group => group.pokemon_v2_pokemonspecy.pokemon_v2_pokemons)
    .flat();
};

// Custom hook for querying egg groups
export const useQueryEggGroup = <T = QueryEggGroupData>(
  eggGroupId: number,
  options?: Omit<UseQueryOptions<PokemonSpecies[], unknown, T, QueryEggGroupKey>, 'queryKey' | 'queryFn'>
) =>
  useQuery<PokemonSpecies[], unknown, T, QueryEggGroupKey>(
    ['eggGroup', eggGroupId],
    fetchEggGroup,
    options,
  );



