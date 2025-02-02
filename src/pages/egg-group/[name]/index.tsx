
import clsx from 'clsx';
import { useRouter } from 'next/router';
import PokemonEggCard from '@/features/pokemon-list/components/pokemon-egg-card';
import { useQueryEggGroup } from '../../../api/queries/pokemon-name-using-egggroupName';
import PokemonCardsShimmer from '@/features/pokemon-list/components/pokemon-cards-shimmer';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { fetchPokemonEgggroup } from "../../../api/queries/pokemon-egggroup"
import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import EggTypeSeo from '@/features/pokemon-detail/components/egg-group-seo';




export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const { name, id } = params as { name: string; id?: string };

  const typesData = await fetchPokemonEgggroup();
  const validTypes = typesData.types.map(({ name }) => name);

  if (!validTypes.includes(name)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      name,
      id: id || '', 
    },
    revalidate: 10,
  };
};


export const getStaticPaths: GetStaticPaths = async () => {
  const typesData = await fetchPokemonEgggroup();

  const paths = typesData.types.map(({ name, egg_group_id }) => ({
    params: {
      name,
      id: egg_group_id.toString(), 
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};




export default function PokemonListPage() {
  const { query, isReady } = useRouter();
  const groupId = query.id as unknown as number;
  const groupName = query.name as string;


  useEffect(() => {
    if (!isReady) {
      return; 
    }
   
  }, [isReady, query]);


 
  const { data, isFetching, isPreviousData, error } = useQueryEggGroup(groupId);

  if (isFetching) {
    return (
      <div>
<Link href="/egg-group">
        <span className='flex items-center text-neutral-400 gap-1 hover:underline'>
          <BsArrowLeft /> Back to egg group list
        </span>
      </Link>
      <h1 className='text-2xl my-6 font-bold capitalize'>{groupName}</h1>
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
      <PokemonCardsShimmer />
    </div>
      </div>)
  }

  

  

const pageTitle = groupName
? `Pokémon Egg Group: ${groupName} - Learn More About Egg Group Details`
: "Pokémon Egg Group - Learn More";
const pageDescription = groupName
? `Discover the Pokémon Egg Group ${groupName}. Learn about its traits, associated Pokémon, and other details. Explore group ${groupName} with id ${groupId}.`
: "Discover Pokémon Egg Groups. Learn about traits, associated Pokémon, and more.";
  return (
    <>
     <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <EggTypeSeo/>
    
      <Link href="/egg-group">
        <span className='flex items-center text-neutral-400 gap-1 hover:underline'>
          <BsArrowLeft /> Back to egg group list
        </span>
      </Link>
      <h1 className='text-2xl my-6 font-bold capitalize'>{groupName}</h1>
      <div className={`${clsx('pokemon-card-container', isPreviousData && 'opacity-60')}`}>
        {data && data
          .filter((pokemon) => !/gmax|mega/i.test(pokemon.name))
          .map((pokemon) => (
            <div key={pokemon.id}>
              <PokemonEggCard {...pokemon} />
            </div>
          ))}
      </div>
    </>
  );
}
