import React, { useState, useEffect, useContext, useRef } from "react";
import {
  ShoppingCart,
  User,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  Search,
  Menu,
  X,
  Mail,
  Phone,
  LogOut,
  Code,
  Bug,
  Database,
  Brain,
  Server,
  Users,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import logo1 from "../assets/logo1.png";

const categories = [
  { name: "Software Development", icon: Code, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Testing", icon: Bug, color: "text-red-500", bg: "bg-red-50" },
  { name: "Data Science", icon: Database, color: "text-cyan-500", bg: "bg-cyan-50" },
  { name: "AI/ML", icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
  { name: "DevOps", icon: Server, color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Soft Skills", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const exploreRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const { isLoggedIn, logout, user, openAuthModal } = useContext(AuthContext);


  // Poll for Active Live Sessions linked to user's enrolled courses


  const isHome = location.pathname === "/";

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setIsExploreOpen(false);
      }
    };

    if (isProfileMenuOpen || isExploreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen, isExploreOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsExploreOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="fixed top-0 left-0 w-full z-[100]">
      <nav
        className={`h-20 w-full flex items-center justify-between px-6 lg:px-16 transition-all duration-300 ${scrolled || isMenuOpen || !isHome
          ? "bg-white shadow-lg"
          : "bg-transparent"
          }`}
      >
        {/* LOGO */}
        <Link to="/" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}>
          <div className="flex items-center gap-2 group">
            <img
              src={logo1}
              alt="TXhub Logo"
              className="h-16 sm:h-18 w-auto object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply brightness-110 contrast-110 origin-left"
            />
          </div>
        </Link>

        {/* SEARCH BAR (Hidden on mobile) */}
        {/* <div className="hidden md:flex relative items-center w-1/3">
          <Search className="absolute left-4 text-blue-400" size={18} />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full bg-blue-50/50 border border-blue-100 py-2.5 pl-12 pr-4 rounded-2xl text-sm focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-300 transition-all outline-none text-slate-700"
          />
        </div> */}

        {/* ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Blog Link (Desktop) */}
          <Link
            to="/blog"
            onClick={() => window.scrollTo(0, 0)}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            Blog
          </Link>

          {/* Contact Us Link (Desktop) */}
          <Link
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            Contact Us
          </Link>

          {/* Events Link (Desktop) */}
          <Link
            to="/events"
            onClick={() => window.scrollTo(0, 0)}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            Events
          </Link>

          {/* Explore (Desktop Dropdown) */}
<div
  className="hidden lg:block relative"
  ref={exploreRef}
onMouseEnter={() => {
  if (window.innerWidth >= 1024) {
    setIsExploreOpen(true);
  }
}}

>
  <div
    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
      isExploreOpen
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
        : "bg-blue-50 text-slate-600 hover:bg-blue-100"
    }`}
  >
    {/* ✅ TEXT CLICK → NAVIGATE */}
    <span
      onClick={(e) => {
         e.stopPropagation(); 
        navigate("/explore");
        window.scrollTo(0, 0);
      }}
      className="flex items-center gap-2 cursor-pointer"
    >
      <LayoutGrid size={18} />
      Explore
    </span>

    {/* ✅ ARROW CLICK → DROPDOWN */}
    <span
      onClick={(e) => {
        e.stopPropagation();
        setIsExploreOpen(!isExploreOpen);
      }}
      className="cursor-pointer"
    >
      <ChevronDown
        size={14}
        className={`transition-transform ${
          isExploreOpen ? "rotate-180" : ""
        }`}
      />
    </span>
  </div>

            {/* Desktop Dropdown Menu */}
            {isExploreOpen && (
  <div
    className="absolute top-full left-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-3 z-[200]"
    onMouseEnter={() => setIsExploreOpen(true)}
      onMouseLeave={() => {
    setTimeout(() => {
      setIsExploreOpen(false);
    }, 200); // small delay
  }}
    
  >
                <div className="p-4 mb-2">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Course Categories</p>
                </div>
                <div className="grid gap-1">
                  {categories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          navigate("/explore", { state: { category: cat.name } });
                          setIsExploreOpen(false);
                          window.scrollTo(0, 0);
                        }}
                        className="group flex items-center justify-between w-full p-4 rounded-2xl hover:bg-slate-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-none">{cat.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-1 leading-none">Explore premium courses</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    );
                  })}
                </div>

                {/* <div className="mt-2 p-2 border-t border-slate-50">
                  <button
                    onClick={() => { navigate("/explore"); window.scrollTo(0, 0); }}
                    className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                  >
                    View All Courses
                  </button>
                </div> */}

                <div className="mt-2 p-2 border-t border-slate-50">
                  <Link
                    to="/explore"
                    state={{ category: "All" }}   // ✅ IMPORTANT FIX
                    onClick={() => {
                      setIsExploreOpen(false);
                      window.scrollTo(0, 0);
                    }}
                    className="block w-full text-center py-3 bg-blue-100 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                  >
                    VIEW ALL COURSES
                  </Link>
                </div>


              </div>
            )}
          </div>

          {/* Cart */}
          <div
            onClick={() => navigate("/cart")}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-500 cursor-pointer transition-all"
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>

          {/* Auth Actions (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => openAuthModal("login")}
                  className="px-5 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all font-display"
                >
                  Login
                </button>

                <button
                  onClick={() => openAuthModal("register")}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all duration-300 font-display"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => navigate("/student")}
                  className="hidden md:block px-5 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
                >
                  My Courses
                </button>

                {/* Profile Avatar Trigger */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`flex items-center justify-center p-1 rounded-full border-2 transition-all duration-300 ${isProfileMenuOpen
                      ? "border-blue-500 bg-blue-50"
                      : "border-transparent hover:bg-slate-50"
                      }`}
                  >
                    <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md uppercase">
                      {user?.full_name?.charAt(0) ||
                        user?.email?.charAt(0) ||
                        <User size={18} />}
                    </div>
                  </button>

                  {/* Desktop Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-50 p-2 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
                      {/* User Info Section */}
                      <div className="p-5 border-b border-slate-50 mb-2">
                        <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-3">Your Account</p>
                        <h4 className="text-lg font-black text-slate-800 leading-tight mb-4">
                          {user?.full_name || user?.email || "Academic Profile"}
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-colors">
                            <div className="p-1.5 bg-slate-50 rounded-lg"><Mail size={14} /></div>
                            <span className="text-sm font-semibold truncate">{user?.email || "No email available"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-colors">
                            <div className="p-1.5 bg-slate-50 rounded-lg"><Phone size={14} /></div>
                            <span className="text-sm font-semibold">{user?.phone || "No phone added"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid gap-1">
                        <button
                          onClick={() => { navigate("/student"); setIsProfileMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-slate-600 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all text-sm"
                        >
                          <LayoutGrid size={18} />
                          My Courses
                        </button>
                        <button
                          onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 font-black hover:bg-red-50 transition-all text-sm mt-1"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={toggleMenu}
            className="sm:hidden p-2 text-slate-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-20 bg-slate-900/60 backdrop-blur-sm z-[-1] sm:hidden animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)}></div>
        )}
        <div
          className={`absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-2xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden sm:hidden z-[100] ${isMenuOpen ? "max-h-screen opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4"
            }`}
        >
          <div className="px-6 py-8 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { navigate("/explore"); setIsMenuOpen(false); }}
                className="flex items-center gap-4 px-5 py-4 bg-blue-600 text-white rounded-2xl font-black text-base shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                <LayoutGrid size={24} />
                Explore All Courses
              </button>

              {/* Blog / Contact Us / Events (Mobile) */}
              <div className="grid grid-cols-3 gap-2 mt-1">
                <button
                  onClick={() => { navigate("/blog"); setIsMenuOpen(false); window.scrollTo(0, 0); }}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl active:scale-95 transition-all text-center gap-1"
                >
                  <span className="text-xs font-black text-slate-700">Blog</span>
                </button>
                <button
                  onClick={() => { navigate("/contact"); setIsMenuOpen(false); window.scrollTo(0, 0); }}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl active:scale-95 transition-all text-center gap-1"
                >
                  <span className="text-xs font-black text-slate-700">Contact Us</span>
                </button>
                <button
                  onClick={() => { navigate("/events"); setIsMenuOpen(false); window.scrollTo(0, 0); }}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl active:scale-95 transition-all text-center gap-1"
                >
                  <span className="text-xs font-black text-slate-700">Events</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        navigate("/explore", { state: { category: cat.name } });
                        setIsMenuOpen(false);
                        window.scrollTo(0, 0);
                      }}
                      className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl active:scale-95 transition-all text-center gap-2"
                    >
                      <div className={`p-2 rounded-lg ${cat.bg} ${cat.color}`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-black text-slate-700 leading-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {!isLoggedIn ? (
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={() => { openAuthModal("login"); setIsMenuOpen(false); }}
                  className="px-6 py-4 text-base font-black text-blue-600 bg-blue-50/50 rounded-2xl text-center active:scale-95 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { openAuthModal("register"); setIsMenuOpen(false); }}
                  className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-base text-center shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Create Free Account
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 p-6 bg-slate-50/80 rounded-[2rem] border border-slate-100 mb-2">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 text-xl">
                      {user?.full_name?.charAt(0).toUpperCase() || <User size={28} />}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-800 leading-tight">{user?.full_name || "New Student"}</p>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Pro Member</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 mt-1 space-y-3">
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="p-1.5 bg-white rounded-lg"><Mail size={16} /></div>
                      <span className="text-sm font-bold opacity-90 truncate max-w-[200px]">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="p-1.5 bg-white rounded-lg"><Phone size={16} /></div>
                      <span className="text-sm font-bold opacity-90">{user?.phone || "Phone not added"}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => { navigate("/student"); setIsMenuOpen(false); }}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black text-base shadow-sm active:scale-95 transition-all"
                  >
                    <LayoutGrid size={20} />
                    My Learning Dashboard
                  </button>

                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex items-center justify-center gap-3 px-6 py-4 text-base font-black text-red-600 bg-red-50 rounded-2xl active:scale-95 transition-all"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Contact Info */}
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4 px-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Help & Support</p>
              <div className="flex justify-center gap-6 text-slate-400">
                <Mail size={20} />
                <Phone size={20} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;




