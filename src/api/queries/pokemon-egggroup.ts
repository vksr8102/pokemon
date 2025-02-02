import { useQuery } from '@tanstack/react-query';
import fetcher from '../fetcher';

const POKEMON_EGG_GROUP = /* GraphQL */ `
query samplePokeAPIquery {
  pokemon_v2_egggroupname(where: {language_id: {_eq: 9}}, order_by: {name: asc}) {
    name
    id
    egg_group_id
  }
}
`;

type FetchPokemonEgggroup = {
  pokemon_v2_egggroupname: {
    id: number;
    name: string;
    egg_group_id: number;
  }[];
};

export type QueryPokemonEgggroupKey = ['pokemon-egggroup'];
export type QueryPokemonEgggroupData = {
  types: {
    id: number;
    name: string;
    egg_group_id:number;
  }[];
};

export const fetchPokemonEgggroup = async (): Promise<QueryPokemonEgggroupData> => {
  const res = await fetcher<FetchPokemonEgggroup>(POKEMON_EGG_GROUP);
  
  return {
    types: res.pokemon_v2_egggroupname
  };
};

export const useQueryPokemonEgggroup = () =>
  useQuery<
    QueryPokemonEgggroupData,
    unknown,
    QueryPokemonEgggroupData,
    QueryPokemonEgggroupKey
  >(['pokemon-egggroup'], fetchPokemonEgggroup);
