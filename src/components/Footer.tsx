import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl">🍛</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Uttam Shudh Khana</h3>
                <p className="text-sm text-background/60">Pure & Authentic</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Experience the authentic taste of Indian cuisine crafted with love and
              traditional recipes passed down through generations.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Menu', 'About Us', 'Contact', 'Order Tracking'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>123 Food Street, Flavor Town,<br />Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>order@uttamshudhkhana.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-background">Monday - Friday</p>
                  <p>11:00 AM - 11:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-background">Saturday - Sunday</p>
                  <p>10:00 AM - 12:00 AM</p>
                </div>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-primary/20 rounded-lg">
              <p className="text-sm font-medium text-primary">🛵 Free Delivery</p>
              <p className="text-xs text-background/60">Within 5km radius</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p>© 2024 Uttam Shudh Khana. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
