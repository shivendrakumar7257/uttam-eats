import React from 'react';
import { Plus, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from '@/data/menuData';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addToCart } = useCart();

  const spiceLevels = {
    1: { label: 'Mild', color: 'bg-green-500' },
    2: { label: 'Medium', color: 'bg-yellow-500' },
    3: { label: 'Hot', color: 'bg-red-500' },
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-card card-hover border border-border/50">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant={item.isVeg ? 'secondary' : 'destructive'}
            className={cn(
              'text-xs font-semibold',
              item.isVeg ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-600 text-white hover:bg-red-700'
            )}
          >
            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </Badge>
          {item.isPopular && (
            <Badge className="bg-accent text-accent-foreground text-xs font-semibold">
              ⭐ Popular
            </Badge>
          )}
        </div>

        {/* Availability */}
        {!item.available && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <span className="text-background font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">
            ₹{item.price}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.preparationTime}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {spiceLevels[item.spiceLevel].label}
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                spiceLevels[item.spiceLevel].color
              )}
            />
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={() => addToCart(item)}
          disabled={!item.available}
          className="w-full btn-primary-glow group/btn"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover/btn:rotate-90" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default MenuCard;
