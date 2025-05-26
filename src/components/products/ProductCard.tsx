import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    onAddToCart();
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <div className="aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* Quick action buttons */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <motion.button
              initial={{ scale: 0.8 }}
              animate={isHovered ? { scale: 1 } : { scale: 0.8 }}
              onClick={handleAddToCart}
              className={`bg-white text-gray-800 p-3 rounded-full mx-2 shadow-md hover:bg-primary-50 transition-all ${
                isAddingToCart ? 'bg-primary-600 text-white' : ''
              }`}
              disabled={isAddingToCart}
              aria-label="Add to cart"
            >
              <ShoppingCart size={20} />
            </motion.button>
            <motion.button
              initial={{ scale: 0.8 }}
              animate={isHovered ? { scale: 1 } : { scale: 0.8 }}
              onClick={toggleFavorite}
              className={`p-3 rounded-full mx-2 shadow-md transition-all ${
                isFavorite
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-gray-800 hover:bg-primary-50'
              }`}
              aria-label="Add to favorites"
            >
              <Heart size={20} />
            </motion.button>
          </div>
          
          {/* Category badge */}
          {product.category && (
            <div className="absolute top-2 left-2">
              <span className="badge bg-black/70 text-white">
                {product.category}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="md:hidden text-primary-600 hover:text-primary-700"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;