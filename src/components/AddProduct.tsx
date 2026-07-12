import { useState } from 'react';
import { PlusCircle, Image, DollarSign, Calendar, Type, FileText } from 'lucide-react';

interface AddProductProps {
  onAddProduct: (newProduct: {
    id: number;
    title: string;
    desc: string;
    fullDesc: string;
    price: string;
    rating: string;
    date: string;
    location: string;
    images: string[];
  }) => void;
  onCancel: () => void;
}
export function AddProduct({ onAddProduct, onCancel }: AddProductProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('USA');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Form Validations
    if (!title.trim() || !desc.trim() || !price || !date) {
      setError('Please fill in all the required fields.');
      return;
    }

    // নতুন প্রোডাক্ট অবজেক্ট তৈরি
    const newProduct = {
      id: Date.now(), // ইউনিক আইডি জেনারেট করার জন্য
      title,
      desc,
      fullDesc,
      price: `$${price}`,
      rating: '5.0', // নতুন প্রোডাক্টের ডিফল্ট রেটিং
      date,
      location,
      images: imageUrl.trim() ? [imageUrl] : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], // ইমেজ না দিলে ডিফল্ট ইমেজ বসবে
    };

    onAddProduct(newProduct);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-indigo-600" /> Add New Item
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Fill up the details below to add a new product item to the listing marketplace.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Title *</label>
            <div className="relative flex items-center">
              <Type className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., iPhone 15 Pro Max"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Short Description *</label>
            <div className="relative flex items-center">
              <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <textarea 
                value={desc} onChange={(e) => setDesc(e.target.value)}
                placeholder="Brief summary of the item (max 2 sentences)..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Description (Optional)</label>
            <textarea 
              value={fullDesc} onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Detailed specifications, condition, and other info..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Price & Date Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price ($) *</label>
              <div className="relative flex items-center">
                <DollarSign className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input 
                  type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                  placeholder="299"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Publish Date *</label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input 
                  type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Optional Image URL */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL (Optional)</label>
            <div className="relative flex items-center">
              <Image className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Location Choice */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
            <select 
              value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="USA">United States (USA)</option>
              <option value="Japan">Japan</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" onClick={onCancel}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
            >
              Add Item
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}