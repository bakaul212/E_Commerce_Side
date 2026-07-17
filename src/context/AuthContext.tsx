/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ১. ইউজারের জন্য একটি সুনির্দিষ্ট ইন্টারফেস (কোনো any নেই)
interface UserDataType {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userRole: 'user' | 'admin' | null;
  setUserRole: (role: 'user' | 'admin' | null) => void;
  user: UserDataType | null;
  setUser: (user: UserDataType | null) => void; // 👈 any এর জায়গায় স্ট্রং টাইপ
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [user, setUser] = useState<UserDataType | null>(null); // 👈 any এর জায়গায় স্ট্রং টাইপ

  // ২. রিয়েল ব্যাকএন্ড লগইন মেকানিজম (JWT ও রোল হ্যান্ডেল করবে)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token); // 🔒 টোকেন সেভ
        setIsLoggedIn(true);
        setUser(data.user);
        setUserRole(data.user.role); // 'user' অথবা 'admin' সেট হবে
        return true;
      } else {
        alert(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Server is offline!');
      return false;
    }
  };

  // ৩. প্রফেশনাল লগআউট ফাংশন (টোকেন ও স্টেট ক্লিয়ার করবে)
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      setIsLoggedIn, 
      userRole, 
      setUserRole,
      user,
      setUser,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};