
import Link from 'next/link';
import useCurrentPokemon from '../hooks/use-current-pokemon';
import PokemonDetailCard from './pokemon-detail-card';
import { useQueryPokemonEggGroups } from '@/api/queries/pokemon';

export default function PokemonBreeding() {
  const { pokemon } = useCurrentPokemon();
  const { data } = useQueryPokemonEggGroups(pokemon.name);
 


  return (
    <div>
      <PokemonDetailCard heading="Breeding">
       <div >
        <div className=' flex justify-between'>
          <h2 className=' font-semibold'> Egg Groups:</h2>
          <ul className=' flex  gap-2 capitalize dark:text-[#A09456] text-blue-500'>
            {data?.eggGroups.map((group, index) => (
              <Link key={index}  href={`/egg-group/${group}`}  className=' cursor-pointer underline'>{group}</Link>
              ))}
          </ul>
          
        </div>
        <div className=' flex justify-between py-2'>
          <h2 className=' font-semibold'> Egg Cycles:</h2>
          {data?.hatchCounter} cycles
        </div>
       </div>
   
      </PokemonDetailCard>
    </div>
  );
}
