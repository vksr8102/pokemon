import { useState } from 'react';

import { useQueryPokemonTypes } from '@/api/queries/pokemon';
import { MAX_BASE_STATS, Max_STATS, STATS_LABELS } from '@/constants/pokemon';

import useCurrentPokemon from '../hooks/use-current-pokemon';
import PokemonDetailCard from './pokemon-detail-card';

export default function PokemonDetailBaseStats() {
  const [isMinMax, setIsMinMax] = useState(false);
  const { pokemon } = useCurrentPokemon();
  const pokemonTypes = useQueryPokemonTypes(pokemon.name).data!;
  const level = 100;
  const MIN_MULTIPLIER = 0.9;
  const MAX_MULTIPLIER = 1.1;

  const calculateMinMaxStat = (baseStat: number) => {
    const minStat = Math.floor(((2 * baseStat * level) / 100 + 5) * MIN_MULTIPLIER);
    const maxStat = Math.floor(
      (((2 * baseStat + 31 + Math.floor(252 / 4)) * level) / 100 + 5) * MAX_MULTIPLIER,
    );
    return { minStat, maxStat };
  };

  const totalBaseStats = STATS_LABELS.reduce(
    (sum, label, idx) =>
      sum + (pokemon.pokemon_v2_pokemonstats[idx] as unknown as { base_stat: number }).base_stat,
    0,
  );
  const calculateMinMaxHP = (baseStat: number) => {
    const minHP = Math.floor((2 * baseStat * level) / 100 + level + 10);
    const maxHP = Math.floor(
      ((2 * baseStat + 31 + Math.floor(252 / 4)) * level) / 100 + level + 10,
    );
    return { minHP, maxHP };
  };

  return (
    <PokemonDetailCard heading="Stats">
      <div className="mb-4 flex justify-end">
        <div className=" flex rounded-md border">
          <button
            onClick={() => setIsMinMax(!isMinMax)}
            className={`rounded-l-md px-3  py-1.5 text-sm font-semibold transition-colors 
            ${!isMinMax && 'bg-gray-200  dark:bg-dark-base  '}`}
          >
            Base
          </button>
          <button
            onClick={() => setIsMinMax(!isMinMax)}
            className={`rounded-r-md px-3  py-1.5 text-sm font-semibold transition-colors 
           ${isMinMax && 'bg-gray-200  dark:bg-dark-base  '}`}
          >
            Min-Max
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {STATS_LABELS.map((label, idx) => {
          const baseStat =
            (pokemon.pokemon_v2_pokemonstats[idx] as unknown as { base_stat: number }).base_stat ||
            0;
          const { minStat, maxStat } = calculateMinMaxStat(baseStat);

          if (label === 'HP') {
            const { minHP, maxHP } = calculateMinMaxHP(baseStat);

            return (
              <div key={label} className="flex items-center">
                <div className="flex w-24 justify-end font-semibold">{label}</div>

                <div className=" relative ml-4 h-2 w-full flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-dark-base">
                  <div
                    className={`h-full  transition-all bg-elm-${pokemonTypes[0]}`}
                    style={{
                      width: isMinMax
                        ? `${(minHP / Max_STATS) * 100}%`
                        : `${(baseStat / MAX_BASE_STATS) * 100}%`,
                    }}
                  />

                  <div
                    className={`absolute h-full transition-all bg-elm-${pokemonTypes[0]} opacity-50`}
                    style={{
                      width: isMinMax
                        ? `${(maxHP / Max_STATS) * 100}%`
                        : `${(baseStat / MAX_BASE_STATS) * 100}%`,
                      top: 0,
                      left: 0,
                    }}
                  />
                </div>

                <div className={`${isMinMax ? 'ml-6  w-16' : '  w-12'}  text-right font-semibold`}>
                  {isMinMax ? `${minHP} - ${maxHP}` : baseStat}
                </div>
              </div>
            );
          }

          return (
            <div key={label} className="flex items-center">
              <div className="flex w-24 justify-end font-semibold">{label}</div>

              <div className="relative ml-4 h-2 w-full flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-dark-base">
                <div
                  className={`h-full transition-all bg-elm-${pokemonTypes[0]}`}
                  style={{
                    width: isMinMax
                      ? `${(minStat / Max_STATS) * 100}%`
                      : `${(baseStat / MAX_BASE_STATS) * 100}%`,
                  }}
                />

                <div
                  className={`absolute h-full transition-all bg-elm-${pokemonTypes[0]} opacity-50`}
                  style={{
                    width: isMinMax
                      ? `${(maxStat / Max_STATS) * 100}%`
                      : `${(baseStat / MAX_BASE_STATS) * 100}%`,
                    top: 0,
                    left: 0,
                  }}
                />
              </div>

              <div className={`${isMinMax ? 'ml-6  w-16' : '  w-12'}  text-right font-semibold`}>
                {isMinMax ? `${minStat} - ${maxStat}` : baseStat}
              </div>
            </div>
          );
        })}

        {/* Explanation */}
        {isMinMax ? (
          <div className="mt-4 bg-gray-200 py-2 text-xs text-gray-500 dark:bg-dark-base">
            <ul className="ml-5 list-disc">
              <li>
                Minimum stats are calculated with 0 EVs, IVs of 0, and (if applicable) a hindering
                nature.
              </li>
              <li>
                Maximum stats are calculated with 252 EVs, IVs of 31, and (if applicable) a helpful
                nature.
              </li>
            </ul>
          </div>
        ) : (
          <div className=" flex items-center gap-8 font-semibold justify-end">
            <div >Total:</div>
            {totalBaseStats}
          </div>
        )}
      </div>
    </PokemonDetailCard>
  );
}
