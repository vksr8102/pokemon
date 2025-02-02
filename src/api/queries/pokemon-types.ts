import { useQuery } from '@tanstack/react-query';
import { Pokemon_V2_Type } from '@/generated/graphql.types';
import { toSentenceCase } from '@/utils/string';
import fetcher from '../fetcher';

const POKEMON_TYPES_AND_THEIR_POKEMON_AND_SINGLE_TYPE = /* GraphQL */ `
query samplePokeAPIquery {
  pokemon_v2_type(order_by: { name: asc }) {
    name
    id

    pokemon: pokemon_v2_pokemontypes_aggregate(
      where: {
        pokemon_v2_pokemon: {
          name: { _nregex: "Gmax" }  
        }
      }
    ) {
      aggregate {
        count
      }
    }

    singleType: pokemon_v2_pokemontypes_aggregate(
      where: {
        pokemon_v2_pokemon: {
          pokemon_v2_pokemontypes_aggregate: {
            count: { predicate: { _eq: 1 } }
          },
          name: { _nregex: "Gmax" } 
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
}
`;

type FetchPokemonTypesAndTheirSingleTypesResponse = {
  pokemon_v2_type: {
    id:number;
    name: string;
    pokemon: { aggregate: { count: number } };
    singleType: { aggregate: { count: number } };
  }[];
};

export type QueryPokemonTypesAndSingleTypesKey = ['pokemon-types'];
export type QueryPokemonTypesAndSingleTypesData = {
  types: {
    id:number;
    name: string;
    totalPokemon: number;
    singleTypePokemon: number;
  }[];
};

export const fetchPokemonTypesAndSingleTypes: () => Promise<QueryPokemonTypesAndSingleTypesData> = async () => {
  const res = await fetcher<FetchPokemonTypesAndTheirSingleTypesResponse>(POKEMON_TYPES_AND_THEIR_POKEMON_AND_SINGLE_TYPE);
  


  return {
    types: res.pokemon_v2_type.filter(({ pokemon }) => pokemon.aggregate.count > 0).map(({ id, name, pokemon, singleType }) => ({
      id: id,  
      name: toSentenceCase(name),
      totalPokemon: pokemon.aggregate.count,
      singleTypePokemon: singleType.aggregate.count,
    })),
  };
};


export const useQueryPokemonTypesAndSingleTypes = () =>
  useQuery<
    QueryPokemonTypesAndSingleTypesData,
    unknown,
    QueryPokemonTypesAndSingleTypesData,
    QueryPokemonTypesAndSingleTypesKey
  >(['pokemon-types'], fetchPokemonTypesAndSingleTypes);
