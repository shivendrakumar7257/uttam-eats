import React from 'react';
import { Award, Users, Clock, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

const stats = [
  { icon: Users, value: '10,000+', label: 'Happy Customers' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Clock, value: '30', label: 'Min Avg Delivery' },
  { icon: Heart, value: '50+', label: 'Signature Dishes' },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                Our Story
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                A Journey of{' '}
                <span className="text-gradient">Authentic Flavors</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Welcome to <strong className="text-primary">Uttam Shudh Khana</strong>, 
                where every dish is a celebration of India's rich culinary heritage. 
                Founded with a passion for authentic Indian cuisine, we've been serving 
                happiness on plates for over 15 years.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our name "Uttam Shudh Khana" translates to "Best Pure Food" - a promise 
                we've kept since day one. We believe in using only the freshest ingredients, 
                traditional cooking methods, and recipes passed down through generations of 
                master chefs.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From the bustling streets of Mumbai to your dining table, we bring you 
                the authentic taste of India, prepared with love and served with care.
              </p>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                  alt="Restaurant Interior"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍🍳</span>
                  </div>
                  <div>
                    <p className="font-semibold">Expert Chefs</p>
                    <p className="text-sm text-muted-foreground">15+ Years Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-foreground text-background py-16 mb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-display text-3xl md:text-4xl font-bold mb-2">
                    {stat.value}
                  </p>
                  <p className="text-background/70 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Uttam Shudh Khana
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border/50 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                Pure Ingredients
              </h3>
              <p className="text-muted-foreground text-sm">
                We source only the freshest, locally-grown ingredients to ensure 
                authentic taste and quality in every dish.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border/50 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                Made with Love
              </h3>
              <p className="text-muted-foreground text-sm">
                Every dish is prepared with passion and care, following traditional 
                recipes that have been perfected over generations.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border/50 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                Customer First
              </h3>
              <p className="text-muted-foreground text-sm">
                Your satisfaction is our priority. We go above and beyond to ensure 
                every dining experience is memorable.
              </p>
            </div>
          </div>
        </section>

        {/* Chef Section */}
        <section className="container mx-auto px-4">
          <div className="bg-muted/50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 space-y-6">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Meet Our Head Chef
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Chef Rajesh Kumar brings over 20 years of culinary expertise to 
                  Uttam Shudh Khana. Trained in the kitchens of legendary restaurants 
                  across India, he masterfully blends traditional techniques with 
                  modern presentation.
                </p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-foreground">
                  "Cooking is not just about ingredients – it's about the love and 
                  tradition you pour into every dish. At Uttam Shudh Khana, we cook 
                  as if we're cooking for our own family."
                </blockquote>
                <p className="font-semibold text-primary">- Chef Rajesh Kumar</p>
              </div>
              <div className="order-1 md:order-2">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80"
                    alt="Head Chef"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
