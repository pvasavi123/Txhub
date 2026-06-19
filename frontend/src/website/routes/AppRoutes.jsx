import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutTXHub from "../components/AboutTXHub";
import Categories from "../components/Categories";
import Modes from "../components/Modes";
import WhyChoose from "../components/WhyChoose";
import Partners from "../components/Partners";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Courses from "../components/Courses";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentStatus from "../pages/PaymentStatus";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Explore from "../pages/Explore";
import Cart from "../pages/Cart";
import CourseDetails from "../pages/CourseDetails";
import ForgotPassword from "../pages/ForgotPassword";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import Events from "../pages/Events";
import AuthModal from "../components/AuthModal";
import ScrollToTop from "../components/ScrollToTop";
import Form from "../components/Form";
import SEO from "../components/SEO";

import { RefreshCcw } from "lucide-react";




const WebsiteLayout = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <ScrollToTop />
      <Navbar />

      {children}

      <Footer />

      {/* Floating Refresh Button */}
      {/* 
      <button
        onClick={handleRefresh}
        className={`fixed bottom-8 left-8 z-[90] p-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl hover:bg-white hover:scale-110 active:scale-95 transition-all group overflow-hidden`}
        title="Refresh Page"
      >
        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors"></div>

        <RefreshCcw
          size={22}
          className={`text-slate-600 group-hover:text-blue-600 transition-all ${
            isRefreshing
              ? "animate-spin"
              : "group-hover:rotate-180 duration-500"
          }`}
        />
      </button> 
      */}
    </>
  );
};

function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <SEO
        description="Master industry-leading skills with TXhub. Explore our expert-led courses and transform your career today."
      />

      <div className="pt-20">
        <Hero />
        <AboutTXHub />
        <Categories />
        <Courses />
        <Modes />
        <WhyChoose />
        <Partners />
        <FAQ />
      </div>
    </div>
  );
}

const AppRoutes = () => {
  return (
    <WebsiteLayout>
      <AuthModal />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/internship" element={<Form />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/my-courses" element={<Navigate to="/student" replace />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />


      </Routes>
    </WebsiteLayout>
  );
};

export default AppRoutes;