import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  LogIn, 
  Package, 
  Home,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const categories = [
    { name: 'Electronics', path: '/products?category=electronics' },
    { name: 'Clothing', path: '/products?category=clothing' },
    { name: 'Home & Kitchen', path: '/products?category=home-kitchen' },
    { name: 'Beauty', path: '/products?category=beauty' },
    { name: 'Books', path: '/products?category=books' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleCategoryMenu = () => setIsCategoryMenuOpen(!isCategoryMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-800 flex items-center">
            <Package className="mr-2" />
            <span>LuxeCommerce</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <div className="relative">
              <button
                onClick={toggleCategoryMenu}
                className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
              >
                Categories <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-md py-2 z-50 animate-fade-in">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              All Products
            </Link>
          </nav>

          {/* Search, Cart, and User Links */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </form>
            
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600">
              <ShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="p-2 text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                <User />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 animate-fade-in">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        Signed in as <span className="font-medium">{user.email}</span>
                      </div>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-down">
          <div className="container-custom py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </form>
            
            <nav className="space-y-2">
              <Link 
                to="/" 
                className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <Home className="mr-2" size={18} />
                Home
              </Link>
              <div>
                <button
                  onClick={toggleCategoryMenu}
                  className="flex items-center w-full p-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Package className="mr-2" size={18} />
                  Categories 
                  <ChevronDown className={`ml-auto ${isCategoryMenuOpen ? 'transform rotate-180' : ''}`} size={18} />
                </button>
                {isCategoryMenuOpen && (
                  <div className="ml-6 mt-1 space-y-1 animate-slide-in">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.path}
                        className="block p-2 text-gray-700 rounded-md hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link 
                to="/products" 
                className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <Package className="mr-2" size={18} />
                All Products
              </Link>
              <Link 
                to="/cart" 
                className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <ShoppingCart className="mr-2" size={18} />
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              {user ? (
                <>
                  <div className="p-2 text-sm text-gray-500 border-t border-gray-200">
                    Signed in as <span className="font-medium">{user.email}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/account"
                    className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center w-full p-2 text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <LogIn className="mr-2" size={18} />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;