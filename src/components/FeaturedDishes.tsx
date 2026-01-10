import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MenuCard from './MenuCard';
import { menuItems } from '@/data/menuData';

const FeaturedDishes: React.FC = () => {
  const featuredItems = menuItems.filter((item) => item.isPopular).slice(0, 4);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            ⭐ Customer Favorites
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Our Popular Dishes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most loved dishes, crafted with authentic recipes and
            the freshest ingredients
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MenuCard item={item} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/menu">
            <Button size="lg" variant="outline" className="group">
              View Full Menu
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDishes;
