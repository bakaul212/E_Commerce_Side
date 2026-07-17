import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { 
  ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, 
  RotateCcw, Headphones, Star, Users, ShoppingBag, 
  Globe, Plus, Minus,
  Mail, Phone, MapPin, Share2, Send, Camera,
  Calendar, ArrowLeft, CheckCircle, MessageSquare
} from 'lucide-react';
import { ExplorePage } from './components/ExplorePage';
import { AuthPages } from './components/AuthPages';
import { AddProduct } from './components/AddProduct';
import { ManageProducts } from './components/ManageProducts';
import { AboutContact } from './components/AboutContact';

// 🖼️ সলিড ব্যাকগ্রাউন্ড কালারের বদলে প্রিমিয়াম রিয়াল-লাইফ ইমেজ যোগ করা হয়েছে
const sliderData = [
  {
    title: "Discover the Latest Tech & Style Trends",
    subtitle: "Upgrade your lifestyle with our curated premium collection.",
    cta: "Shop Tech",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1600&auto=format&fit=crop", // 🎧 গ্যাজেট ও টেক ইমেজ
    accentText: "text-indigo-400"
  },
  {
    title: "Curated Pieces for Elevated Living",
    subtitle: "Explore unique handcrafted home goods designed for comfort.",
    cta: "Explore Home",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop", // 🏠 হোম ডেকর ইমেজ
    accentText: "text-amber-400"
  }
];

// ১. মঙ্গোডিবি প্রোডাক্টের জন্য কড়া টাইপস্ক্রিপ্ট ইন্টারফেস
interface ProductType {
  _id: string; // মঙ্গোডিবির রিয়েল আইডি
  title: string;
  desc: string;
  fullDesc: string;
  price: string;
  rating: string;
  date: string;
  location: string;
  images: string[];
  specs?: Record<string, string>;
  reviews?: Array<{ name: string; rating: number; date: string; text: string }>;
}

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // শুরুতে user থাকবে null
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  // ভিউ ট্র্যাকিং স্টেট ('login' ভিউ যুক্ত করা হয়েছে)
  const [currentView, setCurrentView] = useState<'explore' | 'add-item' | 'manage-items' | 'about' | 'contact' | 'login'>('explore');
  
  // 🔄 মক ডাটাবেজ ট্র্যাকিং বাদ দিয়ে স্টেট ও MongoDB _id (string) ট্র্যাকিং
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // 🛍️ Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // 💬 New Review States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // 📥 ২. ডাটাবেজ থেকে রিয়েল-টাইমে প্রোডাক্ট ডাটা লোড করার useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("MongoDB fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev - 1));

  // ৩. সিলেক্টেড প্রোডাক্ট খোঁজার আধুনিক লজিক
  const activeProduct = products.find(p => p._id === selectedProductId);

  // ✍️ রিভিউ সাবমিশন হ্যান্ডলার
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim() || !selectedProductId) return;

    const newReview = {
      name: reviewName,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      text: reviewText
    };

    setProducts(prevProducts => 
      prevProducts.map(prod => {
        if (prod._id === selectedProductId) {
          const updatedReviews = prod.reviews ? [...prod.reviews, newReview] : [newReview];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = (totalRating / updatedReviews.length).toFixed(1);

          return {
            ...prod,
            rating: newAvgRating,
            reviews: updatedReviews
          };
        }
        return prod;
      })
    );

    setReviewName('');
    setReviewRating(5);
    setReviewText('');
  };

  // 🔒 প্রোটেক্টেড পেজগুলোতে যাওয়ার সময় অথেন্টিকেশন চেক হ্যান্ডলার
  const handleViewChange = (view: 'explore' | 'add-item' | 'manage-items' | 'about' | 'contact' | 'login') => {
    if ((view === 'add-item' || view === 'manage-items') && !user) {
      // যদি লগইন না থাকে, তবে ইউজারকে লগইন পেজে রিডাইরেক্ট করবে
      setCurrentView('login');
    } else {
      setCurrentView(view);
    }
  };

  /* ==========================================
     ১. LOGIN PAGE (যদি ইউজার লগইন না থাকে ও রিডাইরেক্ট হয়)
     ========================================== */
  if (currentView === 'login') {
    return (
      <AuthPages 
        onAuthSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setCurrentView('explore'); // লগইন সফল হলে হোম পেজে নিয়ে যাবে
        }} 
      />
    );
  }

  /* ==========================================
     ২. ADD PRODUCT PAGE (প্রোটেক্টেড রাউট)
     ========================================== */
  if (currentView === 'add-item') {
    if (!user) {
      setCurrentView('login');
      return null;
    }
    return (
      <AddProduct 
        onAddProduct={(newProduct) => {
          setProducts((prevProducts) => [newProduct as ProductType, ...prevProducts]);
          setCurrentView('explore');
        }}
        onCancel={() => setCurrentView('explore')}
      />
    );
  }

  /* ==========================================
     ৩. MANAGE PRODUCTS PAGE (প্রোটেক্টেড রাউট)
     ========================================== */
  if (currentView === 'manage-items') {
    if (!user) {
      setCurrentView('login');
      return null;
    }
    return (
      <ManageProducts 
        products={products.map((p, index) => ({
          ...p,
          id: index
        }))} 
        onDeleteProduct={async (id) => {
          const realProduct = products.find((_, index) => index === Number(id));
          if (!realProduct) return;

          const token = localStorage.getItem('token');
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/products/${realProduct._id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (response.ok) {
              setProducts((prev) => prev.filter(p => p._id !== realProduct._id));
              alert('Product deleted successfully from database!');
            } else {
              alert('Failed to delete product from server.');
            }
          } catch (err) {
            console.error("Delete error:", err);
            alert('Server error while deleting item.');
          }
        }}
        onViewProduct={(id) => {
          const realProduct = products.find((_, index) => index === Number(id));
          if (realProduct) {
            setSelectedProductId(realProduct._id);
          }
          setCurrentView('explore');
        }}
        onBack={() => setCurrentView('explore')}
      />
    );
  }

  /* ==========================================
     ৪. ABOUT / CONTACT PAGE (পাবলিক রাউট)
     ========================================== */
  if (currentView === 'about' || currentView === 'contact') {
    return (
      <AboutContact 
        view={currentView} 
        onBack={() => setCurrentView('explore')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <Navbar 
        currentView={currentView} 
        setCurrentView={handleViewChange} // প্রোটেকশন হ্যান্ডলার কল করা হলো
        user={user} 
        onLogout={() => {
          localStorage.removeItem('token'); 
          setUser(null); 
          setCurrentView('explore'); 
        }} 
      />

      {/* CONDITIONAL RENDERING: DETAILS PAGE OR HOME PAGE */}
      {activeProduct ? (
        /* =========================================================
            5. DETAILS PAGE
           ========================================================= */
        <main className="max-w-7xl mx-auto px-4 py-10 w-full flex-1">
          {/* Back Button */}
          <button 
            onClick={() => { setSelectedProductId(null); setActiveImgIdx(0); window.scrollTo(0,0); }}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-semibold mb-8 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Listings
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Left: Media / Images Section */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden h-[450px]">
                <img 
                  src={activeProduct.images[activeImgIdx]} 
                  alt={activeProduct.title} 
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>
              {/* Thumbnail List */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {activeProduct.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-24 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${activeImgIdx === idx ? 'border-indigo-600 scale-95 shadow-sm' : 'border-slate-200 hover:border-slate-400'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Primary Essential Info Box */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-slate-200 p-8 rounded-3xl shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center text-amber-500 font-bold text-sm gap-1">
                    <Star className="w-4 h-4 fill-amber-500" /> {activeProduct.rating} (Verified Product)
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {activeProduct.date}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight mb-4">
                  {activeProduct.title}
                </h1>
                
                <p className="text-3xl font-black text-indigo-600 mb-6">{activeProduct.price}</p>
                
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>Available in: <strong className="text-slate-700">{activeProduct.location}</strong></span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => { setIsCheckoutOpen(true); setCheckoutSuccess(false); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex justify-center items-center gap-4 text-xs text-slate-400 font-medium py-1">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Encryption</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><RotateCcw className="w-4 h-4 text-indigo-500" /> 30-Day Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Separate Bottom Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-slate-200 pt-12">
            
            {/* Left Main Content Pane: Overview & Reviews */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Section A: Description / Overview */}
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Description & Product Overview</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white p-6 border border-slate-100 rounded-2xl">
                  {activeProduct.fullDesc}
                </p>
              </section>

              {/* Section C: Reviews / Ratings */}
              <section className="space-y-8">
                {/* Submit New Review Form */}
                <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Send className="w-4 h-4 text-indigo-600" /> Write a Customer Review
                  </h3>
                  <form onSubmit={handleAddReview} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Your Name</label>
                        <input 
                          type="text" 
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Rating</label>
                        <select 
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                          <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                          <option value={3}>⭐⭐⭐ (3/5)</option>
                          <option value={2}>⭐⭐ (2/5)</option>
                          <option value={1}>⭐ (1/5)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Your Review</label>
                      <textarea 
                        required
                        rows={3}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your genuine feedback about the product..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
                    >
                      Submit Review <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* Display Reviews */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-600" /> Customer Reviews
                    </h2>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {activeProduct.reviews?.length || 0} Feedbacks
                    </span>
                  </div>
                  <div className="space-y-4">
                    {activeProduct.reviews && activeProduct.reviews.length > 0 ? (
                      activeProduct.reviews.map((rev, index) => (
                        <div key={index} className="bg-white p-5 border border-slate-200 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-xs">
                                {rev.name?.[0] || 'U'}
                              </div>
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{rev.name}</h4>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">"{rev.text}"</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm italic bg-white p-6 border border-slate-100 rounded-2xl text-center">
                        No reviews available for this product yet.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Sidebar Content Pane: Specifications */}
            <div className="lg:col-span-5">
              {/* Section B: Key Information / Specifications */}
              <section className="bg-white border border-slate-200 p-6 rounded-2xl sticky top-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 tracking-tight flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-indigo-600" /> Technical Specifications
                </h2>
                <div className="divide-y divide-slate-100 text-sm">
                  {activeProduct.specs && Object.keys(activeProduct.specs).length > 0 ? (
                    Object.entries(activeProduct.specs).map(([key, value]) => (
                      <div key={key} className="py-3 flex justify-between gap-4">
                        <span className="text-slate-400 font-medium text-xs sm:text-sm">{key}</span>
                        <span className="text-slate-700 font-semibold text-xs sm:text-sm text-right">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs italic py-2">No technical specs provided.</p>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Section D: Related Items Section */}
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Related Premium Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => p._id !== selectedProductId).slice(0, 4).map((item) => (
                <div 
                  key={item._id} 
                  onClick={() => { setSelectedProductId(item._id); setActiveImgIdx(0); window.scrollTo(0,0); }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-[380px] flex flex-col justify-between group cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-300"
                >
                  <div className="h-40 w-full overflow-hidden bg-slate-100 relative">
                    <img src={item.images?.[0] || 'https://via.placeholder.com/150'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-slate-800 font-bold text-xs px-2 py-0.5 rounded-md shadow-xs">{item.price}</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="flex items-center text-amber-500 text-[11px] font-bold gap-0.5 pt-2">
                      <Star className="w-3 h-3 fill-amber-500" /> {item.rating}
                    </div>
                    <button className="w-full mt-3 bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-[11px] group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      ) : (
        /* Home Page Content when no product is clicked */
        <>
          {/* Hero Section */}
          <section className="relative h-[65vh] w-full overflow-hidden bg-slate-900 select-none">
            <div 
              className="flex h-full w-[200%] transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 50}%)` }}
            >
              {sliderData.map((slide, index) => (
                <div 
                  key={index} 
                  className="w-1/2 h-full flex items-center justify-center px-6 sm:px-12 text-white relative"
                  // 🎨 সলিড কালার ক্লাসের পরিবর্তে ইনলাইন স্টাইলের মাধ্যমে ব্যাকগ্রাউন্ড ইমেজ ও ডার্ক ওভারলে বসানো হয়েছে
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className="max-w-4xl text-center z-10">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
                      {slide.title.split('&').map((part, i) => i === 1 ? <span key={i} className={slide.accentText}>& {part}</span> : part)}
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg max-w-xl mx-auto mb-8 font-medium drop-shadow-xs">
                      {slide.subtitle}
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2 mx-auto group">
                      {slide.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-md transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-md transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2">
              {sliderData.map((_, i) => (
                <div key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full cursor-pointer transition-all ${currentSlide === i ? 'w-6 bg-indigo-500' : 'w-2 bg-white/40'}`} />
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Truck, title: "Free Shipping", desc: "On all orders over $50" },
                { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected checkout" },
                { icon: RotateCcw, title: "Easy Returns", desc: "30-day money back guarantee" },
                { icon: Headphones, title: "24/7 Support", desc: "Dedicated live chat support" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-2">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><item.icon className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">{item.title}</h4>
                    <p className="text-slate-500 text-xs sm:text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Explore Page Content Section (Connected with MongoDB State) */}
          <ExplorePage 
            listingData={products.map((p) => ({
              ...p,
              id: p._id 
            }))} 
            isLoading={isLoading} 
            onViewDetails={(id) => {
              // ১. চেক করুন ইউজার লগইন আছে কি না (টোকেন আছে কি না)
              const token = localStorage.getItem('token');
              
              if (!token) {
                alert("Please log in first to view details and specs!");
                return;
              }

              // ২. লগইন থাকলে নরমাল কাজ করবে
              const realProduct = products.find((p) => p._id === id);
              if (realProduct) {
                setSelectedProductId(realProduct._id);
              }
              window.scrollTo(0, 0);
            }} 
          />

          {/* Top Picks Section */}
          <section className="py-16 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">This Week's Top Picks</h2>
                  <p className="text-slate-500 text-sm mt-1">Handpicked premium products based on high user ratings.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { name: "Premium Wireless Headphones", price: "$129.99", rating: "4.9", tag: "Tech" },
                  { name: "Minimalist Ceramic Vase", price: "$29.99", rating: "4.8", tag: "Home" },
                  { name: "Ergonomic Mechanical Keyboard", price: "$89.99", rating: "4.7", tag: "Tech" }
                ].map((prod, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-md">{prod.tag}</span>
                        <span className="flex items-center text-amber-500 text-sm font-semibold gap-0.5"><Star className="w-4 h-4 fill-amber-500" /> {prod.rating}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{prod.name}</h3>
                      <p className="text-slate-600 font-extrabold text-xl">{prod.price}</p>
                    </div>
                    <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">Add to Cart</button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 max-w-7xl mx-auto px-4 w-full">
            <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 text-white grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex justify-center items-center gap-2 text-3xl sm:text-4xl lg:text-5xl font-black mb-2"><Users className="w-8 h-8 opacity-80" /> 1M+</div>
                <p className="text-indigo-100 text-sm sm:text-base font-medium">Happy Customers Globally</p>
              </div>
              <div>
                <div className="flex justify-center items-center gap-2 text-3xl sm:text-4xl lg:text-5xl font-black mb-2"><ShoppingBag className="w-8 h-8 opacity-80" /> 500k+</div>
                <p className="text-indigo-100 text-sm sm:text-base font-medium">Premium Products Sold</p>
              </div>
              <div>
                <div className="flex justify-center items-center gap-2 text-3xl sm:text-4xl lg:text-5xl font-black mb-2"><Globe className="w-8 h-8 opacity-80" /> 30+</div>
                <p className="text-indigo-100 text-sm sm:text-base font-medium">Countries Covered</p>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">What Our Customers Say</h2>
                <p className="text-slate-500 text-sm mt-1">Real reviews from verified premium buyers.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { text: "The delivery was lightning fast, and the packaging was completely secure. Highly recommended!", author: "Sarah M.", role: "Verified Buyer" },
                  { text: "Excellent customer service. I had a issue with sizing and they resolved it within minutes.", author: "James L.", role: "Tech Enthusiast" },
                  { text: "The premium quality of the minimalist items exceeded my expectations. Will shop again!", author: "Elena R.", role: "Regular Customer" }
                ].map((review, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
                    <p className="text-slate-600 text-sm italic leading-relaxed">"{review.text}"</p>
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600 text-sm">{review.author[0]}</div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{review.author}</h4>
                        <p className="text-slate-400 text-xs">{review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 max-w-3xl mx-auto px-4 w-full">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-slate-500 text-sm mt-1">Got questions? We've got answers.</p>
            </div>
            <div className="space-y-4">
              {[
                { q: "What is your return policy?", a: "We offer a 30-day money-back guarantee on all products if they are returned in their original condition." },
                { q: "How long does shipping take?", a: "Standard domestic shipping takes 2-4 business days. International shipping takes 7-10 business days." },
                { q: "Are my payment details secure?", a: "Yes, all transactions are handled via 256-bit SSL encrypted secure processing channels." }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                  <button 
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-5 font-bold text-slate-700 text-left hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {faqOpen === idx ? <Minus className="w-4 h-4 text-indigo-600" /> : <Plus className="w-4 h-4 text-slate-400" />}
                  </button>
                  {faqOpen === idx && (
                    <div className="px-5 pb-5 pt-1 text-slate-500 text-sm border-t border-slate-50 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="py-16 bg-slate-900 text-white w-full">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Stay in the Loop</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8">Subscribe to our newsletter and receive 10% off your first order.</p>
              <form onSubmit={(e) => { e.preventDefault(); alert(`Subscribed with: ${email}`); setEmail(''); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/15 transition-all"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-sm">Subscribe</button>
              </form>
            </div>
          </section>
        </>
      )}

      {/* Fully Functional Footer */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-8 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold text-white tracking-tight">ShopEase</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your ultimate destination for premium tech, fashion, and lifestyle products. Crafted for absolute comfort and modern elegance.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 bg-slate-900 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"><Share2 className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"><Send className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"><Camera className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"><Globe className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => setCurrentView('explore')} className="hover:text-indigo-400 transition-colors text-left">Home Landing</button></li>
              <li><button onClick={() => setCurrentView('explore')} className="hover:text-indigo-400 transition-colors text-left">All Products</button></li>
              <li><button onClick={() => setCurrentView('about')} className="hover:text-indigo-400 transition-colors text-left">About Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Customer Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => setCurrentView('contact')} className="hover:text-indigo-400 transition-colors text-left">Contact & Help</button></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Contact Us</h4>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <span className="text-slate-400">Chandpur, Bangladesh</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
              <a href="tel:+1234567890" className="text-slate-400 hover:text-indigo-400 transition-colors">01793097400</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
              <a href="mailto:support@shopease.com" className="text-slate-400 hover:text-indigo-400 transition-colors">bakaul15-4163@diu.edu.bd</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-medium flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} ShopEase Global Inc. All rights reserved.</p>
        </div>
      </footer>

      {/* =========================================================
          🛒 CHECKOUT MODAL (POPUP) - FULLY FUNCTIONAL
         ========================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {!checkoutSuccess ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">Checkout Details</h3>
                  <p className="text-xs text-slate-400 mt-1">Please confirm your booking order for {activeProduct?.title}.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-center">
                  <img src={activeProduct?.images[0]} alt="" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{activeProduct?.title}</h4>
                    <p className="text-indigo-600 font-extrabold text-base mt-0.5">{activeProduct?.price}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Shipping Address</label>
                    <input 
                      type="text" 
                      defaultValue="123 Commerce St, New York"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Contact Number</label>
                    <input 
                      type="text" 
                      placeholder="+1 (234) 567-890"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-xl text-xs sm:text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setCheckoutSuccess(true)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">Order Placed Successfully!</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Thank you for your order. We've sent a confirmation invoice email with details to your inbox.</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-all"
                >
                  Back to Product
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}