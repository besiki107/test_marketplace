import React, { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { itemsAPI } from '../api/items';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import { Loader2 } from 'lucide-react';

const Favorites = () => {
  const { favorites } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchFavoriteItems();
  }, [favorites]);

  const fetchFavoriteItems = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getAll();
      const favoriteItems = response.data.filter(item => favorites.includes(item.id));
      setItems(favoriteItems);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="favorites-loading">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="favorites-page">
      <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight uppercase mb-8" data-testid="favorites-title">
          Your Favorites
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16 border border-border" data-testid="favorites-empty">
            <p className="font-mono text-muted-foreground mb-2">No favorite items yet</p>
            <p className="font-sans text-sm text-muted-foreground">Click the heart icon on items to save them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10" data-testid="favorites-grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Favorites;