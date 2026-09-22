import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, "success");
        if (res.user.role === "staff") {
          navigate("/staff");
        } else if (res.user.role === "owner") {
          navigate("/owner");
        } else {
          navigate("/profile");
        }
      }
    } catch (err) {
      addToast("Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(e);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-cream p-8 rounded-3xl border border-coffee-200 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-coffee-950 rounded-2xl flex items-center justify-center mx-auto text-gold border border-gold/40 shadow-lg">
            <Coffee className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-coffee-950">
            Welcome Back
          </h2>
          <p className="text-xs text-coffee-600">
            Sign in to manage orders, reservations, or staff portals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="customer@brewbean.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-coffee-300 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-coffee-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-coffee-600 hover:text-gold font-semibold"
              >
                Forgot password?
              </Link>
            </div>
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
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-coffee-600">
          Don't have an account yet?{" "}
          <Link
            to="/signup"
            className="font-bold text-coffee-900 hover:text-gold"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
