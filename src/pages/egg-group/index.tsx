import Link from 'next/link';
import Head from 'next/head';
import React from 'react';

import { useQueryPokemonEgggroup } from '@/api/queries/pokemon-egggroup';

interface PokemonType {
  id: number;
  name: string;
  egg_group_id: number;
}

const Index: React.FC = () => {
  const { data, isLoading, isError, error } = useQueryPokemonEgggroup();

  if (isLoading) {
    return (
      <div>
        <Head>
          <title>Egg Groups</title>
          <meta name="description" content="Pokémon Egg Groups to learn about breeding, species compatibility, and unique traits in the Pokémon world" />
        </Head>
        <h1 className="pb-6 text-3xl font-bold">Egg Groups</h1>
        <div className="my-6 border-b md:my-8 md:max-w-sm">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="block border-t border-b py-3 capitalize hover:bg-[#F1F5F9] hover:font-semibold hover:dark:bg-dark-light animate-pulse"
            >
              <div className="w-1/2 h-6 bg-gray-300 dark:bg-dark-card rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.error('Error:', error);
    return (
      <>
        <Head>
          <title>Error - Pokémon Pokedex</title>
          <meta name="description" content="Error fetching Pokémon Egg Groups." />
        </Head>
        <div>Error fetching data. Please try again later.</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Egg Groups - Pokémon Pokedex</title>
        <meta
          name="description"
          content="Explore the Pokémon Egg Groups and learn more about how Pokémon breed and interact in the Pokémon world."
        />
        <meta property="og:title" content="Egg Groups - Pokémon Pokedex" />
        <meta
          property="og:description"
          content="Explore the Pokémon Egg Groups and learn more about how Pokémon breed and interact in the Pokémon world."
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://default-image-url.com'}/images/pokemon-awesome-thumbnail-1200x630.jpg`}
        />
        <meta property="og:image:alt" content="Pokemon Awesome" />
      </Head>
      <div>
        <h1 className="pb-10 text-3xl font-bold">Egg Groups</h1>
        {data?.types && data.types.length > 0 ? (
          <ul className="my-6 border-b md:my-8 md:max-w-sm">
            {data.types.map(({ id, name, egg_group_id }: PokemonType) => (
              <Link
                className="block border-t border-b py-3 capitalize hover:bg-[#F1F5F9] hover:font-semibold hover:dark:bg-dark-light"
                key={id}
                href={`/egg-group/${name}?id=${egg_group_id.toString()}`}
              >
                {name}
              </Link>
            ))}
          </ul>
        ) : (
          <div>No egg groups found.</div>
        )}
      </div>
    </>
  );
};

export default Index;
