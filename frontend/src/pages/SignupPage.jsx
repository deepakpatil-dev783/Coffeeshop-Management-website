import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Lock, Mail, User, Phone } from "lucide-react";
import {
  isValidIndianPhone,
  sanitizeIndianPhone,
  useAuth,
} from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export const SignupPage = () => {
  const { signup } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    const cleanedPhone = sanitizeIndianPhone(phone);
    if (!isValidIndianPhone(cleanedPhone)) {
      addToast("Mobile number must be exactly 10 digits after +91.", "error");
      return;
    }

    const role = "customer";

    setLoading(true);
    try {
      const res = await signup({
        name,
        email,
        phone: cleanedPhone,
        password,
        role,
      });
      if (res.success) {
        addToast(`Account created for ${res.user.name}!`, "success");
        navigate("/profile");
      } else {
        addToast(res.message || "Error creating account", "error");
      }
    } catch (err) {
      addToast("Error creating account", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-cream p-8 rounded-3xl border border-coffee-200 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-coffee-950 rounded-2xl flex items-center justify-center mx-auto text-gold border border-gold/40 shadow-lg">
            <Coffee className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-coffee-950">
            Join Brew & Bean
          </h2>
          <p className="text-xs text-coffee-600">
            Create an account for coffee orders and table reservations.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-coffee-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-coffee-300 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-coffee-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-coffee-300 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-coffee-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(sanitizeIndianPhone(e.target.value))}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-coffee-300 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-coffee-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-coffee-300 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold to-coffee-400 text-coffee-950 py-3.5 rounded-2xl font-bold text-sm shadow-gold-glow hover:brightness-110 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-coffee-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-coffee-900 hover:text-gold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
