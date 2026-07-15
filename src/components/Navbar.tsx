import { useState } from 'react';
import { ShoppingBag, Menu, X, User, LogOut, PlusCircle, Settings } from 'lucide-react';

// 💡 প্রফেশনাল ও ক্লিন Props ইন্টারফেস
interface NavbarProps {
  currentView: string;
  setCurrentView: (view: 'explore' | 'add-item' | 'manage-items' | 'about' | 'contact') => void;
  user: { name: string; email: string } | null; // App.tsx থেকে মঙ্গোডিবি ইউজার স্টেট রিসিভ করছি
  onLogout: () => void; // লগআউট লজিক হ্যান্ডেল করার জন্য
}

export const Navbar = ({ currentView, setCurrentView, user, onLogout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // পেজ চেঞ্জ করার সময় মোবাইল মেনু অটোমেটিক বন্ধ করার জন্য
  const handleNavigation = (view: 'explore' | 'add-item' | 'manage-items' | 'about' | 'contact') => {
    setCurrentView(view);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('explore')} 
            className="shrink-0 flex items-center gap-2 bg-transparent border-none cursor-pointer focus:outline-none"
          >
            <ShoppingBag className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-slate-800 tracking-tight">ShopEase</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavigation('explore')} 
              className={`font-medium text-sm transition-colors ${currentView === 'explore' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('about')} 
              className={`font-medium text-sm transition-colors ${currentView === 'about' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              About
            </button>
            <button 
              onClick={() => handleNavigation('contact')} 
              className={`font-medium text-sm transition-colors ${currentView === 'contact' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Contact
            </button>
            
            {/* 🔐 ডাইনামিক ইউজার কন্ডিশন (রিয়েল ডাটাবেজ বেসড) */}
            {user ? (
              <>
                {/* Add Product Button */}
                <button 
                  onClick={() => handleNavigation('add-item')} 
                  className={`font-medium text-sm transition-colors flex items-center gap-1 ${currentView === 'add-item' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
                >
                  <PlusCircle className="w-4 h-4" /> Add Item
                </button>

                {/* Manage Items Button */}
                <button 
                  onClick={() => handleNavigation('manage-items')} 
                  className={`font-medium text-sm transition-colors flex items-center gap-1 ${currentView === 'manage-items' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
                >
                  <Settings className="w-4 h-4" /> Manage Items
                </button>

                {/* Logout */}
                <button 
                  onClick={onLogout} 
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              /* ইউজার লগইন না থাকলে সরাসরি সাইন-ইন/রেজিস্টার অপশন পাবে */
              <button 
                onClick={() => (window.location.href = '/login')} 
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-1"
              >
                <User className="w-4 h-4" /> Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <button onClick={() => handleNavigation('explore')} className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Home</button>
          <button onClick={() => handleNavigation('about')} className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">About</button>
          <button onClick={() => handleNavigation('contact')} className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Contact</button>
          
          {user ? (
            <>
              <button onClick={() => handleNavigation('add-item')} className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 text-indigo-600">Add Item</button>
              <button onClick={() => handleNavigation('manage-items')} className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 text-indigo-600">Manage Items</button>
              <button 
                onClick={() => { onLogout(); setIsOpen(false); }} 
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => { window.location.href = '/login'; setIsOpen(false); }} 
              className="w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-xl text-base font-medium shadow-xs"
            >
              Login / Register
            </button>
          )}
        </div>
      )}
    </nav>
  );
};