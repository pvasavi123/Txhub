import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, Settings,
  LogOut, Menu, X, Bell, ChevronRight, Video, Layers, UserCheck, BookOpen, Award, ClipboardList
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { newCount } = useAdmin();

  const logout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={22} /> },
    { name: 'Users List', path: '/admin/users', icon: <Users size={22} />, badge: newCount > 0 ? newCount : null },
    { name: 'Batches', path: '/admin/batches', icon: <Layers size={22} /> },
    { name: 'Mentors', path: '/admin/mentors', icon: <UserCheck size={22} /> },
    { name: 'Courses', path: '/admin/courses', icon: <BookOpen size={22} /> },
    { name: 'Certifications', path: '/admin/certifications', icon: <Award size={22} /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <ClipboardList size={22} /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* --- 1. PREMIUM MOBILE NAVIGATION (Pixel View) --- */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[100] px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 bg-indigo-100 text-indigo-600 font-bold rounded-xl text-lg">
            TX
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Admin Pro</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <button className="p-2 text-slate-400 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button> */}
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
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)} // Closes menu on click
                  className={`flex items-center justify-between p-4 rounded-3xl transition-all duration-300 active:scale-95 ${isActive
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                    : 'bg-slate-50/80 text-slate-600'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${isActive ? 'text-white' : 'text-indigo-500'}`}>{item.icon}</div>
                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-indigo-600' : 'bg-rose-500 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <Link
              to="/admin/settings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 border border-white shadow-sm">A</div>
                <div className="flex flex-col text-left">
                  <span className="font-black text-xs text-slate-800 uppercase tracking-widest"> Admin</span>
                  <span className="text-[9px] font-bold text-slate-400">Super User</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </Link>

            <button
              onClick={() => { logout(); setIsMenuOpen(false); }}
              className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-rose-50 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
              <LogOut size={18} /> Logout Session
            </button>
          </div>
        </div>
      </nav>


      {/* --- 2. DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 h-screen sticky top-0 p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-col">
        <div className="flex flex-col gap-2 px-2 mb-10">
          <div className="flex items-center justify-center h-14 w-14 bg-indigo-100 text-indigo-600 font-bold rounded-xl text-xl self-start">
            TX
          </div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Admin Pro</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && !isActive && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white items-center justify-center font-black border-2 border-white">
                        {item.badge}
                      </span>
                    </span>
                  )}
                </div>
                {item.name}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                {!isActive && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-slate-300" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 space-y-4 border-t border-slate-50 text-left">
          <Link to="/admin/settings" className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black shadow-sm">A</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-slate-800 truncate">Admin</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Super User</p>
            </div>
            <Settings size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
          </Link>

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