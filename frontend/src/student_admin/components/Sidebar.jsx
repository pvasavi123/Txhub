import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen, ClipboardList, Award, User, Notebook,
  LogOut, Menu, X, ChevronRight, Settings
} from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';
import logo1 from "../../website/assets/logo1.png";

const Sidebar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { name: 'My Courses', path: '/student', icon: <BookOpen size={22} /> },
    { name: 'Assignments', path: '/student/assignments', icon: <ClipboardList size={22} /> },
    { name: 'Certificates', path: '/student/certificates', icon: <Award size={22} /> },
    { name: 'My Notes', path: '/student/notes', icon: <Notebook size={22} /> },
    { name: 'Profile', path: '/student/profile', icon: <User size={22} /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* --- MOBILE NAVIGATION --- */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[100] px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img 
              src={logo1} 
              alt="TXhub Logo" 
              className="h-10 w-auto object-contain mix-blend-multiply brightness-110 contrast-110" 
            />
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Student Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMenu}
            className={`p-2 rounded-xl transition-all duration-300 ${isMenuOpen ? 'bg-indigo-600 text-white rotate-90 shadow-lg' : 'bg-slate-50 text-slate-600'}`}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* --- MOBILE OVERLAY MENU --- */}
        <div className={`
          absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-2xl p-6 transition-all duration-500 ease-out z-[110]
          ${isMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95 pointer-events-none'}
        `}>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/student');
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-3xl transition-all duration-300 active:scale-95 ${isActive
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                    : 'bg-slate-50/80 text-slate-600 hover:bg-indigo-50'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${isActive ? 'text-white' : 'text-indigo-500'}`}>{item.icon}</div>
                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={() => { logout(); setIsMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 h-screen sticky top-0 p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-col">
        <div className="flex flex-col gap-2 px-2 mb-10">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <img 
              src={logo1} 
              alt="TXhub Logo" 
              className="h-14 w-auto object-contain mix-blend-multiply brightness-110 contrast-110 self-start" 
            />
          </Link>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">Student Portal</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/student');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className="relative">
                  {item.icon}
                </div>
                {item.name}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                {!isActive && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-slate-300" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 space-y-4 border-t border-slate-50 text-left">
          <div className="group flex items-center gap-3 p-3 rounded-2xl bg-slate-50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-slate-800 truncate">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{user?.email || 'Active'}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs font-black uppercase tracking-widest group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
