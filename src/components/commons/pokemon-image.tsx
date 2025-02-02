import Image from 'next/future/image';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ReactEventHandler } from 'react';

type Props = {
  idPokemon: number;
  form?: string; // Optional form name
  size: number;
  requestedSize?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  alt?: string;
  onError?: ReactEventHandler<HTMLImageElement>;
};

// Function to determine the BASE_IMAGE_URL based on the current URL path (client side)
function getBaseImageUrl() {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath === "/") {
      return 'https://pokemon-img.pages.dev/192x192';
    } else if (currentPath.startsWith("/pokemon/")) {
      return 'https://pokemon-img.pages.dev/600x600';
    }
  return 'https://pokemon-img.pages.dev/192x192'; // Fallback (empty) during SSR
}
}

/**
 * Component to fetch and display Pokémon images.
 */
export default function PokemonImage({
  idPokemon,
  form,
  size,
  requestedSize: requestedSizeTemp,
  priority,
  className,
  imgClassName,
  alt = 'pokemon',
  onError,
  ...props
}: Props & JSX.IntrinsicElements['picture']) {
  // State to store the BASE_IMAGE_URL once it's available
  const [baseImageUrl, setBaseImageUrl] = useState<string>('');

  // Run client-side logic inside useEffect
  useEffect(() => {
    const url:any = getBaseImageUrl();
    setBaseImageUrl(url);
  }, []);

  // Don't render the image until the BASE_IMAGE_URL is set
  if (!baseImageUrl) return null;

  // Base form image URL
  const baseImageSrc = `${baseImageUrl}/${idPokemon}.webp`;

  // Alternate form image URL
  const formImageSrc = form
    ? `${baseImageUrl}/${idPokemon}-${form}.webp`
    : baseImageSrc;

  // Determine image source
  const imageSrc = form ? formImageSrc : baseImageSrc;

  // Adjust size for high-quality images
  const requestedSize = requestedSizeTemp || size * 2;

  return (
    <>
      {priority && (
        <Head>
          <link rel="preload" as="image" href={imageSrc} />
        </Head>
      )}

      <picture className={className} onError={onError} {...props}>
        <source srcSet={imageSrc} type="image/webp" />
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? undefined : 'lazy'}
          className={imgClassName}
          width={size}
          height={size}
        />
      </picture>
    </>
  );
}
