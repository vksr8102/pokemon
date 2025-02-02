import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { hexToRgba } from '@/components/commons/hextToRgba';
import { TYPE_COLOR } from '@/constants/pokemon';
import PokemonTypeImage from '@/components/commons/pockemon-type-image';
import { useQueryMergedPokemon } from '@/api/queries/pokemon-diffence-and-offence';
import PokemonDetailCard from '../pokemon-detail/components/pokemon-detail-card';
import PokemonOffenceSection from './pokemonOffenceSection';
import PokemonSection from './PokemonSection';
import Link from 'next/link';
import { TbArrowLeft } from 'react-icons/tb';
import { useQueryPokemonTypesAndSingleTypes } from '@/api/queries/pokemon-types';
import { PiCaretUpDown } from "react-icons/pi";
import { BsPlus } from 'react-icons/bs';
import { ShimmerOffenceSection } from './ShimmerOffenceSection';
interface DamageRelations {
  [key: string]: number[];
}

const PokemonDamageTypes: React.FC = () => {
  const router = useRouter();
  const { type, pairType }: any = router.query;

 
  const [selectedType, setSelectedType] = useState(type || 'None');
  const [selectedPairType, setSelectedPairType] = useState(pairType || 'None');

  const { data: pokemon, isLoading, error } = useQueryMergedPokemon([selectedType, selectedPairType].filter(t => t !== 'None'));
  const { data: typeList } = useQueryPokemonTypesAndSingleTypes();

  useEffect(() => {
    if (type) {
      setSelectedType(type);
    }
    if (pairType) {
      setSelectedPairType(pairType);
    }
  }, [type, pairType]);

  const types = pokemon?.types || [];
  const incomingDamageRelations: DamageRelations = {};

  const accumulateDamageRelations = (relations: DamageRelations, efficacyList: any[]) => {
    efficacyList.forEach(({ damage_factor, pokemon_v2_type }) => {
      const damageType = pokemon_v2_type?.name;
      if (damageType) {
        if (!relations[damageType]) {
          relations[damageType] = [];
        }
        relations[damageType].push(damage_factor);
      }
    });
  };

  types.forEach(({ incomingDamage }) => {
    accumulateDamageRelations(incomingDamageRelations, incomingDamage || []);
  });

  const calculateAveragedDamageRelations = (damageRelations: DamageRelations) => {
    return Object.keys(damageRelations).map((type) => {
      const hasZero = damageRelations[type].some((factor) => factor === 0);
      if (hasZero) {
        return { type, avgDamage: 0, roundedDamage: 0 };
      }

      const total = damageRelations[type].reduce((acc, factor) => acc + factor, 0);
      const avgDamage = total / damageRelations[type].length;

      return { type, avgDamage, roundedDamage: Math.round(avgDamage) };
    });
  };

  const averagedIncomingDamageRelations = useMemo(() => calculateAveragedDamageRelations(incomingDamageRelations), [incomingDamageRelations]);

  const damageGroups = (averagedDamageRelations: { type: string; avgDamage: number; roundedDamage: number }[]) => {
    return {
      '4x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage >= 350),
      '2x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage >= 150 && avgDamage < 350),
      '1x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage > 75 && avgDamage < 150),
      '0.5x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage >= 50 && avgDamage <= 75),
      '0.25x': averagedDamageRelations.filter(({ avgDamage }) => avgDamage >= 25 && avgDamage < 50),
      immune: averagedDamageRelations.filter(({ avgDamage }) => avgDamage >= 0 && avgDamage < 25),
    };
  };

  const incomingDamageGroups = useMemo(() => damageGroups(averagedIncomingDamageRelations), [averagedIncomingDamageRelations]);

  const renderDamageGroup = (label: string, types: { type: string; roundedDamage: number }[]) => {
    const isDangerZone = label.includes('4×');
    const isGreenZone = label.includes('0x');

    return (
      <div
        className='my-4 border max-sm:flex items-center '
        style={{
          backgroundColor: isDangerZone
            ? hexToRgba('#ff4c4c', 0.1)
            : isGreenZone
            ? hexToRgba('#008000', 0.1)
            : undefined,
        }}
      >
        <div className=' sm:border-b max-sm:border-r max-sm:h-full max-sm:flex max-sm:items-center '>

<h4 className='whitespace-nowrap text-center py-2 px-2'>{label}</h4>
</div>
       
        <div className=' inline-flex flex-wrap px-4 gap-2 py-4 '>
          {types.map(({ type }, index) => (
            <p
              key={index}
              style={{
                backgroundColor: hexToRgba(TYPE_COLOR[type.toLowerCase()], 0.2),
                border: `1px solid ${hexToRgba(TYPE_COLOR[type.toLowerCase()], 1)}`,
              }}
              className='text-center py-0.5 px-3 text-xs  rounded-full capitalize'
            >
              {type}
            </p>
          ))}
        </div>
      </div>
    );
  };

// Handle type change
const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selected = e.target.value;

 
  if (selected === selectedPairType) {
    return;
  }

 
  setSelectedType(selected);


  const newQuery:any = { ...router.query, type: selected !== 'None' ? selected : undefined };

  if (!newQuery.type && !newQuery.pairType) {
  
    delete newQuery.pairType;
  }

  router.push({
    pathname: router.pathname,
    query: newQuery,
  });
};


const handlePairTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selected = e.target.value;

 
  if (selected === selectedType) {
    return;
  }


  setSelectedPairType(selected);

  const newQuery = { ...router.query, pairType: selected !== 'None' ? selected : undefined };

  if (!newQuery.pairType) {

    delete newQuery.pairType;
  }

  router.push({
    pathname: router.pathname,
    query: newQuery,
  });
};

  return (
    <div>
      <div>
        <div className=''>
          <div className='flex flex-wrap justify-between items-center mb-4 gap-2'>
            <div>

            <Link href={'/types'} className=' flex gap-1 items-center my-2 text-sm opacity-75'>
              <TbArrowLeft /> Back to type list
            </Link>
            <div className='flex gap-1 '>
<h3
className='text-2xl capitalize flex gap-2'>
{type&& <span>
{selectedType}
 </span>}
{selectedPairType !=="None"&& <span>
  - {selectedPairType}
 </span>}
 Type

</h3>
            </div>
            </div>
            <div className='flex gap-2'>
  <div className='relative'>
    <div onClick={() => document.getElementById('typeSelect')?.click()} className="cursor-pointer flex items-center gap-2">
      {selectedType && (
        <div className='flex gap-2 items-center font-bold border rounded-full dark:bg-dark-card p-3'>
          <div className={`p-2 rounded-full bg-elm-${selectedType}`}>
            <PokemonTypeImage pockemonType={selectedType} alt={selectedType} size={20} />
          </div>
          <PiCaretUpDown className='text-2xl' />
        </div>
      )}
    </div>

    <select
      id='typeSelect'
      value={selectedType}
      onChange={handleTypeChange}
      className='absolute top-[50%] bottom-0 left-0 opacity-0 cursor-pointer'
    >
      {typeList?.types.map(({ id, name }) => (
        <option
          key={id}
          value={name.toLowerCase()}
          className='dark:bg-dark-base pl-4  flex ' 
        >
          {selectedType === name.toLowerCase() && (
            <span className='text-green-500'> ✔</span>
          )}
          {name}
        </option>
      ))}
    </select>
  </div>

  <div className='relative'>
    <div onClick={() => document.getElementById('pairTypeSelect')?.click()} className="cursor-pointer flex items-center gap-2">
      {selectedPairType !== "None" ? (
        <div className='flex gap-2 items-center font-bold border rounded-full dark:bg-dark-card p-3'>
          <div className={`p-2 rounded-full bg-elm-${selectedPairType}`}>
            <PokemonTypeImage pockemonType={selectedPairType} alt={selectedPairType} size={20} />
          </div>
          <PiCaretUpDown className='text-2xl' />
        </div>
      ) : (
        <div className='p-2 border rounded-full'>
          <div className='flex gap-2 items-center font-extrabold rounded-full bg-[#DAE2EB] dark:bg-dark-card p-1'>
            <BsPlus className='text-3xl' />
          </div>
        </div>
      )}
    </div>

    <select
      id='pairTypeSelect'
      value={selectedPairType}
      onChange={handlePairTypeChange}
      className='absolute top-[50%] bottom-0 opacity-0 cursor-pointer'
    >
      <option value='None' className='dark:bg-dark-base px-4 border-b'>
        None
      </option>
      {typeList?.types.map(({ id, name }) => (
        <option
          key={id}
          value={name.toLowerCase()}
          className='dark:bg-dark-base px-4 hover:bg-dark-card' 
        >
          {selectedPairType === name.toLowerCase() && (
            <span className='text-green-500'> ✔</span>
          )}
          {name}
        </option>
      ))}
    </select>
  </div>
</div>



          </div>

          {types.length>0? <div className='mb-6 rounded-md bg-white p-3.5 shadow-md dark:bg-dark-card md:p-5'>
            <h2 className='pb-2.5 text-xl font-bold'>Defence</h2>
           <div className='flex max-sm:flex-col   items-stretch'>
              {renderDamageGroup(' 0x', incomingDamageGroups['immune'])}
              {renderDamageGroup(' ¼×', incomingDamageGroups['0.25x'])}
              {renderDamageGroup(' ½×', incomingDamageGroups['0.5x'])}
              {renderDamageGroup(' 1×', incomingDamageGroups['1x'])}
              {renderDamageGroup(' 2×', incomingDamageGroups['2x'])}
              {renderDamageGroup('4×', incomingDamageGroups['4x'])}
            </div>
          </div>:<ShimmerOffenceSection/>}

          <PokemonOffenceSection types={types} />

         {pokemon?.pokemon.length && <div className='mb-6 rounded-md bg-white   p-3.5 shadow-md dark:bg-dark-card md:p-5'>
            <h2 className='pb-2.5 text-xl font-bold'>Pokemons({pokemon?.totalCount})</h2>
            <div className='grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4'>
              {pokemon?.pokemon.map((item: { id: number; name: string; generation: string; }, id: React.Key | null | undefined) => (
                <PokemonSection key={id} pokemon={item} />
              ))}
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default PokemonDamageTypes;
