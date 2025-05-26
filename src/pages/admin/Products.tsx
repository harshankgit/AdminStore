import React, { useEffect, useState } from "react";
import ProductCard from "../../components/products/ProductCard";
import api from "../../services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { products } = await api.get("/products");
        setProducts(
          products.map((p: any) => ({
            id: p._id || p.id || '',
            name: p.name,
            price: p.price,
            image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image || 'https://via.placeholder.com/300x300?text=No+Image',
            category: (p.category && (p.category.name || p.category)) || '',
            rating: (p.rating && typeof p.rating === 'object' ? p.rating.average : p.rating) ?? 0,
          }))
        );
      } catch (err: any) {
        setError(err?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg animate-pulse h-80"></div>
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">No products found</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
