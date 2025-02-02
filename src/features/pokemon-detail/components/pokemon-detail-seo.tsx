import { NextSeo } from 'next-seo';
import { formatPokemonId, getPokemonImage } from '@/helpers/pokemon';
import { snakeCaseToTitleCase } from '@/utils/string';
import useCurrentPokemon from '../hooks/use-current-pokemon';

export default function PokemonDetailSeo() {
  const { pokemonSpecies, pokemon } = useCurrentPokemon();

  const displayedPokemonName = snakeCaseToTitleCase(pokemon.name);
  const types = pokemon.pokemon_v2_pokemontypes.map(({ pokemon_v2_type }) => pokemon_v2_type!.name);
  
  const pokemonDescription =
    pokemonSpecies.descriptions.find((description) =>
      description.toLowerCase().includes(pokemonSpecies.name),
    ) || pokemonSpecies.descriptions[0] || 'A Pokémon from the Pokémon world.';

  const seoDescription =
    `${displayedPokemonName} #${formatPokemonId(pokemon.id)} - ${pokemonDescription.substring(0, 120)} (${types.join(', ')})`;

  // Use your domain name for the canonical URL
  const canonicalUrl = `https://weplayold.com/pokemon/${pokemon.name}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Pokemon",
    name: displayedPokemonName,
    description: pokemonDescription,
    image: getPokemonImage(pokemon.id),
    type: types.join(", "),
  };

  return (
    <>
      <NextSeo
        title={`${displayedPokemonName} #${formatPokemonId(pokemon.id)}`}
        description={seoDescription}
        canonical={canonicalUrl}  // Canonical URL added here
        openGraph={{
          title: `${displayedPokemonName} #${formatPokemonId(pokemon.id)}`,
          description: seoDescription,
          images: [
            {
              url: getPokemonImage(pokemon.id),
              width: 475,
              height: 475,
              alt: displayedPokemonName,
              type: 'image/png',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@hadoi', // Replace with your Twitter handle
        }}
      />
      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@type": "Pokemon",
          "name": "${displayedPokemonName}",
          "description": "${pokemonDescription}",
          "image": "${getPokemonImage(pokemon.id)}",
          "type": "${types.join(", ")}"
        }`}
      </script>
    </>
  );
}
