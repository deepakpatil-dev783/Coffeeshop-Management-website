import React, { useState } from "react";
import { Star, Plus, Minus, ShoppingBag, Clock, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="group bg-cream rounded-3xl overflow-hidden border border-coffee-200/80 shadow-sm hover:shadow-coffee-glow hover:border-gold/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden bg-coffee-900">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/80 via-transparent to-transparent opacity-60"></div>

          {/* Popular Tag */}
          {product.isPopular && (
            <span className="absolute top-3 left-3 bg-amber-500 text-coffee-950 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-coffee-950" /> Bestseller
            </span>
          )}

          {/* Rating Pill */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-coffee-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-gold text-xs font-bold border border-gold/30">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span>{product.rating}</span>
          </div>

          {/* Prep Time Pill */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-coffee-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-coffee-200 text-xs border border-coffee-700">
            <Clock className="w-3.5 h-3.5 text-coffee-300" />
            <span>{product.prepTime || "5 mins"}</span>
          </div>
        </div>

        {/* Product Content */}
        <div className="p-5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-bold text-coffee-950 group-hover:text-coffee-700 transition-colors leading-snug">
              {product.name}
            </h3>
            <span className="font-bold text-base text-coffee-800 bg-coffee-100 px-2.5 py-0.5 rounded-lg border border-coffee-200">
              ₹{product.price.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-coffee-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 flex items-center justify-between gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center border border-coffee-300 rounded-xl bg-coffee-50 p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-coffee-200 text-coffee-800 transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-7 text-center font-bold text-xs text-coffee-900">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-coffee-200 text-coffee-800 transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          className="flex-1 flex items-center justify-center gap-2 bg-coffee-900 hover:bg-coffee-800 text-cream px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md active:scale-95 group-hover:bg-gold group-hover:text-coffee-950"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
