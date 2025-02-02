import React from 'react';
import PokemonDetailCard from './pokemon-detail-card';
import useCurrentPokemon from '../hooks/use-current-pokemon';
import { hexToRgba } from '@/components/commons/hextToRgba';
import { TYPE_COLOR } from '@/constants/pokemon';
import PokemonTypeImage from '@/components/commons/pockemon-type-image';
import { useRouter } from 'next/router';

interface DamageRelations {
  [key: string]: number[]; 
}

const PokemonDamageTypes: React.FC = () => {
  const { pokemon } = useCurrentPokemon();
  const types = pokemon?.pokemon_v2_pokemontypes || [];
const router = useRouter()
  const damageRelations: DamageRelations = {};
  const handleTypeClick = (name: string) => {
    router.push(`/type/${name}?source=list`); 
  };
  // Accumulate damage factors by type
  types.forEach((typeData) => {
    const typeEfficacies = typeData.pokemon_v2_type?.pokemonV2TypeefficaciesByTargetTypeId || [];

    typeEfficacies.forEach((efficacy) => {
      const damageFactor = efficacy.damage_factor;
      const damageType = efficacy.pokemon_v2_type?.name;

      if (damageType) {
        if (!damageRelations[damageType]) {
          damageRelations[damageType] = [];
        }
        damageRelations[damageType].push(damageFactor);
      }
    });
  });

  // Calculate the average (non-rounded) damage factor for each type
  const averagedDamageRelations: { type: string, avgDamage: number, roundedDamage: number }[] = Object.keys(damageRelations).map(type => {
    const total = damageRelations[type].reduce((acc, factor) => acc + factor, 0);
    const avgDamage = total / damageRelations[type].length; 
    const roundedDamage = Math.round(avgDamage);
    return { type, avgDamage, roundedDamage };
  });

 
  const damageGroups: { [key: string]: { type: string, avgDamage: number, roundedDamage: number }[] } = {
    '4x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage >= 350), 
    '2x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage >= 150 && avgDamage < 350), 
    '1x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage > 75 && avgDamage < 150),
    '0.5x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage > 50 && avgDamage <= 75), 
    '0.25x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage > 0 && avgDamage <= 50), 
    'immune': averagedDamageRelations.filter(({ avgDamage }) => avgDamage === 0),
  };

  const renderDamageGroup = (label: string, types: { type: string, avgDamage: number, roundedDamage: number }[]) => {
    if (types.length === 0) return null;

    const isDangerZone = label.includes('Takes 4×') || label.includes('Takes 2×');
    const isGreenZone = label.includes('Takes ½×') || label.includes('Takes ¼×') || label.includes('Takes no');

    return (
      <div
        className='px-4 my-4'
        style={{
          backgroundColor: isDangerZone
            ? hexToRgba("#ff4c4c", 0.1)
            : isGreenZone
            ? hexToRgba("#008000", 0.1)
            : undefined,
          borderLeft: isDangerZone ? "3px solid red" : isGreenZone ? "3px solid green" : undefined,
        }}
      >
        <h4>{label} damage from</h4>
        <div className="flex flex-wrap gap-2 py-4">
          {types.map(({ type, roundedDamage }, index) => (
            <p
              key={index}
              style={{
                backgroundColor: hexToRgba(TYPE_COLOR[type.toLowerCase()], 0.2),
                border: `1px solid ${hexToRgba(TYPE_COLOR[type.toLowerCase()], 1)}`,
              }}
              onClick={()=>handleTypeClick(type)}
              className='text-center py-0.5 px-3 cursor-pointer text-sm max-sm:text-xs rounded-full capitalize'
            >
              {type} 
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <PokemonDetailCard heading="Types">
        <div>
          <div className='flex flex-wrap gap-2'>
            {types.map((type) => {
              const typeName = type.pokemon_v2_type?.name?.toLowerCase();
              if (!typeName || !TYPE_COLOR[typeName]) return null;

              return (
                <p
                  key={type.id}
                  style={{
                    backgroundColor: hexToRgba(TYPE_COLOR[typeName], 0.2),
                    border: `1px solid ${hexToRgba(TYPE_COLOR[typeName], 1)}`,
                  }}
                  onClick={()=>handleTypeClick(typeName)}
                  className='text-center cursor-pointer rounded-full px-3 max-sm:text-xs flex items-center gap-2 capitalize'
                >
                 <PokemonTypeImage
                    pockemonType={typeName}
                    alt={typeName}
                    size={15}
                    className={` `}
                  /> 
                  <span>
                    {typeName}
                    </span> 
                </p>
              );
            })}
          </div>

          {/* Render the damage relations */}
          <div className="space-y-4">
            {renderDamageGroup('Takes 4×', damageGroups['4x'])}
            {renderDamageGroup('Takes 2×', damageGroups['2x'])}
            {renderDamageGroup('Takes 1×', damageGroups['1x'])}
            {renderDamageGroup('Takes ½×', damageGroups['0.5x'])}
            {renderDamageGroup('Takes ¼×', damageGroups['0.25x'])}
            {renderDamageGroup('Takes no', damageGroups['immune'])}
          </div>
        </div>
      </PokemonDetailCard>
    </div>
  );
};

export default PokemonDamageTypes;
