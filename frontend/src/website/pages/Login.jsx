import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, X, Eye, EyeOff } from "lucide-react";
 
import { toast } from "react-hot-toast";
 
const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
 
  // Redirect already logged-in users to home
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const [loading, setLoading] = useState(false);
 
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
 
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
 
  // 🔥 VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {};
 
    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
 
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
 
    setErrors(newErrors);
 
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors in the form");
    }
 
    return Object.keys(newErrors).length === 0;
  };
 
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    // Clear error for this field as user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!validate()) return;
 
    setLoading(true);
 
    try {
      const response = await fetch("http://127.0.0.1:8000/api/verify/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });
 
      const data = await response.json();
 
      if (response.ok) {
        toast.success("Login Successful! Welcome back.");
        const actualUser = data.data || data;
        login({ ...actualUser, isAdmin: data.type === 'admin' });
        if (data.type === 'admin') {
          window.location.href = "http://localhost:5174/admin";
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.error || "Login failed. Please check your credentials.");
      }
 
    } catch (error) {
      console.log(error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
 
  // 🔥 Google Login
  // const handleGoogleSuccess = async (credentialResponse) => {
  //   setLoading(true);
 
  //   try {
  //     const res = await fetch("http://127.0.0.1:8000/api/auth/google/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         access_token: credentialResponse.credential,
  //       }),
  //     });
 
  //     const data = await res.json();
 
  //     if (res.ok) {
  //       toast.success("Login Successful!");
  //       const actualUser = data.data || data;
  //       login(actualUser);
  //       navigate("/");
  //     } else {
  //       toast.error(data.error || "Google Login failed");
  //     }
 
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Server connection error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
 
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
 
      {/* Background Depth Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-300/20 rounded-full blur-[120px]" />
 
      {/* Blurred Overlay Backdrop */}
      <div className="absolute inset-0 backdrop-blur-[8px] bg-white/30 z-0"></div>
 
      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100/50 relative">
 
          {/* Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
 
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-2">
              Sign in to access your dashboard
            </p>
          </div>
 
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
 
            {/* Email Address */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all font-medium border ${errors.email
                    ? 'bg-red-50/50 border-red-200 focus:ring-red-500/10 text-red-900 placeholder:text-red-300'
                    : 'bg-gray-100/80 border-transparent focus:ring-blue-500/20 focus:bg-white text-gray-700 placeholder:text-gray-400'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-top-1">
                  {errors.email}
                </p>
              )}
            </div>
 
            {/* Password */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl outline-none transition-all font-medium border ${errors.password
                    ? 'bg-red-50/50 border-red-200 focus:ring-red-500/10 text-red-900 placeholder:text-red-300'
                    : 'bg-gray-100/80 border-transparent focus:ring-blue-500/20 focus:bg-white text-gray-700 placeholder:text-gray-400'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100/50 rounded-lg transition-all"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-blue-600" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-top-1">
                  {errors.password}
                </p>
              )}
            </div>
 
            {/* Forgot Password */}
            <div className="flex justify-end pr-2">
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
 
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
 
 
          {/* Register Redirect */}
          <p className="text-center text-sm text-gray-500 mt-8 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline transition-all underline-offset-4">
              Register Now
            </Link>
          </p>
 
        </div>
 
        <p className="text-center mt-6 text-xs text-gray-400 font-medium">
          Safe & Secure Login
        </p>
 
      </div>
    </div>
  );
};
 
export default Login;