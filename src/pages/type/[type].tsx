import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import TypePageSeo from '../../features/pokemon-detail/components/type-detailed-seo';
import PokemonDamageTypes from '../../features/pokemon-type-details/PokemonDefenceTypes';
import React from 'react';
import {fetchPokemonTypesAndSingleTypes} from "../../api/queries/pokemon-types"
import Head from 'next/head';
type Props = {
  type: string;
};


export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const { types } = await fetchPokemonTypesAndSingleTypes(); 
    
    const paths = types.map(({ name }) => ({
      params: { type: name.toLowerCase() },
    }));

    return {
      paths,
      fallback: 'blocking', 
    };
  } catch (error) {
    console.error('Error fetching Pokémon types:', error);
    return {
      paths: [],
      fallback: 'blocking', 
    };
  }
};

// Fetch static props based on type (Check for missing types or invalid routes)
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { type } = params!;


  if (!type || typeof type !== 'string') {
    return {
      notFound: true,
    };
  }

 
  const { types } = await fetchPokemonTypesAndSingleTypes();
  const validTypes = types.map(({ name }) => name.toLowerCase()); 
  
  if (!validTypes.includes(type.toLowerCase())) {
    return {
      notFound: true, 
    };
  }

 
  return {
    props: {
      type,
    },
    revalidate: 10, 
  };
};



const TypePage = () => {
 const router = useRouter();
 const { type, source } = router.query;
  const pageTitle = `Pokémon Type: ${type} - Strengths, Weaknesses, and Strategies`;
  const pageDescription = `Explore the properties of Pokémon Type ${type}. Learn about its strengths, weaknesses, battle strategies, and the Pokémon that belong to this type in the source list.`;
  return (
    <>
  <Head>
    <title>{pageTitle}</title>
    <meta name="description" content={pageDescription} />
  </Head>
      <TypePageSeo />
      <div>
       
        <PokemonDamageTypes />
      </div>
    </>
  );
};

export default TypePage;
