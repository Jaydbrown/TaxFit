import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import Button from "@/components/common/Button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [Page, CurrentPage] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Find Attorney", path: "/find-attorney" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 rounded-r-full rounded-l-full ${isScrolled ? " " : " "}`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 rounded-r-full rounded-l-full">
        <div className="flex items-center justify-between h-20 rounded-r-full rounded-l-full">
          {/* Logo */}
          <div className="flex items-center gap-3 group bg-opacity-10 border rounded-full p-2">
            <Link to="/">
              <img
                src="/public/images/Logo-3.png"
                alt="Tax-FIT logo"
                className="w-25 h-10"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-2 bg-opacity-10 border border-100 rounded-full p-1 w-25 h-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm uppercase tracking-wider text-gray-700 hover:text-primary-600 font-light px-4 py-2 rounded-full hover:bg-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div
                className="relative bg-gray-100 rounded-full p-1"
                ref={userMenuRef}
              >
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-white rounded-full transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {" "}
                      {user.fullName?.charAt(0).toUpperCase()}{" "}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.fullName}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.userType}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-xl border border-gray-200 py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-light"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-light"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-light"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-light"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-full p-1">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm uppercase tracking-wider font-light rounded-full"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-secondary-900 hover:bg-secondary-800 text-white text-sm uppercase tracking-wider rounded-full"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-sm uppercase tracking-wider text-gray-700 hover:text-primary-600 font-light py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-secondary-900 hover:bg-secondary-800 text-white"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
