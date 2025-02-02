import { NextSeo } from 'next-seo';

const games = [
  { name: 'GBA Pokémon - Ruby Version', url: 'https://weplayold.com/games/gba-Pokemon%20-%20Ruby%20Version%20(U)%20(V1.1).html' },
   { name: 'GBA Pokémon - Ruby Version', url: 'https://weplayold.com/games/gba-Pokemon%20-%20Ruby%20Version%20(U)%20(V1.1).html' },
    { name: 'GBA Pokémon - Ruby Version', url: 'https://weplayold.com/games/gba-Pokemon%20-%20Ruby%20Version%20(U)%20(V1.1).html' },
	 { name: 'GBA Pokémon - Ruby Version', url: 'https://weplayold.com/games/gba-Pokemon%20-%20Ruby%20Version%20(U)%20(V1.1).html' },
  // Add more games here if needed
];

export default function PlayPokemonPage() {
  return (
    <>
      <NextSeo
        title="Play Pokémon GBA Games"
        description="Play your favorite Pokémon games online."
      />

      <h1 className="h1 pb-2">Play Pokémon GBA Games</h1>

      <div className="card-container">
        {games.map((game) => (
          <div
            key={game.name}
            className="card"
            role="button"
            tabIndex={0}
            onClick={() => window.open(game.url, '_blank')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.open(game.url, '_blank');
              }
            }}
          >
            <h2>{game.name}</h2>
          </div>
        ))}
      </div>

      <style jsx>{`
        .card-container {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .card {
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: background 0.3s, box-shadow 0.3s;
          width: 200px;
          text-align: center;
          user-select: none;
        }
        .card:hover {
          background: #e0e0e0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}
