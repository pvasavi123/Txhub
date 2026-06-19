import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, Phone, Lock, ArrowRight, X, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
 
const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
 
  const [loading, setLoading] = useState(false);
 
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: ""
  });
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
 
  const validateField = (name, value, currentForm) => {
    let errMsg = "";
    if (name === "full_name") {
      if (!value.trim()) errMsg = "Full name is required";
      else if (value.trim().length < 3) errMsg = "Name must be at least 3 characters";
    } else if (name === "email") {
      if (!value.trim()) errMsg = "Email address is required";
      // else if (!/^[^\s@]+@gmail\.com$/.test(value)) errMsg = "Email must end with @gmail.com , admin.org";
      else if (!/^[^\s@]+@(gmail\.com|admin\.org)$/.test(value)) errMsg = "Email must end with @gmail.com or @admin.org";
    } else if (name === "phone") {
      if (!value.trim()) errMsg = "Phone number is required";
      else if (!/^[6-9]\d{9}$/.test(value)) errMsg = "Enter a valid 10-digit mobile number starting with 6-9";
    } else if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!value) errMsg = "Password is required";
      else if (!passwordRegex.test(value)) errMsg = "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char";
    } else if (name === "confirm_password") {
      if (!value) errMsg = "Confirmation is required";
      else if (value !== currentForm.password) errMsg = "Passwords do not match";
    }
    return errMsg;
  };
 
  // 🔥 VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {};
 
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key], form);
      if (err) newErrors[key] = err;
    });
 
    setErrors(newErrors);
 
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the validation errors");
    }
 
    return Object.keys(newErrors).length === 0;
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
      if (name === 'password' && newForm.confirm_password) {
        updatedErrors.confirm_password = validateField('confirm_password', newForm.confirm_password, newForm);
      }
      return updatedErrors;
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!validate()) return;
 
    setLoading(true);
 
    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
 
      const data = await res.json();
 
      if (res.ok) {
        toast.success("Registration Successful! Redirecting to login...");
        if (form.email.toLowerCase().endsWith("@admin.org")) {
          setTimeout(() => {
            window.location.href = "http://localhost:5174/login";
          }, 1500);
        } else {
          login(data.data || data);
          setTimeout(() => navigate("/login"), 1500);
        }
      } else {
        toast.error(data.error || "Registration failed. Email might already exist.");
      }
 
    } catch {
      toast.error("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  const inputStyle = (field) =>
    `w-full pl-12 pr-12 py-3.5 rounded-xl border transition-all text-sm shadow-sm outline-none ${errors[field]
      ? "bg-red-50/50 border-red-300 focus:ring-4 focus:ring-red-100 text-red-900 placeholder:text-red-300"
      : "bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-gray-700 placeholder:text-gray-400"
    }`;
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100">
 
      <div className="w-full max-w-md px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl">
 
          {/* Close */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 right-6 text-gray-400"
          >
            <X size={20} />
          </button>
 
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-blue-600">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm">
              Start your journey 🚀
            </p>
          </div>
 
          <form onSubmit={handleSubmit} className="space-y-4">
 
            {/* Full Name */}
            <div className="space-y-1">
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.full_name ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input
                  name="full_name"
                  placeholder="Full Name"
                  value={form.full_name}
                  onChange={handleChange}
                  className={inputStyle("full_name")}
                />
              </div>
              {errors.full_name && <p className="text-red-500 text-[11px] font-bold ml-2 animate-in fade-in slide-in-from-top-1">{errors.full_name}</p>}
            </div>
 
            {/* Email */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputStyle("email")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[11px] font-bold ml-2 animate-in fade-in slide-in-from-top-1">{errors.email}</p>}
            </div>
 
            {/* Phone */}
            <div className="space-y-1">
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputStyle("phone")}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-[11px] font-bold ml-2 animate-in fade-in slide-in-from-top-1">{errors.phone}</p>}
            </div>
 
            {/* Password */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputStyle("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-lg transition-all"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-blue-600" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[11px] font-bold ml-2 animate-in fade-in slide-in-from-top-1">{errors.password}</p>}
            </div>
 
            {/* Confirm */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.confirm_password ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className={inputStyle("confirm_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-lg transition-all"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-blue-600" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirm_password && <p className="text-red-500 text-[11px] font-bold ml-2 animate-in fade-in slide-in-from-top-1">{errors.confirm_password}</p>}
            </div>
 
            {/* Submit */}
            <button
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold
              bg-gradient-to-r from-blue-600 to-blue-600
              hover:from-blue-700 hover:to-blue-700
              transition-all flex justify-center items-center gap-2"
            >
              {loading ? "Creating..." : <>Create Account <ArrowRight size={18} /></>}
            </button>
 
          </form>
 
 
 
 
 
          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
 
        </div>
      </div>
    </div>
  );
};
 
export default Register;