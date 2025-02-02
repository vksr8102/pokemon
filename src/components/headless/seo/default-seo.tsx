import { DefaultSeo as DefaultNextSeo } from 'next-seo';
import { useRouter } from 'next/router';

export default function DefaultSeo() {
  const router = useRouter();
  const canonicalUrl = `https://weplayold.com${router.asPath}`;

  return (
    <DefaultNextSeo
      defaultTitle="" // Leave empty or provide a generic title
      description="" // Leave empty so each page can set its own description
      canonical={canonicalUrl}
      openGraph={{
        title: "", // Leave empty
        description: "", // Leave empty
        url: canonicalUrl,
        type: 'website',
        images: [
          {
            url: 'https://weplayold.com/path/to/image.jpg',
            alt: 'Pokémon Pokedex Fan Image',
            width: 800,
            height: 600,
          },
        ],
        site_name: 'Pokémon Pokedex Fan',
      }}
      twitter={{
        cardType: 'summary_large_image',
        site: '@yourtwitterhandle',
      }}
    />
  );
}
