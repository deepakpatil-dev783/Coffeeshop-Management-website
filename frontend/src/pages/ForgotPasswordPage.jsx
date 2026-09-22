import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Mail, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const ForgotPasswordPage = () => {
  const { addToast } = useNotification();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    addToast(`Password reset link sent to ${email}`, 'success');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-cream p-8 rounded-3xl border border-coffee-200 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-coffee-950 rounded-2xl flex items-center justify-center mx-auto text-gold border border-gold/40 shadow-lg">
            <Coffee className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-coffee-950">Reset Password</h2>
          <p className="text-xs text-coffee-600">Enter your email address to receive password reset instructions.</p>
        </div>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-3 text-emerald-900">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">Check Your Inbox</h4>
            <p className="text-xs">Reset link sent to <strong>{email}</strong>.</p>
            <Link to="/login" className="inline-block text-xs font-bold text-coffee-900 hover:text-gold pt-2">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-coffee-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-coffee-300 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold to-coffee-400 text-coffee-950 py-3 rounded-2xl font-bold text-sm shadow-gold-glow hover:brightness-110 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <p className="text-center text-xs text-coffee-600">
          Remember password?{' '}
          <Link to="/login" className="font-bold text-coffee-900 hover:text-gold">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
