import { useRouter } from 'next/router'; // Import useRouter
import React, { useState } from 'react';
import Head from 'next/head'; // Import Head for title and meta description

import { useQueryPokemonTypesAndSingleTypes } from '@/api/queries/pokemon-types';
import { hexToRgba } from '@/components/commons/hextToRgba';
import PokemonTypeImage from '@/components/commons/pockemon-type-image';
import { TYPE_COLOR } from '@/constants/pokemon';



interface PokemonType {
  id: number;
  name: string;
  singleTypePokemon: number;
  totalPokemon: number;
}

const Index: React.FC = () => {
  const [isHovered, setIsHovered] = useState({
    hover: false,
    index: 0,
  });
  const router = useRouter();

  const handleMouseEnter = (id: number) => {
    setIsHovered({
      hover: true,
      index: id,
    });
  };

  const handleMouseLeave = (id: number) => {
    setIsHovered({
      hover: false,
      index: id,
    });
  };

  const handleTypeClick = (name: string) => {
    router.push(`/type/${name}?source=list`);
  };

  const { data, isLoading, isError, error } = useQueryPokemonTypesAndSingleTypes();

  if (isLoading) {
    return (
      <div>
      
        <div className="mt-5 w-40 pb-10 text-4xl font-bold bg-gray-300 dark:bg-dark-card rounded-md"></div>
        <div className="grid gap-4 md:grid-cols-2 my-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between border-t my-2 border-b bg-transparent px-2 animate-pulse"
            >
              <div className="flex items-center gap-2 p-2 w-full">
                <div className="h-10 w-10 bg-gray-300 dark:bg-dark-card rounded-full" />
                <div className="w-1/2 h-6 bg-gray-300 dark:bg-dark-card rounded-md"></div>
              </div>

              <div className="text-xs space-y-2">
                <div className="h-4 w-20 bg-gray-300 dark:bg-dark-card rounded-md"></div>
                <div className="h-4 w-32 bg-gray-300 dark:bg-dark-card rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.error('Error:', error);
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      {/* Adding the title and meta description */}
      <Head>
        <title>Pokémon Types - Explore Different Pokémon Types</title>
        <meta name="description" content="Browse various Pokémon types, explore their characteristics, and discover the total number of Pokémon in each type." />
      </Head>
  
      <h1 className="pb-10 text-4xl font-bold">Pokémon Types</h1>
      <div className="my-4 grid gap-4 md:grid-cols-2">
        {data?.types.map(({ id, name, totalPokemon, singleTypePokemon }: PokemonType) => (
          <div
            key={id}
            className="flex w-full items-center justify-between max-sm:hover:ml-2 border-t border-b bg-transparent px-2 transition-colors duration-300 hover:bg-opacity-100"
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={() => handleMouseLeave(id)}
            onClick={() => handleTypeClick(name.toLowerCase())}
            style={{
              backgroundColor:
                isHovered.hover && isHovered.index === id
                  ? hexToRgba(TYPE_COLOR[name.toLowerCase()], 0.5)
                  : 'transparent',
            }}
          >
            <div className="flex items-center gap-2 transition-colors duration-300">
              <div className="flex w-full items-center gap-2 p-2 hover:bg-opacity-100">
                <PokemonTypeImage
                  pockemonType={name}
                  alt={name}
                  size={25}
                  className={`rounded-full p-2 bg-elm-${name.toLowerCase()}`}
                />
                <span className="block w-full cursor-pointer p-2 font-semibold">{name}</span>
              </div>
            </div>
            <div className="text-xs">
              <p>{totalPokemon} pokemons</p>
              <p>({singleTypePokemon} single-types)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
