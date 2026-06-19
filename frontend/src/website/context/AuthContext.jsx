import React, { createContext, useState, useEffect } from "react";
 
export const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("user") ? true : false;
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return parsed?.data ? parsed.data : parsed;
      } catch (err) {
        console.error("Failed to parse saved user:", err);
        localStorage.removeItem("user");
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalView, setModalView] = useState("login"); // 'login' or 'register'
 
  const login = (userData) => {
    // Robust unwrapping for Django Response objects or raw user objects
    const actualUser = userData?.data ? userData.data : userData;
   
    // Ensure we are saving a clean user object to localStorage
    localStorage.setItem("user", JSON.stringify(actualUser));
    setUser(actualUser);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };
 
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = "/";
  };
 
  const openAuthModal = (view = "login") => {
    setModalView(view);
    setIsAuthModalOpen(true);
  };
 
  const closeAuthModal = () => setIsAuthModalOpen(false);
 
  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      login,
      logout,
      isAuthModalOpen,
      modalView,
      setModalView,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};