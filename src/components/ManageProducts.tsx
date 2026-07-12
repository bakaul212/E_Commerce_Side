import { Trash2, Eye, LayoutGrid } from 'lucide-react';

interface ManageProductsProps {
  products: {
    id: number;
    title: string;
    desc: string;
    fullDesc?: string;
    price: string;
    rating: string;
    date: string;
    location: string;
    images: string[];
    specs?: Record<string, unknown>;
    reviews?: unknown[];
  }[];
  onDeleteProduct: (id: number) => void;
  onViewProduct: (id: number) => void;
  onBack: () => void;
}

export function ManageProducts({ products, onDeleteProduct, onViewProduct, onBack }: ManageProductsProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-indigo-600" /> Manage Items
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review, view details, or remove your items from the marketplace listing.
          </p>
        </div>
        <button 
          onClick={onBack}
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          Back to Explore
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
          <p className="text-slate-500 text-sm font-medium">No products found in the database.</p>
        </div>
      ) : (
        /* Responsive Table Wrapper */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Location</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Image & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'} 
                          alt={product.title} 
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-800 line-clamp-1">{product.title}</div>
                          <div className="text-xs text-slate-400 line-clamp-1 sm:hidden">{product.location}</div>
                        </div>
                      </div>
                    </td>
                    {/* Location (Hidden on mobile) */}
                    <td className="p-4 text-sm text-slate-600 font-medium hidden sm:table-cell">
                      {product.location}
                    </td>
                    {/* Price */}
                    <td className="p-4 text-sm font-bold text-indigo-600">
                      {product.price}
                    </td>
                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onViewProduct(product.id)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm(`Are you sure you want to delete "${product.title}"?`)) {
                              onDeleteProduct(product.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}