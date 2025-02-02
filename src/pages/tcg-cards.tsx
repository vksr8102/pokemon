import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';  // Import Head component
import { CiShare2 } from "react-icons/ci";
import VanillaTilt from 'vanilla-tilt';
import { IoMdClose } from 'react-icons/io';
import { useRouter } from 'next/router';
type PokemonCard = {
  id: string;
  name: string;
  rarity: string;
  artist:string;
  images: {
    large: string;
  };
};

const fetchPokemonCardsByPage = async (page: number): Promise<PokemonCard[]> => {
  try {
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=20`, {
      headers: {
        'X-Api-Key': '165725f9-acc0-4cf2-9186-efd1304b36e5',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch {
   
    return [];
  }
};

const Popup = ({ card, onClose }: { card: PokemonCard | null; onClose: () => void }) => {
  const imageRef = useRef<any>(null);

  //-> function for generate the shareble  link of the card
  const generateShareableLink = (card: PokemonCard) => {
    if (!card || !card.id) return '';
  

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
   
    return `${baseUrl}/tcg-cards/?id=${card.id}&name=${encodeURIComponent(card.name || '')}`;
  };
  
 //----> function for share the link of the card to anyone
  const handleShareClick = (card: PokemonCard) => {
    const shareableLink = generateShareableLink(card);
  
    if (navigator.share) {
     
      navigator
        .share({
          title: `Check out this card: ${card.name}`,
          url: shareableLink,
        })
        .then(() => console.log("Shared successfully!"))
        .catch((error) => console.error("Sharing failed:", error));
    } else {
     
      navigator.clipboard
        .writeText(shareableLink)
        .then(() => alert("Shareable link copied to clipboard!"))
        .catch((error) => console.error("Failed to copy link:", error));
    }
  };
  

  useEffect(() => {
    if (imageRef.current) {
      VanillaTilt.init(imageRef.current, {
        max: 75,
        speed: 1200,
        glare: false,
        "max-glare": 0,
        easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
        perspective: 1000,
      });
    }

    return () => {
      if (imageRef.current) {
        imageRef.current.vanillaTilt.destroy();
      }
    };
  }, []);

  if (!card) return null;

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden"; 
    }

    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "auto"; 
      }
    };
  }, []);

  return (
    <div className="popup-overlay fixed inset-0 bg-black bg-opacity-70 z-[100000] flex items-center justify-center">
      <div className="dark:bg-dark-card bg-white shadow-lg rounded-xl min-w-[250px] md:max-w-lg max-sm:w-full max-sm:mx-4  mx-auto" role="dialog" aria-labelledby="popup-title" aria-describedby="popup-body">
        <div className="pb-4 flex justify-between p-4 py-6 border-b">
          <h3 id="popup-title">
            <strong>[{card.id}]</strong> {card.name}
          </h3>
          <button aria-label="Close popup" onClick={handleClose}>
            <IoMdClose size={24} />
          </button>
        </div>

        <div id="popup-body" className="p-6 px-8 flex flex-col items-center">
        <div 
  ref={imageRef}
  className="tilt-container card md:w-[19vw] md:h-[60vh] w-full h-[55vh] m-2" 
  style={{
 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    perspective: "1000px",
  }}
>
  <Image 
    src={card.images.large} 
    alt={card.name} 
    layout="fill"      
    objectPosition="center" 
    className="rounded-xl h-full w-full shadow-xl"
  />
</div>
          <div className="text-start w-full">
            <p className="mt-4"><strong>Rarity:</strong> {card.rarity}</p>
            <p><strong>Artist:</strong> {card.artist}</p>
          </div>
        </div>

        <div className="p-4 flex gap-4  w-full border-t">
          <button className="p-2 px-4  dark:bg-typography-dark dark:text-black text-white rounded-lg bg-dark-light hover:bg-dark-card transition-colors" onClick={handleClose}>
            Close
          </button>
          <button className="p-2 flex w-full gap-2 px-4 justify-center items-center dark:bg-typography-dark dark:text-black text-white rounded-lg bg-dark-light hover:bg-dark-card " onClick={()=>handleShareClick(card)}>
            <CiShare2 /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PokemonTCGPage() {
  const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreCards, setHasMoreCards] = useState(true);
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const router = useRouter();
  useEffect(() => {
    const { id } = router.query;
  
    if (id) {
      // Find the card with the matching ID from already loaded cards
      const existingCard = pokemonCards.find((card) => card.id === id);
      if (existingCard) {
        setSelectedCard(existingCard);
      } else {
        // Fetch and show the card if not already loaded
        const fetchCard = async () => {
          try {
            const response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
              headers: {
                'X-Api-Key': '165725f9-acc0-4cf2-9186-efd1304b36e5',
              },
            });
            const data = await response.json();
            setSelectedCard(data.data || null);
          } catch (error) {
            console.error("Error fetching card details:", error);
          }
        };
        fetchCard();
      }
    }
  }, [router.query, pokemonCards]);
  

  const loadCards = useCallback(async () => {
    if (hasMoreCards && !loading) {
      setLoading(true);
      const newCards = await fetchPokemonCardsByPage(currentPage);

      if (newCards.length < 20) {
        setHasMoreCards(false);
      }

      setPokemonCards(prevCards => [...prevCards, ...newCards]);
      setCurrentPage(prevPage => prevPage + 1);
      setLoading(false);
    }
  }, [hasMoreCards, loading, currentPage]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const filteredCards = pokemonCards.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === '' || card.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRarityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRarity(event.target.value);
  };

  const uniqueRarities = [...new Set(pokemonCards.map((card) => card.rarity))];

  const handleCardClick = (card: PokemonCard) => {
    setSelectedCard(card);
    router.push(
      {
        pathname: router.pathname,
        query: { id: card.id, name: card.name },
      },
      undefined,
      { shallow: true } 
    );
  };
  
  const handleClosePopup = () => {
    setSelectedCard(null);
    router.push(router.pathname, undefined, { shallow: true });
  };

  return (
    <div className="container">
      <Head>
        <title>Pokémon TCG Cards - Browse and Explore</title> {/* Add the title here */}
        <meta name="description" content="Browse and explore Pokémon TCG cards, search by name or rarity, and view detailed card information." /> {/* Meta description */}
      </Head>

      <h1>Pokémon TCG Cards</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by card name"
        className="search-input"
      />

      <select
        value={selectedRarity}
        onChange={handleRarityChange}
        className="rarity-select"
      >
        <option value="">All Rarities</option>
        {uniqueRarities.map((rarity) => (
          <option key={rarity} value={rarity}>
            {rarity}
          </option>
        ))}
      </select>

      <div className="cards-container">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <div
              key={card.id}
              className="card"
              onClick={() => handleCardClick(card)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{card.name}</h3>
              <Image
                src={card.images.large}
                alt={card.name}
                width={200}
                height={300}
              />
              <p>Rarity: {card.rarity}</p>
            </div>
          ))
        ) : (
          <p>No cards found.</p>
        )}
      </div>

      {loading && <p>Loading more cards...</p>}

      {selectedCard && <Popup card={selectedCard} onClose={handleClosePopup} />}

      <style jsx>{`
        .search-input, .rarity-select {
          background-color: #333;
          color: #f1f1f1;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 16px;
          width: 100%;
        }
        .search-input::placeholder {
          color: #888;
        }
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        .card {
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}