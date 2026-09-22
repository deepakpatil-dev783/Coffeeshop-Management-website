import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Coffee,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    couponCode,
    subtotal,
    tax,
    discount,
    totalAmount,
    clearCart,
  } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput) {
      applyCoupon(promoInput);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-coffee-100 rounded-full flex items-center justify-center mx-auto text-coffee-600 border border-coffee-200">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-extrabold text-coffee-950">
          Your Cart is Empty
        </h2>
        <p className="text-coffee-600 max-w-md mx-auto text-sm">
          Looks like you haven't added any handcrafted coffee or freshly baked
          treats to your cart yet.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-coffee-900 text-gold font-bold px-6 py-3.5 rounded-2xl shadow-md hover:bg-coffee-800 transition"
        >
          <Coffee className="w-4 h-4" /> Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-coffee-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-coffee-950">
            Your Order Cart
          </h1>
          <p className="text-xs text-coffee-600 mt-0.5">
            Review your selected items before proceeding to checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.menuItemId}
              className="bg-cream p-4 sm:p-5 rounded-3xl border border-coffee-200 shadow-sm flex items-center gap-4 justify-between"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-2xl object-cover border border-coffee-200 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-base text-coffee-950 truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-coffee-600 font-medium">
                  ₹{item.price.toFixed(2)} / unit
                </p>
                <p className="text-xs font-bold text-coffee-900 mt-1">
                  Item Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-coffee-300 rounded-xl bg-coffee-50 p-1">
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItemId, item.quantity - 1)
                    }
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-coffee-200 text-coffee-800"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-bold text-xs text-coffee-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItemId, item.quantity + 1)
                    }
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-coffee-200 text-coffee-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.menuItemId)}
                  className="p-2 text-coffee-400 hover:text-rose-600 transition rounded-xl hover:bg-rose-50"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Pricing Summary */}
        <div className="bg-coffee-950 text-coffee-100 p-6 rounded-3xl border border-coffee-800 shadow-2xl space-y-6">
          <h3 className="font-serif text-xl font-bold text-cream border-b border-coffee-800 pb-3">
            Order Summary
          </h3>

          {/* Coupon Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-xs font-semibold text-coffee-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-gold" /> Promo Coupon (Try
              "BREW10")
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="BREW10"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 bg-coffee-900 border border-coffee-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gold text-coffee-950 font-bold text-xs rounded-xl hover:brightness-110 transition"
              >
                Apply
              </button>
            </div>
            {couponCode && (
              <p className="text-xs text-emerald-400 font-semibold">
                Active Code: {couponCode} (Applied)
              </p>
            )}
          </form>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-coffee-300 border-t border-coffee-800 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-cream">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discount Promo</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-cream border-t border-coffee-800 pt-3">
              <span>Final Total</span>
              <span className="text-gold">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-coffee-400 text-coffee-950 py-3.5 rounded-2xl font-bold text-sm shadow-gold-glow hover:brightness-110 transition"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
