import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../hooks/useCart";
import api from "../services/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  inventory: number;
  features: string[];
  specifications: Record<string, string>;
  rating: {
    average: number;
    count: number;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/products/${id}`);
        setProduct(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-12 w-1/3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600">
            Product not found
          </h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Link
        to="/products"
        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={
                    i < Math.floor(product.rating.average)
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    i < Math.floor(product.rating.average)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-gray-600">
              ({product.rating.count} reviews)
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="ml-3 text-lg text-gray-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.comparePrice && (
              <span className="inline-block mt-1 text-sm text-accent-600 font-medium">
                Save ${(product.comparePrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="btn btn-outline px-3 py-2"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.inventory}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      product.inventory,
                      Math.max(1, parseInt(e.target.value))
                    )
                  )
                }
                className="w-20 text-center mx-2 input"
              />
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.inventory, q + 1))
                }
                className="btn btn-outline px-3 py-2"
                disabled={quantity >= product.inventory}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="btn btn-primary flex-1"
              disabled={product.inventory === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </button>
            <button className="btn btn-outline p-3">
              <Heart className="h-5 w-5" />
            </button>
            <button className="btn btn-outline p-3">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Product Features */}
          {product.features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Product Specifications */}
          {Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="border rounded-lg overflow-hidden">
                {Object.entries(product.specifications).map(
                  ([key, value], index) => (
                    <div
                      key={key}
                      className={`flex ${
                        index !== Object.keys(product.specifications).length - 1
                          ? "border-b"
                          : ""
                      }`}
                    >
                      <div className="w-1/3 bg-gray-50 px-4 py-3 font-medium">
                        {key}
                      </div>
                      <div className="w-2/3 px-4 py-3 text-gray-600">
                        {value}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
