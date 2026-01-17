import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { Button } from './ui/button';

const Navbar = () => {
  const { isAdmin, logout } = useAuth();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="px-4 md:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <span className="font-mono text-xl font-bold tracking-tighter uppercase">AUTOPARTS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-mono text-sm uppercase tracking-wider hover:text-primary transition-colors" data-testid="nav-home">
              Browse
            </Link>
            <Link to="/favorites" className="font-mono text-sm uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-2" data-testid="nav-favorites">
              <Heart className="h-4 w-4" />
              Favorites
              {favorites.length > 0 && (
                <span className="font-mono text-xs bg-primary text-primary-foreground px-2 py-0.5" data-testid="favorites-count">
                  {favorites.length}
                </span>
              )}
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin" className="font-mono text-sm uppercase tracking-wider hover:text-primary transition-colors" data-testid="nav-admin">
                  Admin
                </Link>
                <Button onClick={logout} variant="outline" size="sm" className="font-mono uppercase text-xs" data-testid="logout-button">
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border" data-testid="mobile-menu">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="font-mono text-sm uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
                Browse
              </Link>
              <Link to="/favorites" className="font-mono text-sm uppercase tracking-wider flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Heart className="h-4 w-4" />
                Favorites
                {favorites.length > 0 && (
                  <span className="font-mono text-xs bg-primary text-primary-foreground px-2 py-0.5">
                    {favorites.length}
                  </span>
                )}
              </Link>
              {isAdmin && (
                <>
                  <Link to="/admin" className="font-mono text-sm uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                  <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" size="sm" className="font-mono uppercase text-xs w-fit">
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;