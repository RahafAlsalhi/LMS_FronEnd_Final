import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, BookOpen, Star } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const ModernHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "Courses",
      href: "/courses",
      hasDropdown: true,
      dropdownItems: [
        {
          name: "Web Development",
          href: "/courses/web-dev",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          name: "Data Science",
          href: "/courses/data-science",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          name: "Design",
          href: "/courses/design",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          name: "Business",
          href: "/courses/business",
          icon: <BookOpen className="w-4 h-4" />,
        },
      ],
    },
    { name: "Instructors", href: "/instructors" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                LearnHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200 py-2"
                  onMouseEnter={() =>
                    item.hasDropdown && setActiveDropdown(item.name)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span className="font-medium">{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </button>
                {item.hasDropdown && activeDropdown === item.name && (
                  <div
                    className="absolute top-full left-0 mt-2 w-56 bg-slate-800/90 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl py-2"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    // onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.dropdownItems.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        to={dropdownItem.href}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                      >
                        <div className="text-cyan-400">{dropdownItem.icon}</div>
                        <span>{dropdownItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white font-medium"
                >
                  Dashboard
                </Link>

                {user?.role === "admin" && (
                  <>
                    <Link
                      to="/admin/categories"
                      className="text-gray-300 hover:text-white font-medium"
                    >
                      Manage Categories
                    </Link>
                    <Link
                      to="/dashboard"
                      className="text-gray-300 hover:text-white font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  </>
                )}

                {user?.role === "instructor" && (
                  <Link
                    to="/create-course"
                    className="text-gray-300 hover:text-white font-medium"
                  >
                    Create Course
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md rounded-2xl mt-4 border border-white/10">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="block text-gray-300 hover:text-white font-medium py-2"
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className="flex items-center space-x-3 text-sm text-gray-400 hover:text-gray-300 py-1"
                        >
                          <div className="text-cyan-400">
                            {dropdownItem.icon}
                          </div>
                          <span>{dropdownItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 space-y-3 border-t border-white/10">
                {isAuthenticated ? (
                  <>
                    <span className="block text-gray-300">
                      Welcome, {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-300 hover:text-white font-medium py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-gray-300 hover:text-white font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-center font-medium"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ModernHeader;
