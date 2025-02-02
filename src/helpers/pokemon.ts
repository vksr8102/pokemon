export const formatPokemonId = (id: number | string) => String(id).padStart(3, '0');

export const getPokemonImage = (id: number | string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const getPokemonTypeImage = (type:string | unknown)=>
  `https://raw.githubusercontent.com/afiiif/pokemon-assets/main/img/types/${type}.svg`