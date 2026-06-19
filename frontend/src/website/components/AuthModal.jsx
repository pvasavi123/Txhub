import React, { useState, useContext } from "react";
import { X, Mail, Lock, User, Phone, CheckCircle, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
 
 
const BASE_URL = "http://127.0.0.1:8000";
 
const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, modalView, setModalView } =
    useContext(AuthContext);
  const navigate = useNavigate();
 
  const isLoginView = modalView === "login";
  const toggleView = () =>
    setModalView(isLoginView ? "register" : "login");
 
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
 
  if (!isAuthModalOpen) return null;
 
  const validateField = (name, value, currentForm) => {
    let errMsg = "";
    if (name === "full_name") {
      if (!value.trim()) errMsg = "Full name is required";
      else if (value.trim().length < 3) errMsg = "Name must be at least 3 characters";
    } else if (name === "email") {
      if (!value.trim()) {
        errMsg = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errMsg = "Please enter a valid email address";
      }
    } else if (name === "phone") {
      if (!value.trim()) errMsg = "Phone number is required";
      else if (!/^[6-9]\d{9}$/.test(value)) errMsg = "Enter a valid 10-digit mobile number starting with 6-9";
    } else if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!isLoginView) {
        if (!value) errMsg = "Password is required";
        else if (!passwordRegex.test(value)) errMsg = "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char";
      } else {
        if (!value) errMsg = "Password is required";
      }
    } else if (name === "confirm_password") {
      if (!isLoginView) {
        if (!value) errMsg = "Confirmation is required";
        else if (value !== currentForm.password) errMsg = "Passwords do not match";
      }
    }
    return errMsg;
  };
 
  const handleChange = (e) => {
    let { name, value } = e.target;
 
    if (name === 'full_name') {
      value = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 30);
    } else if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
 
    const newForm = { ...form, [name]: value };
    setForm(newForm);
 
    const errMsg = validateField(name, value, newForm);
    setErrors(prev => {
      const updatedErrors = { ...prev, [name]: errMsg };
      if (!isLoginView && name === 'password' && newForm.confirm_password) {
        updatedErrors.confirm_password = validateField('confirm_password', newForm.confirm_password, newForm);
      }
      return updatedErrors;
    });
  };
 
  const inputStyle = (field) =>
    `w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all text-sm shadow-sm ${errors[field]
      ? "bg-red-50/50 border-red-300 focus:ring-2 focus:ring-red-100 text-red-900 placeholder:text-red-300"
      : "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700"
    }`;
 
  // ✅ MAIN AUTH FUNCTION (LOGIN + REGISTER + ADMIN CHECK)
  const handleAuth = async (e) => {
    e.preventDefault();
 
    let newErrors = {};
    const fieldsToValidate = isLoginView ? ['email', 'password'] : ['full_name', 'email', 'phone', 'password', 'confirm_password'];
 
    fieldsToValidate.forEach(key => {
      const err = validateField(key, form[key], form);
      if (err) newErrors[key] = err;
    });
 
    setErrors(newErrors);
 
    if (Object.keys(newErrors).filter(k => newErrors[k]).length > 0) {
      alert("Please fix the validation errors");
      return;
    }
 
    setLoading(true);
 
    try {
      const endpoint = isLoginView ? "verify/" : "register/";
 
      const payload = isLoginView
        ? { email: form.email, password: form.password }
        : {
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        };
 
      if (!isLoginView && form.password !== form.confirm_password) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }
 
      const response = await fetch(
        `http://127.0.0.1:8000/api/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
 
      const data = await response.json();
 
      if (response.ok) {
        if (isLoginView) {
          const actualUser = data.data || data;
          login(actualUser);
          alert("Login Successful");
          closeAuthModal();
          navigate("/");
        } else {
          alert("Registration Successful! Please login.");
          setModalView("login");
        }
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };
 
  // ✅ GOOGLE LOGIN
 
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={closeAuthModal}
      ></div>
 
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border overflow-hidden">
 
        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100"
        >
          <X size={22} />
        </button>
 
        <div className="p-8 md:p-10">
 
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black">
              {isLoginView ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-500">
              {isLoginView ? "Login to continue" : "Start your journey"}
            </p>
          </div>
 
          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
 
            {!isLoginView && (
              <div className="space-y-1">
                <div className="relative">
                  <User className={`absolute left-4 top-4 ${errors.full_name ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={handleChange}
                    className={inputStyle("full_name")}
                    required
                  />
                </div>
                {errors.full_name && <p className="text-red-500 text-[11px] font-bold ml-2">{errors.full_name}</p>}
              </div>
            )}
 
            <div className="space-y-1">
              <div className="relative">
                <Mail className={`absolute left-4 top-4 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputStyle("email")}
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-[11px] font-bold ml-2">{errors.email}</p>}
            </div>
 
            {!isLoginView && (
              <div className="space-y-1">
                <div className="relative">
                  <Phone className={`absolute left-4 top-4 ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputStyle("phone")}
                    required
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-[11px] font-bold ml-2">{errors.phone}</p>}
              </div>
            )}
 
            <div className="space-y-1">
              <div className="relative">
                <Lock className={`absolute left-4 top-4 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputStyle("password")}
                  required
                />
              </div>
              {errors.password && <p className="text-red-500 text-[11px] font-bold ml-2">{errors.password}</p>}
            </div>
 
            {isLoginView && (
              <div className="flex justify-end pr-2">
                <Link
                  to="/forgot-password"
                  onClick={closeAuthModal}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
 
            {!isLoginView && (
              <div className="space-y-1">
                <div className="relative">
                  <CheckCircle className={`absolute left-4 top-4 ${errors.confirm_password ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    className={inputStyle("confirm_password")}
                    required
                  />
                </div>
                {errors.confirm_password && <p className="text-red-500 text-[11px] font-bold ml-2">{errors.confirm_password}</p>}
              </div>
            )}
 
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLoginView ? "Login" : "Register"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
 
     
 
 
          {/* Toggle */}
          <div className="text-center mt-6 text-sm">
            {isLoginView
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button onClick={toggleView} className="text-blue-600 font-bold">
              {isLoginView ? "Register" : "Login"}
            </button>
          </div>
 
        </div>
      </div>
    </div>
  );
};
 
export default AuthModal;