import React from 'react';
import { X, Heart, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useFavorites } from '../context/FavoritesContext';
import LocationMap from './LocationMap';

const ItemModal = ({ item, onClose }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item.id);

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      data-testid="item-modal"
    >
      <div
        className="bg-background border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b border-border p-4 flex justify-between items-center z-10">
          <span className="font-mono text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
            {item.category}
          </span>
          <button
            onClick={onClose}
            className="hover:bg-secondary p-2 transition-colors"
            aria-label="Close modal"
            data-testid="modal-close-button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square bg-secondary">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-tight uppercase mb-4" data-testid="modal-item-title">
              {item.title}
            </h2>

            <div className="mb-6">
              <span className="font-mono text-3xl font-bold" data-testid="modal-item-price">${item.price}</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="font-mono text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-1">Description</span>
                <p className="font-sans text-base leading-relaxed text-muted-foreground" data-testid="modal-item-description">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-1">Condition</span>
                  <p className="font-sans text-base" data-testid="modal-item-condition">{item.condition}</p>
                </div>
                <div>
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-1">Quantity</span>
                  <p className="font-sans text-base" data-testid="modal-item-quantity">{item.quantity} in stock</p>
                </div>
              </div>

              {item.location && (
                <div>
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </span>
                  <p className="font-sans text-base mb-2" data-testid="modal-item-location">{item.location}</p>
                  <LocationMap 
                    coordinates={item.coordinates} 
                    location={item.location} 
                    title={item.title}
                  />
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div>
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-1">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="font-mono text-[10px] uppercase tracking-widest border border-border px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="font-mono text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-1">Posted</span>
                <p className="font-sans text-sm text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" size="lg" data-testid="modal-contact-button">
                Contact Seller
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => toggleFavorite(item.id)}
                data-testid="modal-favorite-button"
              >
                <Heart className={`h-5 w-5 ${favorite ? 'fill-primary' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;