import { Mail, Phone, MapPin, Send, Info, ShieldCheck, Users } from 'lucide-react';
import { useState } from 'react';

interface AboutContactProps {
  view: 'about' | 'contact';
  onBack: () => void;
}

export function AboutContact({ view, onBack }: AboutContactProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (view === 'about') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Info className="w-6 h-6 text-indigo-600" /> About Our Marketplace
          </h2>
          <button onClick={onBack} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Back
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8 text-slate-600 leading-relaxed text-sm">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <p className="font-medium text-indigo-900 text-base mb-2">Welcome to the Next Generation Marketplace!</p>
            <p>We are dedicated to building the ultimate premium platform where verified sellers and enthusiastic buyers connect safely, smoothly, and instantly. No hidden tricks, just direct value.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="border border-slate-200 rounded-2xl p-5 space-y-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-800">Verified Community</h4>
              <p className="text-xs text-slate-500">Every single member and listing undergoes strict security validation to keep the marketplace standard perfectly safe for everyone.</p>
            </div>
            <div className="border border-slate-200 rounded-2xl p-5 space-y-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-800">Secure Deals Only</h4>
              <p className="text-xs text-slate-500">We prioritize transparency. From detailed specification metrics to reliable real reviews, your trade integrity is 100% guarded.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contact Page
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Mail className="w-6 h-6 text-indigo-600" /> Contact Support
        </h2>
        <button onClick={onBack} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="text-xs font-medium text-slate-700 truncate">support@marketplace.com</div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="text-xs font-medium text-slate-700">+1 (555) 019-2834</div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="text-xs font-medium text-slate-700">795 Folsom Ave, San Francisco</div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          {formSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-xl text-center">
              Message sent successfully! Our team will get back to you within 24 hours.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input required type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                <textarea required rows={4} placeholder="Type your query or feedback here..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500" />
              </div>
              <button type="submit" className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs">
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}