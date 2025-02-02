import { useQueryPokemon } from '@/api/queries/pokemon';
import PokemonDetailMovesTable from '@/features/pokemon-detail/components/pokemon-detail-moves-table';

import Card from './card';
import { useQueryVersionGroupList } from '@/api/queries/pokemon-versiongroup';
import { SetStateAction, useState } from 'react';

type Props = {
  pokemonName: string;
};

export default function MovesSection({ pokemonName }: Props) {
  const pokemon = useQueryPokemon(pokemonName).data;
  const { data, isLoading, error } = useQueryVersionGroupList();
 
 
  const [selectedVersionGroup, setSelectedVersionGroup] = useState('');


  const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedVersionGroup(event.target.value);
 
  };

  if (!pokemon) {
    return (
      <Card heading="Moves">
        <div className="shimmer mt-3 h-3 w-24" />
        <div className="shimmer -mt-3 ml-auto h-3 w-12" />
        <div className="shimmer mt-3.5 h-3 w-20" />
        <div className="shimmer -mt-3 ml-auto h-3 w-12" />
        <div className="shimmer mt-3.5 h-3 w-28" />
        <div className="shimmer -mt-3 ml-auto h-3 w-12" />
        <div className="shimmer mt-3.5 h-3 w-16" />
        <div className="shimmer -mt-3 ml-auto h-3 w-12" />
        <div className="shimmer mt-3.5 h-3 w-20" />
        <div className="shimmer -mt-3 mb-5 ml-auto h-3 w-12" />
      </Card>
    );
  }

  return (
    <Card heading="Moves" className="flex-grow">
      
          {isLoading && <p>Loading version groups...</p>}
          {data && (
            <div className='bg-white  dark:bg-dark-card'>
            <select value={selectedVersionGroup} onChange={handleSelectChange} className='bg-white  dark:bg-dark-card my-3 p-2 border w-full focus:outline-none rounded-md shadow-sm'>
              <option value="" disabled>Select a version group</option>
              {data.groups.map((group) => (
                <option key={group.name} value={group.name} className=' capitalize font-semibold'>
                  {group.name.replace("-"," / ")}
                </option>
              ))}
            </select>
            </div>
          )}
        
      <PokemonDetailMovesTable pokemon={pokemon} versionName={selectedVersionGroup}/>
    </Card>
  );
}
