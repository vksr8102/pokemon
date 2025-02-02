import { useQueryVersionGroupList } from '@/api/queries/pokemon-versiongroup';
import useCurrentPokemon from '../hooks/use-current-pokemon';
import PokemonDetailCard from './pokemon-detail-card';
import PokemonDetailMovesTable from './pokemon-detail-moves-table';
import { SetStateAction, useState } from 'react';
import { useQueryPokemonMovesByVersion } from '@/api/queries/pokemon-moves';
import Card from '@/features/compare-pokemons/components/card';

export default function PokemonDetailMoves() {
  const { pokemon } = useCurrentPokemon();
  const { data, isLoading, error } = useQueryVersionGroupList();
 
 
  const [selectedVersionGroup, setSelectedVersionGroup] = useState('');


  const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedVersionGroup(event.target.value);
 
  };

  return (
    <div>
      <PokemonDetailCard heading="Moves">
        <div className='bg-white  dark:bg-dark-card' >
          {isLoading && <p>Loading version groups...</p>}
          {data && (
            <select value={selectedVersionGroup} onChange={handleSelectChange} className=' my-3 p-2 border w-full focus:outline-none rounded-md  bg-white shadow-md dark:bg-dark-card'>
              <option value="" disabled>Select a version group</option>
              {data.groups.map((group) => (
                <option key={group.name} value={group.name} className=' bg-white shadow-md dark:bg-dark-card capitalize font-semibold'>
                  {group.name.replace("-"," / ")}
                </option>
              ))}
            </select>
          )}
        </div>
        <PokemonDetailMovesTable pokemon={pokemon} versionName={selectedVersionGroup}/>
      </PokemonDetailCard>
    </div>
  );
}
