import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Menu, X, User, LogOut, ShoppingCart, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="shrink-0 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-slate-800 tracking-tight">ShopEase</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors">Home</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors">Products</a>
            
            {isLoggedIn ? (
              <>
                <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" /> Cart (0)
                </a>
                <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </a>
                <button 
                  onClick={() => setIsLoggedIn(false)} 
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsLoggedIn(true)} 
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-1"
              >
                <User className="w-4 h-4" /> Login
              </button>
            )}
          </div>

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

      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-3 shadow-lg">
          <a href="#" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Home</a>
          <a href="#" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Products</a>
          
          {isLoggedIn ? (
            <>
              <a href="#" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Cart (0)</a>
              <a href="#" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Dashboard</a>
              <button 
                onClick={() => { setIsLoggedIn(false); setIsOpen(false); }} 
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => { setIsLoggedIn(true); setIsOpen(false); }} 
              className="w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-xl text-base font-medium shadow-xs"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};