import { DehydratedState } from '@tanstack/react-query';
import clsx from 'clsx';
import { NextSeo } from 'next-seo';
import { useState } from 'react';

import {  QueryPokemonFilter, useInfQueryPokemonsSpecies } from '@/api/queries/pockemon-species';
import PokemonSpicesCard from '@/features/pokemon-list/components/pokemon-spices-card ';



const INITIAL_FILTER: QueryPokemonFilter = { name: "gmax" }; 

const SEO_DESCRIPTION ="Explore Pokémon Gigantamax Forms! Find detailed information on their exclusive abilities, stats, and moves."

export default function PokemonListPage() {
  const [filter, setFilter] = useState<QueryPokemonFilter>(INITIAL_FILTER);
  const { data, isFetching, isPreviousData } = useInfQueryPokemonsSpecies(filter);
  
 
  

  // Flatten the data from pages
  const pokemons = data?.pages.flat() || [];


  return (
    <>
      <NextSeo
        description={SEO_DESCRIPTION}
        title="Gigantamax Forms"
        openGraph={{
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/pokemon-awesome-thumbnail-1200x630.jpg`,
              width: 1200,
              height: 630,
              alt: 'Pokemon Awesome',
              type: 'image/jpeg',
            },
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/pokemon-awesome-thumbnail.jpg`,
              width: 2560,
              height: 1280,
              alt: 'Pokemon Awesome',
              type: 'image/jpeg',
            },
          ],
        }}
      />

      {/* Render Pokémon cards */}
        <h1 className=' text-4xl my-6 font-bold'>Gigantamax Forms</h1>
      <div className={clsx('pokemon-card-container', isPreviousData && 'opacity-60')}>
        {pokemons.length > 0 ? (
          pokemons.map((pokemon) => (
            <PokemonSpicesCard key={pokemon.id} {...pokemon} />
            // <></>
          ))
        ) : (
          !isFetching && <p>No results found.</p>
        )}
        
   
      </div>
      
    
    </>
  );
}
