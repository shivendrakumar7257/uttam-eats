import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B2942' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Now Open for Orders
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Taste the
                <span className="text-gradient block">Authentic Indian</span>
                Flavors
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Experience the rich heritage of Indian cuisine at{' '}
                <span className="text-primary font-semibold">
                  Uttam Shudh Khana
                </span>
                . Every dish tells a story of tradition, love, and pure ingredients.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">4.8</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">30 min</p>
                  <p className="text-xs text-muted-foreground">Avg. Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">5 km</p>
                  <p className="text-xs text-muted-foreground">Free Delivery</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <Button size="lg" className="h-14 px-8 btn-primary-glow group">
                  Order Now
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:pl-12 animate-fade-in">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
                <img
                  src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80"
                  alt="Delicious Indian Curry"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-6 top-1/4 bg-card p-4 rounded-xl shadow-lg animate-float hidden md:block">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍛</span>
                  <div>
                    <p className="font-semibold text-sm">Today's Special</p>
                    <p className="text-xs text-muted-foreground">
                      Chicken Biryani
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-card p-4 rounded-xl shadow-lg animate-float hidden md:block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">500+</p>
                    <p className="text-xs text-muted-foreground">
                      Happy Customers
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-8 -right-8 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-8 -left-8 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
