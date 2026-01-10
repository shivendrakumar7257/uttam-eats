import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import MenuCard from '@/components/MenuCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { menuItems, categories } from '@/data/menuData';
import { cn } from '@/lib/utils';

const Menu: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVegOnly, setShowVegOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !showVegOnly || item.isVeg;

      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [selectedCategory, searchQuery, showVegOnly]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Our Menu
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse selection of authentic Indian dishes, from rich
              curries to aromatic biryanis
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-8 space-y-6">
            {/* Search and Toggle Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Veg Toggle */}
              <Button
                variant={showVegOnly ? 'default' : 'outline'}
                onClick={() => setShowVegOnly(!showVegOnly)}
                className={cn(
                  'h-12',
                  showVegOnly && 'bg-green-600 hover:bg-green-700'
                )}
              >
                <span className="mr-2">🟢</span>
                Veg Only
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    'h-10',
                    selectedCategory === category.id && 'btn-primary-glow'
                  )}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing{' '}
              <span className="font-semibold text-foreground">
                {filteredItems.length}
              </span>{' '}
              {filteredItems.length === 1 ? 'dish' : 'dishes'}
              {selectedCategory !== 'all' && (
                <>
                  {' '}
                  in{' '}
                  <span className="font-semibold text-primary">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Menu Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <MenuCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🍽️</span>
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                No dishes found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowVegOnly(false);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
