import { QueryPokemonData } from '@/api/queries/pokemon';
import { useQueryPokemonMovesByVersion } from '@/api/queries/pokemon-moves';
import { TYPE } from '@/constants/pokemon';
import { snakeCaseToTitleCase } from '@/utils/string';
import { FaFileExcel } from 'react-icons/fa';

type Props = {
  pokemon: QueryPokemonData;
  versionName: string;
};

export default function PokemonDetailMovesTable({ pokemon, versionName }: Props) {
  const { data: pokemonMovesData, isLoading, isError } = useQueryPokemonMovesByVersion(pokemon.name, versionName);


  if (isLoading) return <div>Loading...</div>;
 
  if (isError) return <div>Error fetching moves!</div>;

  return (
    <div className="relative max-h-[26rem] overflow-y-auto">
    { pokemonMovesData?.moves.length>0? <table className="w-full border-separate border-spacing-0 border-l text-sm">
       {pokemonMovesData?.moves.length>0&& <thead className="sticky top-0 bg-white text-left dark:bg-dark-card">
          <tr className="[&_>_:nth-child(n_+_3)]:text-center">
            <th className="border-t border-b-2 border-r px-2 py-1.5">#</th>
            <th className="border-t border-b-2 border-r px-2 py-1.5">Name</th>
            <th className="border-t border-b-2 border-r px-2 py-1.5">Type</th>
            <th className="border-t border-b-2 border-r px-2 py-1.5">Cat.</th>
            <th className="border-t border-b-2 border-r px-2 py-1.5">Power</th>
            <th className="border-t border-b-2 border-r px-2 py-1.5">Acc.</th>
            <th className="border-t border-b-2 border-r px-2 py-1.5">PP</th>
          </tr>
        </thead>}
        <tbody>
          {pokemonMovesData?.moves.map((move,i:number) => {
    
            return (
              <tr
                key={i}
                className="hover:bg-slate-50 dark:hover:bg-slate-700 [&_>_:nth-child(n_+_3)]:text-center"
              >
                <td className="whitespace-nowrap border-b border-r px-2 py-1">
                  {move.learnMethod}
                </td>
                <td className="whitespace-nowrap border-b border-r px-2 py-1">
                  {snakeCaseToTitleCase(move.name)}
                </td>
                <td className="flex items-center gap-1.5 border-b border-r px-2 py-1 capitalize">
                  <div className={`h-2.5 w-2.5 rounded-full bg-elm-${move.type}`} />
                  {move.type}
                </td>
                <td
                  className="whitespace-nowrap border-b border-r px-2 py-1"
                  title={move.category}
                >
                  {{
                    physical: '💥🤛',
                    status: '🔰',
                    special: '🌀',
                  }[move.category] || '–'}
                </td>
                <td className="border-b border-r px-2 py-1">{move.power || '–'}</td>
                <td className="border-b border-r px-2 py-1">
                  {move.accuracy ? `${move.accuracy}%` : '–'}
                </td>
                <td className="border-b border-r px-2 py-1">{move.pp || '–'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>:<div className=' py-4 min-h-[100px] flex justify-center items-center'>
        <div className=' text-center'>
<div className=' flex justify-center'>

      <FaFileExcel  className=' text-5xl text-[#64748B]'/>
</div>
<p>No pokemon move data found</p>
<span className=' text-sm'>Try choosing another Pokémon game.</span>
        </div>
      </div>}
    </div>
  );
}
