import { FC } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo"; // Assume this is your query hook
import { getPokemonImage } from "@/helpers/pokemon";
import { useQueryEggGroup } from "@/api/queries/pokemon-name-using-egggroupName";

const EggTypeSeo: FC = () => {
  const router = useRouter();
  const name = router.query.name || "Dragon";
  const id = Number(router.query.id) || 0;

  const { data } = useQueryEggGroup(id);


  const pokemonImages = data?.filter((pokemon) => !/gmax|mega/i.test(pokemon.name)).map((item: { id: number }) =>
    getPokemonImage(item.id)
  ) || ["https://pokemon-img.pages.dev/192x192/4.webp"];

  const canonicalUrl = `https://weplayold.com/egg-group/${name}?id=${id}`;
  const pageTitle = `Pokémon Egg Group: ${name} - Learn More About Egg Group Details`;
  const pageDescription = `Discover the Pokémon Egg Group ${name}. Learn about its traits, associated Pokémon, and other details. Explore group ${name} with id ${id}.`;

  console.log("ImageData",pokemonImages[0])
  return (
    <>
    
        <>
          <NextSeo
            title={pageTitle}
            description={pageDescription}
            canonical={canonicalUrl}
            openGraph={{
              type: "website",
              title: pageTitle,
              description: pageDescription,
              url: canonicalUrl,
              images: pokemonImages.map((url) => ({
                url,
                width: 475,
                height: 475,
                alt: `${name} egg group`,
              })),
              site_name: "WePlayOld",
            }}
            twitter={{
              cardType: "summary_large_image",
              site: "@hadoi",
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "PokemonEggGroup",
                name,
                description: pageDescription,
                images: pokemonImages,
                id,
                eggGroup: name,
              }),
            }}
          />
        </>
      
    </>
  );
};

export default EggTypeSeo;
