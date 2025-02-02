
import Image from 'next/future/image';
import Head from 'next/head';
import { ReactEventHandler } from 'react';

type Props = {
  pockemonType: string;
  form?: string; // Optional form name
  size: number;
  requestedSize?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  alt?: string;
  onError?: ReactEventHandler<HTMLImageElement>;
};

const BASE_IMAGE_URL = 'https://raw.githubusercontent.com/afiiif/pokemon-assets/main/img/types';

/**
 * Component to fetch and display Pokémon images.
 */
export default function PokemonTypeImage({
  pockemonType,
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
  // Base form image URL
  const baseImageSrc = `${BASE_IMAGE_URL}/${pockemonType &&pockemonType?.toLowerCase()}.svg`;

  // Alternate form image URL
  const formImageSrc = form
    ? `${BASE_IMAGE_URL}/${pockemonType}-${form}.webp`
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

      <picture className={`${className} `} onError={onError} {...props} >
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
