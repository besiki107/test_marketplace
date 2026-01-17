import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../api/items';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import Filters from '../components/Filters';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useSessionStorage('recentlyViewed', []);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'newest',
    minPrice: '',
    maxPrice: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getAll();
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    
    // Add to recently viewed
    setRecentlyViewed((prev) => {
      const filtered = prev.filter(id => id !== item.id);
      return [item.id, ...filtered].slice(0, 10);
    });
  };

  const getFilteredAndSortedItems = () => {
    let filtered = [...items];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(item => item.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(item => item.price <= parseFloat(filters.maxPrice));
    }

    // Sort
    switch (filters.sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = [...new Set(items.map(item => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-state">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" data-testid="error-state">
        <p className="text-destructive font-mono">{error}</p>
        <button
          onClick={fetchItems}
          className="font-mono text-sm uppercase tracking-wider hover:underline"
          data-testid="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-black overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1640556795357-71d4078d6228?crop=entropy&cs=srgb&fm=jpg&q=85"
          alt="Auto Parts"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="font-mono text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4" data-testid="hero-title">
              Performance Parts
            </h1>
            <p className="font-sans text-base md:text-lg text-gray-300">Quality automotive components for every build</p>
          </div>
        </div>
      </div>

      <Filters filters={filters} onFilterChange={setFilters} categories={categories} />

      <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {paginatedItems.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-state">
            <p className="font-mono text-muted-foreground">No items found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10" data-testid="items-grid">
              {paginatedItems.map((item) => (
                <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12" data-testid="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="font-mono text-sm uppercase px-4 py-2 border border-border hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="prev-page-button"
                >
                  Previous
                </button>
                <span className="font-mono text-sm px-4" data-testid="page-info">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="font-mono text-sm uppercase px-4 py-2 border border-border hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="next-page-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Home;