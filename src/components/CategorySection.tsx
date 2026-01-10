import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '@/data/menuData';

const CategorySection: React.FC = () => {
  const displayCategories = categories.filter((cat) => cat.id !== 'all');

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block px-4 py-1 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full">
            🍽️ Explore Our Menu
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Food Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our diverse menu categories and find your perfect meal
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/menu?category=${category.id}`}
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative bg-card rounded-2xl p-6 text-center border border-border/50 card-hover overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300" />

                {/* Icon */}
                <div className="relative mb-4">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300 inline-block">
                    {category.icon}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors relative">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
