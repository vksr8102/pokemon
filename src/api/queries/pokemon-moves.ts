import { useQuery } from '@tanstack/react-query';
import fetcher from '../fetcher';

// GraphQL Queries
const GET_POKEMON_MOVES = /* GraphQL */ `
  query GetPokemonMoves($pokemonName: String!) {
    pokemon_v2_pokemon(where: { name: { _eq: $pokemonName } }) {
      pokemon_v2_pokemonmoves {
        level
        id
        pokemon_v2_move {
          name
          power
          accuracy
          pp
          pokemon_v2_type {
            name
          }
          move_category: pokemon_v2_movedamageclass {
            name
          }
        }
        pokemon_v2_movelearnmethod {
          name
        }
      }
    }
  }
`;

const GET_POKEMON_MOVES_BY_VERSION = /* GraphQL */ `
  query GetPokemonMovesByVersion($pokemonName: String!, $versionGroup: String!) {
    pokemon_v2_pokemon(where: { name: { _eq: $pokemonName } }) {
      pokemon_v2_pokemonmoves(where: { pokemon_v2_versiongroup: { name: { _eq: $versionGroup } } }) {
        level
        id
        pokemon_v2_move {
          name
          power
          accuracy
          pp
          pokemon_v2_type {
            name
          }
          move_category: pokemon_v2_movedamageclass {
            name
          }
        }
        pokemon_v2_movelearnmethod {
          name
        }
      }
    }
  }
`;

// Type Definitions
type FetchPokemonMovesResponse = {
  pokemon_v2_pokemon: {
    pokemon_v2_pokemonmoves: {
      level: number | null;
      id:number
      pokemon_v2_move: {
        name: string;
        power: number | null;
        accuracy: number | null;
        pp: number | null;
        pokemon_v2_type: {
          name: string;
        };
        move_category: {
          name: string;
        };
      };
      pokemon_v2_movelearnmethod: {
        name: string;
      };
    }[];
  }[];
};

export type QueryPokemonMovesKey = ['pokemon-moves', string | null | undefined, string | null | undefined];

export type QueryPokemonMovesData = {
  moves: {
    learnMethod: string;
    level: number | null;
    name: string;
    power: number | null;
    accuracy: number | null;
    pp: number | null;
    type: string;
    category: string;
  }[];
};

// Helper function to format learn method
const getLearnMethodLabel = (methodName: string, level: number | null): string => {
  switch (methodName) {
    case 'level-up':
      return level !== null ? `Lv ${level}` : '';
    case 'tutor':
      return 'Tutor';
    case 'machine':
      return `TM${level ?? ''}`; 
    case 'hm':
      return `HM${level ?? ''}`; 
    default:
      return methodName;
  }
};

// Fetch Functions
export const fetchPokemonMoves = async (pokemonName: string): Promise<QueryPokemonMovesData> => {
  const res = await fetcher<FetchPokemonMovesResponse>(GET_POKEMON_MOVES, { pokemonName });

  const moves = res.pokemon_v2_pokemon.flatMap((pokemon) =>
    pokemon.pokemon_v2_pokemonmoves.map((move,i) => ({
      learnMethod: getLearnMethodLabel(move.pokemon_v2_movelearnmethod.name,move.level ===0?i:move.level),
       id:move.id,
      level: move.level,
      name: move.pokemon_v2_move.name,
      power: move.pokemon_v2_move.power,
      accuracy: move.pokemon_v2_move.accuracy,
      pp: move.pokemon_v2_move.pp,
      type: move.pokemon_v2_move.pokemon_v2_type.name,
      category: move.pokemon_v2_move.move_category.name,
    }))
  );

  return { moves };
};

export const fetchPokemonMovesByVersion = async (
  pokemonName: string,
  versionGroup: string
): Promise<QueryPokemonMovesData> => {
  const res = await fetcher<FetchPokemonMovesResponse>(GET_POKEMON_MOVES_BY_VERSION, {
    pokemonName,
    versionGroup,
  });

  const moves = res.pokemon_v2_pokemon.flatMap((pokemon) =>
    pokemon.pokemon_v2_pokemonmoves.map((move,i) => ({
      learnMethod: getLearnMethodLabel(move.pokemon_v2_movelearnmethod.name, move.level ===0?i:move.level),
      id:move.id,
      level: move.level,
      name: move.pokemon_v2_move.name,
      power: move.pokemon_v2_move.power,
      accuracy: move.pokemon_v2_move.accuracy,
      pp: move.pokemon_v2_move.pp,
      type: move.pokemon_v2_move.pokemon_v2_type.name,
      category: move.pokemon_v2_move.move_category.name,
    }))
  );

  return { moves };
};

// Custom Hook
export const useQueryPokemonMovesByVersion = (
  pokemonName: string | null | undefined,
  versionGroup: string | null | undefined
) => {
  return useQuery<QueryPokemonMovesData, unknown, QueryPokemonMovesData, QueryPokemonMovesKey>(
    ['pokemon-moves', pokemonName, versionGroup],
    () => {
      if (!pokemonName) {
        throw new Error('pokemonName is required');
      }
      return versionGroup
        ? fetchPokemonMovesByVersion(pokemonName, versionGroup)
        : fetchPokemonMoves(pokemonName);
    },
    {
      enabled: !!pokemonName, 
    }
  );
};
