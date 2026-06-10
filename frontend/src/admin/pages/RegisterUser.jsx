
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, ShieldCheck, Phone, 
  ChevronDown, Globe, Eye, EyeOff, Gift 
} from 'lucide-react';

const RegistrationPortal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    collegeName: '',
    branch: '',
    degreeType: '', 
    cgpa: '',
    couponCode: '',
    enrollmentType: 'Training', 
    mode: 'Online', 
    passOutYear: '', 
    courseSpecialization: '' 
  });

  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/students/");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'name') {
      // Only letters and spaces, max 30 chars
      newValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 30);
    } else if (name === 'phone') {
      // Only numbers, max 10 digits
      newValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'cgpa') {
      // Only numbers and one decimal allowed, max 4 chars
      newValue = value.replace(/[^0-9.]/g, '');
      if ((newValue.match(/\./g) || []).length > 1) {
        newValue = newValue.replace(/\.$/, '');
      }
      newValue = newValue.slice(0, 4);
    } else if (name === 'email') {
      // Must start with a letter, prevents consecutive dots
      newValue = value.replace(/^[^a-zA-Z]+/, '').replace(/\.\./g, '.');
    } else if (name === 'degreeType') {
      // No numbers allowed
      newValue = value.replace(/[0-9]/g, '');
    } else if (name === 'passOutYear') {
      // Only numbers allowed, exactly 4 max
      newValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'courseSpecialization') {
      // Only letters and spaces allowed
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Instantly clear the specific error when the user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 1. Personal Details
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "invalid mail";
    }

    if (!formData.phone || formData.phone.length !== 10 || !/^[6-9]/.test(formData.phone)) {
      newErrors.phone = "invalid mobile number";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Min 8 chars, 1 uppercase, 1 number, 1 special char";
    }

    // 2. Academic Details
    if (!formData.collegeName.trim()) newErrors.collegeName = "Required";
    if (!formData.branch.trim()) newErrors.branch = "Required";
    if (!formData.degreeType.trim()) newErrors.degreeType = "Required";
    
    if (!formData.passOutYear.trim()) {
      newErrors.passOutYear = "Required";
    } else if (formData.passOutYear.length !== 4) {
      newErrors.passOutYear = "invalid";
    }
    
    if (!formData.cgpa) {
      newErrors.cgpa = "Required";
    } else {
      const cgpaNum = parseFloat(formData.cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        newErrors.cgpa = "0 to 10 only";
      }
    }

    // 3. Enrollment Details
    if (!formData.enrollmentType.trim()) newErrors.enrollmentType = "Required";
    if (!formData.mode.trim()) newErrors.mode = "Required";
    if (!formData.courseSpecialization.trim()) newErrors.courseSpecialization = "Required";

    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      alert("⚠️ Please fix the errors and fill all mandatory fields before submitting.");
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return; 

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register_student/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        const savedStudent = { ...formData, id: data.id };
        setUsers([data, ...users]);
        alert("Student onboarded successfully! 🚀 Redirecting to payment...");
        
        setFormData({ 
          name: '', phone: '', email: '', password: '', collegeName: '', 
          branch: '', degreeType: '', cgpa: '', couponCode: '', 
          enrollmentType: 'Training', mode: 'Online', passOutYear: '', courseSpecialization: ''
        });
        setErrors({}); 
        localStorage.setItem('studentData', JSON.stringify(savedStudent));

        navigate('/admin/payment', { 
          state: { 
            studentDetails: savedStudent, 
            studentId: data.id 
          } 
        });
        
      } else {
        alert("Registration failed: " + JSON.stringify(data));
      }
    } catch (err) {
      alert("Connection error. Is the server running?");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 lg:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-indigo-200 shadow-lg">
              <ShieldCheck className="text-white" size={38} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">Tx<span className="text-indigo-600">Hub</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Control Panel</p>
            </div>
          </div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <div className="text-center">
              <p className="text-xl font-black text-indigo-600">{users.length}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Total Students</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="text-center">
              <p className="text-xl font-black text-emerald-500">Live</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Server Status</p>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* FORM SECTION */}
          <div className="xl:col-span-5 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white p-6 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-800">Student Entry</h2>
              <p className="text-slate-400 text-sm font-medium">Fill in the academic details below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="name" className="cursor-pointer select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Full Name <span className="text-red-500">*</span></label>
                  <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" className={`caret-indigo-600 w-full bg-slate-50 border ${errors.name ? 'border-red-400' : 'border-slate-100'} rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-medium`} />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="email" className="cursor-pointer select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Email <span className="text-red-500">*</span></label>
                    <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@domain.com" className={`caret-indigo-600 w-full bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm`} />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.email}</p>}
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="phone" className="cursor-pointer select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Phone <span className="text-red-500">*</span></label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                       <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className={`caret-indigo-600 w-full bg-slate-50 border ${errors.phone ? 'border-red-400' : 'border-slate-100'} rounded-2xl p-4 pl-10 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm`} />
                    </div>
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.phone}</p>}
                  </div>
                </div>

                <div className="relative">
                    <label htmlFor="password" className="cursor-pointer select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                       
                        className={`caret-indigo-600 w-full bg-slate-50 border ${errors.password ? 'border-red-400' : 'border-slate-100'} rounded-2xl p-4 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm`} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold leading-tight">{errors.password}</p>}
                </div>
              </div>

              {/* Academic Details */}
              <div className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="collegeName" className="cursor-pointer select-none text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">College Name <span className="text-red-500">*</span></label>
                    <input id="collegeName" type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="CollegeName" className={`caret-indigo-600 w-full bg-white border ${errors.collegeName ? 'border-red-400' : 'border-indigo-100'} rounded-xl p-3 outline-none text-sm`} />
                    {errors.collegeName && <p className="text-red-500 text-[9px] mt-1 ml-1 font-bold">{errors.collegeName}</p>}
                  </div>
                  <div className="relative">
                    <label htmlFor="branch" className="cursor-pointer select-none text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">Branch <span className="text-red-500">*</span></label>
                    <input id="branch" type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. CSE" className={`caret-indigo-600 w-full bg-white border ${errors.branch ? 'border-red-400' : 'border-indigo-100'} rounded-xl p-3 outline-none text-sm`} />
                    {errors.branch && <p className="text-red-500 text-[9px] mt-1 ml-1 font-bold">{errors.branch}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 items-start">
                  <div className="relative">
                    <label htmlFor="degreeType" className="cursor-pointer select-none text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">Degree <span className="text-red-500">*</span></label>
                    <input id="degreeType" type="text" name="degreeType" value={formData.degreeType} onChange={handleChange} placeholder="e.g. B.Tech" className={`caret-indigo-600 w-full bg-white border ${errors.degreeType ? 'border-red-400' : 'border-indigo-100'} rounded-xl p-3 outline-none text-xs font-bold`} />
                    {errors.degreeType && <p className="text-red-500 text-[9px] mt-1 ml-1 font-bold">{errors.degreeType}</p>}
                  </div>

                  <div className="relative">
                    <label htmlFor="cgpa" className="cursor-pointer select-none text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">CGPA <span className="text-red-500">*</span></label>
                    <input id="cgpa" type="text" name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="0.0" className={`caret-indigo-600 w-full bg-white border ${errors.cgpa ? 'border-red-400' : 'border-indigo-100'} rounded-xl p-3 outline-none text-xs font-bold text-center`} />
                    {errors.cgpa && <p className="text-red-500 text-[9px] mt-1 ml-1 font-bold leading-tight">{errors.cgpa}</p>}
                  </div>

                  <div className="relative">
                    <label htmlFor="passOutYear" className="cursor-pointer select-none text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">Pass Out <span className="text-red-500">*</span></label>
                    <input id="passOutYear" type="text" name="passOutYear" value={formData.passOutYear} onChange={handleChange} placeholder="e.g. 2026" className={`caret-indigo-600 w-full bg-white border ${errors.passOutYear ? 'border-red-400' : 'border-indigo-100'} rounded-xl p-3 outline-none text-xs font-bold`} />
                    {errors.passOutYear && <p className="text-red-500 text-[9px] mt-1 ml-1 font-bold">{errors.passOutYear}</p>}
                  </div>
                </div>
              </div>

              {/* Enrollment Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="enrollmentType" className="cursor-pointer select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Enrollment For <span className="text-red-500">*</span></label>
                    <select id="enrollmentType" name="enrollmentType" value={formData.enrollmentType} onChange={handleChange} className={`caret-indigo-600 w-full bg-slate-50 border ${errors.enrollmentType ? 'border-red-400' : 'border-slate-100'} rounded-2xl p-4 outline-none text-sm font-black text-indigo-600 appearance-none`}>
                      <option value="Training">Training</option>
                      <option value="Internship">Internship</option>
                      <option value="Training+Internship">Training+Internship</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 bottom-5 text-slate-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="mode" className="cursor-pointer select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Mode <span className="text-red-500">*</span></label>
                    <select id="mode" name="mode" value={formData.mode} onChange={handleChange} className={`caret-indigo-600 w-full bg-slate-50 border ${errors.mode ? 'border-red-400' : 'border-slate-100'} rounded-2xl p-4 outline-none text-sm font-black text-indigo-600 appearance-none`}>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 bottom-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="courseSpecialization" className="cursor-pointer select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Course Specialization <span className="text-red-500">*</span></label>
                  <input id="courseSpecialization" type="text" name="courseSpecialization" value={formData.courseSpecialization} onChange={handleChange} placeholder="e.g. Java Full Stack" className={`caret-indigo-600 w-full bg-slate-50 border ${errors.courseSpecialization ? 'border-red-400' : 'border-slate-100'} rounded-2xl p-4 outline-none text-sm font-black text-indigo-600`} />
                  {errors.courseSpecialization && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.courseSpecialization}</p>}
                </div>
              </div>

              {/* Coupon Code */}
              <div className="relative">
                  <label htmlFor="couponCode" className="cursor-pointer select-none text-[10px] font-bold text-emerald-500 uppercase mb-1 block ml-1">Coupon Code</label>
                  <div className="relative">
                    <Gift size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <input id="couponCode" type="text" name="couponCode" value={formData.couponCode} onChange={handleChange} placeholder="SAVE10" className={`caret-indigo-600 w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 pl-10 outline-none text-sm font-bold text-emerald-700 placeholder:text-emerald-300`} />
                  </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4">
                <UserPlus size={20} /> Complete Registration
              </button>
            </form>
          </div>

          {/* REGISTRY SECTION */}
          <div className="xl:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 lg:p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-xl text-slate-800">Registry</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Updates</span>
              </div>
            </div>

            {/* Mobile View */}
            <div className="block lg:hidden p-4 space-y-4">
              {users.length === 0 ? (
                <div className="p-10 text-center text-slate-300 italic">No registrations found.</div>
              ) : (
                users.map((user, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-black text-slate-800 text-sm">{user.name}</span>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">{user.phone}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 uppercase">
                      <div className="bg-white p-2 rounded-xl border border-slate-100">
                        <span className="block text-indigo-400 mb-1">Academics</span>{user.branch}
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-100">
                        <span className="block text-emerald-400 mb-1">Course</span>{user.courseSpecialization || 'N/A'}
                      </div>
                    </div>
                    <div className="flex justify-start gap-3 items-center pt-2">
                      <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{user.mode}</span>
                      <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{user.enrollmentType}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Student Profile</th>
                    <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Academics</th>
                    <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Course</th>
                    <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Type/Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.length === 0 ? (
                    <tr><td colSpan="4" className="p-20 text-center text-slate-300 italic font-medium">No registrations recorded.</td></tr>
                  ) : (
                    users.map((user, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/20 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                              {user.name?.charAt(0)}
                            </div>
                            <div>
                              <span className="block font-black text-slate-800 text-sm mb-1">{user.name}</span>
                              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-tight">{user.phone} | {user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="text-xs font-bold text-slate-700">{user.branch || 'N/A'}</div>
                          <div className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">{user.collegeName || 'N/A'}</div>
                        </td>
                        <td className="p-6">
                           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                             {user.courseSpecialization || 'N/A'}
                           </span>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`px-2 py-1 rounded-md text-[9px] font-black border uppercase ${user.enrollmentType === 'Internship' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                              {user.enrollmentType}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              <Globe size={10} className="inline mr-1 text-slate-400" /> {user.mode}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default RegistrationPortal;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // <-- Added import for navigation
// import {
//   UserPlus, ShieldCheck, Phone, BookOpen, Star,
//   GraduationCap, ChevronDown, Lock, Mail, Gift,
//   Layers, briefcase, Calendar, Cpu, Globe
// } from 'lucide-react';
 
// const RegistrationPortal = () => {
//   const navigate = useNavigate(); // <-- Initialized navigation hook
 
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     password: '',
//     collegeName: '',
//     branch: '',
//     degreeType: 'B.Tech',
//     cgpa: '',
//     couponCode: '',
//     enrollmentType: 'Course',
//     mode: 'Online',
//     passOutYear: '2026',
//     paymentStatus: 'Pending'
//   });
 
//   const [users, setUsers] = useState([]);
 
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch("http://192.168.29.207:8000/api/students/");
//       const data = await res.json();
//       setUsers(data);
//     } catch (err) {
//       console.log("Fetch error:", err);
//     }
//   };
 
//   useEffect(() => {
//     fetchUsers();
//   }, []);
 
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.email || !formData.password || !formData.phone) {
//       return alert("Please complete the required fields (Name, Email, Phone, Password)");
//     }
 
//     try {
//       const response = await fetch("http://192.168.29.207:8000/api/register_student/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();
 
//       if (response.ok) {
//         setUsers([data, ...users]);
//         alert("Student onboarded successfully! 🚀 Redirecting to payment...");
       
//         // Reset form data
//         setFormData({
//           name: '', phone: '', email: '', password: '', collegeName: '',
//           branch: '', degreeType: 'B.Tech', cgpa: '', couponCode: '',
//           enrollmentType: 'Course', mode: 'Online', passOutYear: '2026', paymentStatus: 'Pending'
//         });
 
//         // <-- REDIRECT TO PAYMENT PAGE HERE -->
//         // We are also passing the student data along to the payment page so you can use it there
//         navigate('/payment', { state: {  studentDetails: formData,
//     studentId: data.id} });
       
//       } else {
//         alert("Registration failed: " + JSON.stringify(data));
//       }
//     } catch (err) {
//       alert("Connection error. Is the server running?");
//     }
//   };
 
//   return (
//     <div className="min-h-screen bg-[#F3F4F6] p-4 lg:p-12 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-8">
       
//         <header className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="bg-indigo-600 p-3 rounded-2xl shadow-indigo-200 shadow-lg">
//               <ShieldCheck className="text-white" size={38} />
//             </div>
//             <div>
//               <h1 className="text-2xl font-black tracking-tight text-slate-800">Edu<span className="text-indigo-600">Flow</span></h1>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Control Panel</p>
//             </div>
//           </div>
//           <div className="flex gap-8 mt-4 md:mt-0">
//             <div className="text-center">
//               <p className="text-xl font-black text-indigo-600">{users.length}</p>
//               <p className="text-[9px] font-bold text-slate-400 uppercase">Total Students</p>
//             </div>
//             <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
//             <div className="text-center">
//               <p className="text-xl font-black text-emerald-500">Live</p>
//               <p className="text-[9px] font-bold text-slate-400 uppercase">Server Status</p>
//             </div>
//           </div>
//         </header>
 
//         <main className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         
//           {/* FORM CARD */}
//           <div className="xl:col-span-5 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white p-6 lg:p-10">
//             <div className="mb-8">
//               <h2 className="text-2xl font-black text-slate-800">Student Entry</h2>
//               <p className="text-slate-400 text-sm font-medium">Fill in the academic details below</p>
//             </div>
 
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="space-y-4">
//                 <div className="relative">
//                   <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Full Name</label>
//                   <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-medium" />
//                 </div>
 
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="relative">
//                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Email</label>
//                     <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@domain.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" />
//                   </div>
                 
//                   <div className="relative">
//                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Phone</label>
//                     <div className="relative">
//                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-10 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" />
//                     </div>
//                   </div>
//                 </div>
 
//                 <div className="relative">
//                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Password</label>
//                     <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" />
//                 </div>
//               </div>
 
//               <div className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-50 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="relative">
//                     <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">College Name</label>
//                     <input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="University" className="w-full bg-white border border-indigo-100 rounded-xl p-3 outline-none text-sm" />
//                   </div>
//                   <div className="relative">
//                     <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">Branch</label>
//                     <input name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. CSE" className="w-full bg-white border border-indigo-100 rounded-xl p-3 outline-none text-sm" />
//                   </div>
//                 </div>
 
//                 <div className="grid grid-cols-3 gap-3">
//                   <div className="relative">
//                     <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">Degree</label>
//                     <select name="degreeType" value={formData.degreeType} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-xl p-3 outline-none text-xs font-bold appearance-none">
//                       <option>B.Tech</option><option>B.E</option><option>M.Tech</option><option>BCA</option>
//                     </select>
//                   </div>
//                   <div className="relative">
//                     <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">CGPA</label>
//                     <input name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="0.0" className="w-full bg-white border border-indigo-100 rounded-xl p-3 outline-none text-xs font-bold text-center" />
//                   </div>
//                   <div className="relative">
//                     <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block ml-1">Pass Out</label>
//                     <select name="passOutYear" value={formData.passOutYear} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-xl p-3 outline-none text-xs font-bold appearance-none">
//                       <option>2024</option><option>2025</option><option>2026</option><option>2027</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
 
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="relative">
//                   <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Enrollment For</label>
//                   <select name="enrollmentType" value={formData.enrollmentType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none text-sm font-black text-indigo-600 appearance-none">
//                     <option>Course</option>
//                     <option>Internship</option>
//                     <option>Course+Internship</option>
//                   </select>
//                   <ChevronDown size={16} className="absolute right-4 bottom-5 text-slate-400 pointer-events-none" />
//                 </div>
//                 <div className="relative">
//                   <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Mode</label>
//                   <select name="mode" value={formData.mode} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none text-sm font-black text-indigo-600 appearance-none">
//                     <option value="Online">Online</option>
//                     <option value="Offline">Offline</option>
//                     <option value="Hybrid">Hybrid</option>
//                   </select>
//                   <ChevronDown size={16} className="absolute right-4 bottom-5 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>
 
//               <div className="relative">
//                   <label className="text-[10px] font-bold text-emerald-500 uppercase mb-1 block ml-1">Coupon Code</label>
//                   <div className="relative">
//                     <Gift size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
//                     <input name="couponCode" value={formData.couponCode} onChange={handleChange} placeholder="SAVE10" className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 pl-10 outline-none text-sm font-bold text-emerald-700 placeholder:text-emerald-300" />
//                   </div>
//               </div>
 
//               <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4">
//                 <UserPlus size={20} /> Complete Registration
//               </button>
//             </form>
//           </div>
 
//           {/* REGISTRY SECTION */}
//           <div className="xl:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
//             <div className="p-6 lg:p-8 border-b border-slate-50 flex justify-between items-center">
//               <h3 className="font-black text-xl text-slate-800">Registry</h3>
//               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
//                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
//                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Updates</span>
//               </div>
//             </div>
 
//             {/* MOBILE VIEW: CARDS (Hidden on Large Screens) */}
//             <div className="block lg:hidden p-4 space-y-4">
//               {users.length === 0 ? (
//                 <div className="p-10 text-center text-slate-300 italic">
//                   No registrations found.
//                 </div>
//               ) : (
//                 users.map((user, idx) => (
//                   <div
//                     key={idx}
//                     className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4 shadow-sm"
//                   >
//                     {/* Header: Avatar and Name */}
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg">
//                         {user.name?.charAt(0)}
//                       </div>
//                       <div>
//                         <span className="block font-black text-slate-800 text-sm">
//                           {user.name}
//                         </span>
//                         <span className="block text-[10px] text-slate-400 font-bold uppercase">
//                           {user.phone}
//                         </span>
//                       </div>
//                     </div>
 
//                     {/* Info Grid: Academics & CGPA */}
//                     <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 uppercase">
//                       <div className="bg-white p-2 rounded-xl border border-slate-100">
//                         <span className="block text-indigo-400 mb-1">Academics</span>
//                         {user.branch}
//                       </div>
//                       <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
//                         <span className="block text-indigo-400 mb-1">Score</span>
//                         ⭐ {user.cgpa}
//                       </div>
//                     </div>
 
//                     {/* Footer: Badges */}
//                     <div className="flex justify-between items-center pt-2">
//                       <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
//                         {user.mode}
//                       </span>
//                       <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
//                         {user.enrollmentType}
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
 
//             {/* DESKTOP VIEW: TABLE (Hidden on Mobile) */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-slate-50/50">
//                   <tr>
//                     <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Student Profile</th>
//                     <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Academics</th>
//                     <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Mode</th>
//                     <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Type</th>
//                     <th className="p-6 text-[10px] font-bold uppercase text-slate-400 text-center">Score</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {users.length === 0 ? (
//                     <tr>
//                       <td colSpan="5" className="p-20 text-center text-slate-300 italic font-medium">
//                         No registrations recorded.
//                       </td>
//                     </tr>
//                   ) : (
//                     users.map((user, idx) => (
//                       <tr key={idx} className="hover:bg-indigo-50/20 transition-colors group">
//                         <td className="p-6">
//                           <div className="flex items-center gap-4">
//                             <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
//                               {user.name?.charAt(0)}
//                             </div>
//                             <div>
//                               <span className="block font-black text-slate-800 text-sm mb-1">{user.name}</span>
//                               <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-tight">{user.phone}</span>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-6">
//                           <div className="text-xs font-bold text-slate-700">{user.branch}</div>
//                           <div className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">{user.collegeName}</div>
//                         </td>
//                         <td className="p-6 text-[10px] font-bold text-slate-600">
//                           <Globe size={14} className="inline mr-1 text-indigo-400" /> {user.mode}
//                         </td>
//                         <td className="p-6">
//                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase ${user.enrollmentType === 'Internship' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
//                             {user.enrollmentType}
//                           </span>
//                         </td>
//                         <td className="p-6 text-center">
//                           <div className="inline-flex items-center gap-1 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-black">
//                             <Star size={10} className="fill-amber-400 text-amber-400" /> {user.cgpa}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
 
//         </main>
//       </div>
//     </div>
//   );
// };
 
// export default RegistrationPortal;
 