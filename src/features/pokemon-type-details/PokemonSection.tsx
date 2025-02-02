import PokemonImage from '@/components/commons/pokemon-image';
import { snakeCaseToTitleCase } from '@/utils/string';
import Link from 'next/link';
import React, { FC } from 'react'

interface Props {

  pokemon: {
    id: number;
    name: string;
    generation: string;
  };
}
const PokemonSection:FC<Props> = ({pokemon}) => {
  const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(pokemon.name);
  const href = hasSpecialCharacter
    ? `/pokemon/${pokemon.name.split('-')[0]}/${pokemon.name}`
    : `/pokemon/${pokemon.name}`;
  return (
    <Link href={href} className={`dark:bg-dark-base relative p-4 group border rounded-md flex flex-col items-center hover:border-black  dark:hover:border-gray-300 transition duration-200`}>

      <PokemonImage
        idPokemon={pokemon.id}
        alt={pokemon.name}
        size={40}
        className="group-hover:scale-125"
        priority={pokemon.id < 7}
      />
      <div className="text-center capitalize text-base my-2  ">
        {snakeCaseToTitleCase(pokemon.name)}
      </div>
      <div className=' absolute top-0  right-0 px-2 rounded-l-md rounded-t-none dark:bg-dark-card'>
{pokemon.generation.replace("generation-", "")}
      </div>
    </Link>
  )
}

export default PokemonSection;
