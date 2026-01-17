import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

const ItemCard = ({ item, onClick }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <div
      className="group relative border border-border bg-card hover:border-primary transition-colors duration-300 cursor-pointer"
      onClick={onClick}
      data-testid={`item-card-${item.id}`}
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1" data-testid={`item-category-${item.id}`}>
            {item.category}
          </span>
          <button
            onClick={handleFavoriteClick}
            className="p-1 hover:scale-110 transition-transform"
            data-testid={`favorite-button-${item.id}`}
          >
            <Heart className={`h-5 w-5 ${favorite ? 'fill-primary' : ''}`} />
          </button>
        </div>
        <h3 className="font-sans text-base font-medium mb-1" data-testid={`item-title-${item.id}`}>{item.title}</h3>
        <p className="font-sans text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-lg font-bold" data-testid={`item-price-${item.id}`}>${item.price}</span>
          <span className="font-sans text-xs text-muted-foreground">{item.condition}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;