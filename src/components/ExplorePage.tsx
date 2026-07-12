import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, Calendar, MapPin, ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';

// আপনার App.tsx এর ডাটা টাইপের সাথে ম্যাচ করানো হলো
interface Product {
  id: number;
  title: string;
  category?: string; // category অপশনাল করা হলো যাতে ডাটাতে না থাকলেও ক্র্যাশ না করে
  desc: string;
  fullDesc?: string;
  price: string | number; // string বা number দুইটাই সাপোর্ট করবে
  rating: string | number;
  date: string;
  location: string;
  images: string[];
 //  তার বদলে এই টাইপটি বসিয়ে দিন:
//  তার বদলে এই কোডটি বসিয়ে দিন:
specs?: Record<string, string | number | boolean | null | undefined>;
}

interface ExplorePageProps {
  listingData: Product[];
  isLoading: boolean;
  onViewDetails: (id: number) => void;
}

const ITEMS_PER_PAGE = 2; // প্রতি পেজে ২টি করে প্রোডাক্ট দেখাবে

export function ExplorePage({ listingData, isLoading, onViewDetails }: ExplorePageProps) {
  // States for Filter, Search, Sort & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  // Core Filtering & Sorting Logic
  const filteredAndSortedListings = useMemo(() => {
    let result = [...listingData];

    // সার্চ ফিল্টার
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
      );
    }

    // ক্যাটাগরি ফিল্টার (ডাটাতে না থাকলে 'Electronics' বা 'Home & Living' টাইটেল দেখে অনুমান করবে)
    if (selectedCategory !== 'All') {
      result = result.filter(item => {
        const itemCategory = item.category || (item.title.toLowerCase().includes('phone') || item.title.toLowerCase().includes('laptop') || item.title.toLowerCase().includes('electronics') ? 'Electronics' : 'Home & Living');
        return itemCategory === selectedCategory;
      });
    }

    // বাজেট ফিল্টার
    result = result.filter(item => {
      const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
      return priceNum <= maxPrice;
    });

    // লোকেশন ফিল্টার
    if (selectedLocation !== 'All') {
      result = result.filter(item => item.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    // সর্টিং লজিক
    if (sortBy === 'price-low') {
      result.sort((a, b) => {
        const pA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^0-9.]/g, '')) : a.price;
        const pB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^0-9.]/g, '')) : b.price;
        return pA - pB;
      });
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => {
        const pA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^0-9.]/g, '')) : a.price;
        const pB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^0-9.]/g, '')) : b.price;
        return pB - pA;
      });
    } else if (sortBy === 'rating') {
      result.sort((a, b) => {
        const rA = typeof a.rating === 'string' ? parseFloat(a.rating) : a.rating;
        const rB = typeof b.rating === 'string' ? parseFloat(b.rating) : b.rating;
        return rB - rA;
      });
    }

    return result;
  }, [listingData, searchQuery, selectedCategory, maxPrice, selectedLocation, sortBy]);

  // Pagination Calculations & Safe Page Guard
  const totalPages = Math.ceil(filteredAndSortedListings.length / ITEMS_PER_PAGE);
  const safePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedListings = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedListings, safePage]);

  const handleFilterChange = <T,>(setter: (val: T) => void, value: T) => {
    setter(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(500);
    setSelectedLocation('All');
    setSortBy('default');
    setCurrentPage(1);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Advanced Filters
          </h3>
          <button onClick={resetFilters} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            Reset All
          </button>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Category</label>
          <select 
            value={selectedCategory}
            onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Living">Home & Living</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Budget</label>
            <span className="text-xs font-black text-indigo-600">${maxPrice}</span>
          </div>
          <input 
            type="range" min="100" max="500" step="25"
            value={maxPrice}
            onChange={(e) => handleFilterChange(setMaxPrice, Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Regional Location</label>
          <select 
            value={selectedLocation}
            onChange={(e) => handleFilterChange(setSelectedLocation, e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">Global / Across Regions</option>
            <option value="USA">United States (USA)</option>
            <option value="Japan">Japan</option>
            <option value="Germany">Germany</option>
            <option value="Korea">South Korea</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Search & Sort Head Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <div className="relative w-full sm:max-w-md flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              placeholder="Search by keywords or specs..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button onClick={() => handleFilterChange(setSearchQuery, '')} className="absolute right-3 text-slate-400"><X className="w-4 h-4" /></button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="default">Default Features</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Ratings</option>
            </select>
          </div>
        </div>

        {/* Listing Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 h-[430px] animate-pulse" />
              ))}
            </div>
          ) : paginatedListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {paginatedListings.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-[430px] flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                  <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-white/95 text-slate-800 font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg shadow-xs">
                      {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                      {item.category || (item.title.toLowerCase().includes('phone') || item.title.toLowerCase().includes('laptop') ? 'Electronics' : 'Home & Living')}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-amber-500 text-xs font-bold gap-1 mb-1.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> <span>{item.rating}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-xs line-clamp-2">{item.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                    </div>

                    <button 
                      onClick={() => onViewDetails(item.id)}
                      className="w-full mt-4 bg-slate-950 group-hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      View Details & Specs <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto mt-8">
              <h4 className="font-bold text-slate-800 text-base mb-1">No Listings Found</h4>
              <p className="text-slate-500 text-xs mb-4">We couldn't find any products matching your filters.</p>
              <button onClick={resetFilters} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold">Clear Filters</button>
            </div>
          )}
        </div>

        {/* Pagination Footer Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-6 select-none">
            <button
              disabled={safePage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="flex items-center gap-1 border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white font-semibold px-3 py-1.5 text-xs rounded-xl disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex gap-1.5 text-xs font-bold text-slate-600">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum} onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${safePage === pageNum ? 'bg-indigo-600 text-white border-transparent' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="flex items-center gap-1 border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white font-semibold px-3 py-1.5 text-xs rounded-xl disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}