import React from 'react';
import { Leaf, Clock, Truck, Award, Heart, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description:
      'We source only the freshest, locally-grown ingredients for authentic taste',
  },
  {
    icon: Clock,
    title: 'Quick Delivery',
    description:
      'Hot and fresh food delivered to your doorstep in under 30 minutes',
  },
  {
    icon: Award,
    title: 'Authentic Recipes',
    description:
      'Traditional recipes passed down through generations of master chefs',
  },
  {
    icon: Truck,
    title: 'Free Delivery',
    description:
      'Enjoy free delivery on all orders within a 5km radius from our kitchen',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description:
      'Every dish is prepared with care and passion for Indian cuisine',
  },
  {
    icon: ShieldCheck,
    title: 'Hygiene First',
    description:
      'FSSAI certified kitchen with strict hygiene and quality standards',
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-foreground text-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
            Why Us?
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Why Choose{' '}
            <span className="text-primary">Uttam Shudh Khana</span>
          </h2>
          <p className="text-background/70 max-w-2xl mx-auto">
            We take pride in serving the most authentic and delicious Indian
            food with unmatched quality and service
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-background/5 backdrop-blur-sm border border-background/10 hover:bg-background/10 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-background/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
