import { QueryMergedPokemonData } from '@/api/queries/pokemon-diffence-and-offence';
import { hexToRgba } from '@/components/commons/hextToRgba';
import { TYPE_COLOR } from '@/constants/pokemon';
import { pokemonTypes } from '@/types/pokemon';
import React, { FC } from 'react';
import { ShimmerOffenceSection } from './ShimmerOffenceSection';

interface Props {
  types: pokemonTypes[];
}

const PokemonOffenceSection: FC<Props> = ({ types }) => {

  const renderDamageGroup = (label: string, type: { type: string; roundedDamage: number }[]) => {
    const isDangerZone = label.includes('0x');
    const isGreenZone = label.includes('2x');

    return (
      <div
        className='my-4 border max-sm:flex items-center '
        style={{
          backgroundColor: isDangerZone
            ? hexToRgba("#ff4c4c", 0.1)
            : isGreenZone
            ? hexToRgba("#008000", 0.1)
            : undefined,
        }}
        
      >
        <div className=' sm:border-b max-sm:border-r max-sm:h-full max-sm:flex max-sm:items-center '>

        <h4 className='whitespace-nowrap text-center py-2 px-2'>{label}</h4>
        </div>
        <div className="inline-flex flex-wrap px-4 gap-2 py-4">
          {type.map(({ type, roundedDamage }, index) => (
            <p
              key={index}
              style={{
                backgroundColor: hexToRgba(TYPE_COLOR[type.toLowerCase()], 0.2),
                border: `1px solid ${hexToRgba(TYPE_COLOR[type.toLowerCase()], 1)}`,
              }}
              className='text-center py-0.5 px-3 text-xs rounded-full capitalize'
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
     {types.length >0 ?
      <div className="mb-6 rounded-md bg-white p-3.5 shadow-md dark:bg-dark-card md:p-5">
        <h2 className="pb-2.5 text-xl font-bold">Offense</h2>
        <div>
          {types.map(({ name, outgoingDamage }) => (
            <div key={name}>
              <h3 className="pb-2.5 text-lg font-bold">{name}</h3>
              <div className='grid grid-cols-4 max-sm:grid-cols-1'>
                {renderDamageGroup(`2x`, outgoingDamage.filter(item => item.damage_factor === 200).map(item => ({
                  type: item.pokemon_v2_type.name,
                  roundedDamage: item.damage_factor,
                })))}
                {renderDamageGroup(`1x`, outgoingDamage.filter(item => item.damage_factor === 100).map(item => ({
                  type: item.pokemon_v2_type.name,
                  roundedDamage: item.damage_factor,
                })))}
                {renderDamageGroup(`1⁄2×`, outgoingDamage.filter(item => item.damage_factor === 50).map(item => ({
                  type: item.pokemon_v2_type.name,
                  roundedDamage: item.damage_factor,
                })))}
                {renderDamageGroup(`0x`, outgoingDamage.filter(item => item.damage_factor === 0).map(item => ({
                  type: item.pokemon_v2_type.name,
                  roundedDamage: item.damage_factor,
                })))}
              </div>
            </div>
          ))}
        </div>
      </div>:<ShimmerOffenceSection/>}
    </div>
  );
};

export default PokemonOffenceSection;
