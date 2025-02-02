// @ts-ignore
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import fetcher from '../fetcher';

const LIMIT = 18;

export type QueryPokemonFilter = {
  name: string;
  generationId?: number;
  typeId?: number;
};

type FetchPokemonsResponse = {
  pokemon_v2_pokemon: {
    id: number;
    name: string;
    pokemon_v2_pokemontypes: {
      pokemon_v2_type: {
        name: string;
      };
    }[];
  }[];
};

export type QueryPokemonsKey = ['pokemons', QueryPokemonFilter];
export type QueryPokemonsData = FetchPokemonsResponse['pokemon_v2_pokemon'];

export const fetchPokemonsSpcies = async (ctx: QueryFunctionContext<QueryPokemonsKey>): Promise<QueryPokemonsData> => {
  const { name } = ctx.queryKey[1];

  const POKEMONS = `
  query getGigantamaxPokemons {
    pokemon_v2_pokemon(where: {name: {_ilike: "%${name}"}}) {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
    }
  }
`;

  // Log the query to check what is being sent
  console.log("Executing GraphQL Query:", POKEMONS);

  const res = await fetcher<FetchPokemonsResponse>(POKEMONS);


  // Check if the response is valid and return the pokemon data
  if (!res || !res.pokemon_v2_pokemon) {
    throw new Error('No Pokémon data found');
  }

  return res.pokemon_v2_pokemon;
};

export const useInfQueryPokemonsSpecies = (filter: QueryPokemonFilter) =>
  useInfiniteQuery<QueryPokemonsData, unknown, QueryPokemonsData, QueryPokemonsKey>(
    ['pokemons', filter],
    fetchPokemonsSpcies,
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) =>
        lastPage.length < LIMIT ? undefined : lastPage.length,
    },
  );
