import { useState } from 'react';
import Image from 'next/image';
import styles from './tcg.module.css'; 

type PokemonCard = {
  id: string;
  name: string;
  rarity: string;
  images: {
    large: string;
  };
};

const Popup = ({ card, onClose }: { card: PokemonCard | null; onClose: () => void }) => {
  if (!card) return null;

  const cardRarityClass = card.rarity ? card.rarity.replace(' ', '') : 'default';
  const isActive = true; // Set to `true` when card is selected or active

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div
        className={styles.popupContent}
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
      >
        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
        <h3>{card.name}</h3>
        <div
          className={`${styles.card} ${styles[cardRarityClass]} ${isActive ? styles.active : ''}`}
        >
          <div className={`${styles.card__rotator}`}>
            <Image src={card.images.large} alt={card.name} width={200} height={300} />
          </div>
        </div>
        <p>Rarity: {card.rarity}</p>
      </div>
    </div>
  );
};

export default Popup;
