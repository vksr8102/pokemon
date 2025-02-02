import { getPokemonTypeImage } from '@/helpers/pokemon';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';



const TypePageSeo = () => {
  const router = useRouter();
  const { type, source,pairType } = router.query;



 
 var canonicalUrl:any;

 if(pairType){

  canonicalUrl = `https://weplayold.com/type/${type}?source=list&pairType=${pairType}`;
 }else{
  canonicalUrl = `https://weplayold.com/type/${type}?source=list`;

 }


  const pageTitle = `Pokémon Type: ${type} - Explore Pokémon Details`;
  const pageDescription = `Explore the properties of Pokémon Type ${type}, including strengths, weaknesses, and strategies. This detailed guide covers Pokémon from ${source}.`;




  return (
    <>
      <NextSeo
       title={pageTitle}
       description={pageDescription}
      canonical={canonicalUrl}  
      openGraph={{
        type: 'website',
        title: pageTitle,
        description: pageDescription,
        url: canonicalUrl,
        images: [
                    {
                      url:getPokemonTypeImage(type),
                      width: 475,
                      height: 475,
                      alt: `${type}`,
                      type: 'image/png',
                    },
                  ],  
        site_name: 'WePlayOld',
      }}
      twitter={{
        cardType: 'summary_large_image',
        site: '@hadoi', 
      }}
      />

      {/* Structured Data as JSON-LD */}
      <script type="application/ld+json">
      {`{
          "@context": "https://schema.org",
          "@type": "Pokemon",
          "name": "${type}",
          "description": "${pageDescription}",
          "image": "${getPokemonTypeImage(type)}",
          "type": "${type}"
        }`}
      </script>
    </>
  );
};

export default TypePageSeo;
