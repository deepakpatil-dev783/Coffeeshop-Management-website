import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Coffee, Sparkles } from 'lucide-react';
import { menuService } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Coffee', 'Tea', 'Cold Drinks', 'Snacks', 'Desserts'];

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const data = await menuService.getAll();
        setMenuItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Filter and Sort Logic
  const filteredItems = menuItems
    .filter((item) => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const searchMatch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-coffee-950 text-coffee-100 rounded-3xl p-8 sm:p-12 border border-coffee-800 shadow-2xl relative overflow-hidden text-center space-y-4">
        <div className="relative z-10 max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted Menu
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-cream">
            Explore Our Roastery Menu
          </h1>
          <p className="text-coffee-300 text-sm">
            Discover single-origin espressos, organic leaf teas, freshly baked pastries, and delicious desserts.
          </p>
        </div>
      </div>

      {/* Controls Bar: Categories, Search & Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-cream p-4 rounded-2xl border border-coffee-200 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-coffee-900 text-gold shadow-md scale-105'
                  : 'bg-coffee-100 text-coffee-700 hover:bg-coffee-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Options */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search caramel, latte..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-coffee-300 text-xs font-medium text-coffee-950 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-xl bg-white border border-coffee-300 text-xs font-semibold text-coffee-900 appearance-none focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
            >
              <option value="popular">Bestsellers</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-coffee-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-coffee-200/50 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ProductCard key={item.id || item._id} product={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-cream rounded-3xl border border-coffee-200 space-y-4">
          <Coffee className="w-12 h-12 text-coffee-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-coffee-900">No Coffee or Food Found</h3>
          <p className="text-xs text-coffee-600">Try changing your search query or selected category filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-coffee-900 text-gold text-xs font-bold rounded-xl shadow hover:bg-coffee-800 transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
