import { useState } from "react";
import { X, User, Mail, Phone, BookOpen, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Form = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        course: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        let newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Valid email required";
        }

        if (!form.phone.match(/^\d{10}$/)) {
            newErrors.phone = "Phone must be 10 digits";
        }

        if (!form.course.trim()) {
            newErrors.course = "Course is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                courseSpecialization: form.course,
                // Required fields with defaults for this consultation form
                degreeType: "Not Specified",
                passOutYear: "Not Specified",
                enrollmentType: "Training",
                mode: "Offline",
                paymentStatus: "Pending",
                password: "ConsultationRequest@2024", // placeholder
            };

            const response = await fetch("http://127.0.0.1:8000/api/register_student/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Submitted Successfully! Our team will contact you shortly.");
                setForm({ name: "", email: "", phone: "", course: "" });
            } else {
                // If student already registered with this email, still show success
                if (data.email && data.email[0]?.includes("already exists")) {
                    alert("✅ You're already registered! Our team will contact you.");
                    setForm({ name: "", email: "", phone: "", course: "" });
                } else {
                    alert("❌ Error: " + JSON.stringify(data));
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("❌ Server error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
            {/* 🔥 BACKGROUND EFFECTS (LIKE LOGIN PAGE) */}
            <div className="absolute top-[-15%] right-[-15%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-sky-400/20 rounded-full blur-[120px]" />

            {/* 🔥 GLASS OVERLAY */}
            <div className="absolute inset-0 backdrop-blur-[12px] bg-white/40 z-0"></div>

            {/* 🔥 MODAL CARD */}
            <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 relative">
                    {/* ❌ CLOSE BUTTON */}
                    <button
                        onClick={() => navigate("/")}
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
                    >
                        <X size={20} />
                    </button>

                    {/* 🔥 TITLE */}
                    <div className="text-center mb-6 mt-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Request Consultation
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Our team will contact you with full details
                        </p>
                    </div>

                    {/* 🔥 FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name Input */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-3 bg-[#f0f4f8] text-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${errors.name ? 'ring-2 ring-red-400' : ''}`}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                        </div>

                        {/* Email Input */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-3 bg-[#f0f4f8] text-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${errors.email ? 'ring-2 ring-red-400' : ''}`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                        </div>

                        {/* Phone Input */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-3 bg-[#f0f4f8] text-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${errors.phone ? 'ring-2 ring-red-400' : ''}`}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                        </div>

                        {/* Course Input */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BookOpen size={18} className="text-gray-400" />
                                </div>
                                <select
                                    name="course"
                                    value={form.course}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-3 bg-[#f0f4f8] text-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${errors.course ? "ring-2 ring-red-400" : ""
                                        }`}
                                >
                                    <option value="">Select Course</option>

                                    {/* 🚀 Full Stack Programs */}
                                    <optgroup label="Full Stack Programs">
                                        <option value="MERN Stack Development">MERN Stack Development</option>
                                        <option value="Java Full Stack Development">Java Full Stack Development</option>
                                        <option value="Python Full Stack Development">Python Full Stack Development</option>
                                        <option value=".NET Full Stack Development">.NET Full Stack Development</option>
                                    </optgroup>

                                    {/* 💻 Development */}
                                    <optgroup label="Development">
                                        <option value="Frontend Development">Frontend Development</option>
                                        <option value="Backend Development">Backend Development</option>
                                        <option value="Java Development">Java Development</option>
                                        <option value="Python Development">Python Development</option>
                                    </optgroup>

                                    {/* 🤖 AI & Data */}
                                    <optgroup label="AI & Data">
                                        <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Data Analytics">Data Analytics</option>
                                    </optgroup>

                                    {/* 🧪 Testing */}
                                    <optgroup label="Testing">
                                        <option value="Software Testing (Manual)">Manual Testing</option>
                                        <option value="Automation Testing">Automation Testing</option>
                                        <option value="API Testing">API Testing</option>
                                        <option value="QA Engineering">QA Engineering</option>
                                    </optgroup>

                                    {/* ⚙️ Others */}
                                    <optgroup label="Other Courses">
                                        <option value="DevOps">DevOps</option>
                                        <option value="UI/UX Design">UI/UX Design</option>
                                        <option value="Cyber Security">Cyber Security</option>
                                        <option value="Cloud Computing (AWS/Azure)">Cloud Computing (AWS/Azure)</option>
                                        <option value="Other">Other</option>
                                    </optgroup>

                                </select>
                            </div>
                            {errors.course && <p className="text-red-500 text-xs mt-1 ml-1">{errors.course}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-[#2563eb] text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition mt-4 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Request Consultation"}
                            {!isSubmitting && <Send size={16} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Form;