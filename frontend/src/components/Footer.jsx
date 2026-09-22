import React from "react";
import { Link } from "react-router-dom";
import {
  Coffee,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Heart,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-coffee-950 text-coffee-200 border-t border-coffee-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/40">
                <Coffee className="w-5 h-5 text-gold" />
              </div>
              <span className="font-serif text-2xl font-bold text-cream">
                Brew & Bean
              </span>
            </div>
            <p className="text-sm text-coffee-300 leading-relaxed">
              Crafting unforgettable coffee moments using ethically sourced
              single-origin beans, hand-steamed milk, and artisanal baked goods.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-coffee-900 flex items-center justify-center text-coffee-300 hover:text-gold hover:bg-coffee-800 transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-coffee-900 flex items-center justify-center text-coffee-300 hover:text-gold hover:bg-coffee-800 transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-coffee-900 flex items-center justify-center text-coffee-300 hover:text-gold hover:bg-coffee-800 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-cream font-serif tracking-wider uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-gold transition">
                  Home & Story
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-gold transition">
                  Explore Full Menu
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-gold transition">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-gold transition">
                  View Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Hours */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-cream font-serif tracking-wider uppercase">
              Opening Hours
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-cream">Monday - Friday</p>
                  <p className="text-xs text-coffee-400">07:00 AM - 09:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-cream">Saturday - Sunday</p>
                  <p className="text-xs text-coffee-400">08:00 AM - 10:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-cream font-serif tracking-wider uppercase">
              Location & Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-coffee-300">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>482 Artisan Way, Roast District, SF 94107</span>
              </li>
              <li className="flex items-center gap-3 text-coffee-300">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>+1 (555) BREW-BEAN</span>
              </li>
              <li className="flex items-center gap-3 text-coffee-300">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>hello@brewbean.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-coffee-900 flex flex-col sm:flex-row items-center justify-between text-xs text-coffee-400 gap-4">
          <p>© 2026 Brew & Bean Coffee Roastery. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for
            Coffee Connoisseurs
          </p>
        </div>
      </div>
    </footer>
  );
};
