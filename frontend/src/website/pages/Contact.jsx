import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  Briefcase,
  MessageCircle,
  Camera,
  PlayCircle,
  User,
  BookOpen,
} from "lucide-react";
import contactBg from "../assets/Contact.png.png";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@txhub.in",
    sub: "We reply within 24 hours",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    border: "border-blue-100",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 9676507387",
    sub: "Mon–Sat, 9 AM to 6 PM IST",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    border: "border-blue-100",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Hyderabad, Telangana",
    sub: "India — 500081",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    border: "border-blue-100",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sat",
    sub: "9:00 AM – 6:00 PM IST",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-500",
    border: "border-cyan-100",
  },
];

const faqs = [
  {
    q: "How do I enroll in a course?",
    a: "Browse our Explore page, pick your course, add to cart and checkout. You'll get instant access after payment.",
  },
  {
    q: "Are the courses available online and offline?",
    a: "Yes! TXhub offers Online, Offline, and Hybrid learning modes depending on the course.",
  },
  {
    q: "Do I get a certificate after completing a course?",
    a: "Absolutely. Every course comes with an industry-recognized completion certificate.",
  },
  {
    q: "What is your refund policy?",
    a: "We offer a 7-day money-back guarantee on all courses. Contact support to initiate a refund.",
  },
];

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.message) {
    alert("Please fill all required fields");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "http://127.0.0.1:8000/api/contact/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          course: form.course,
          message: form.message,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Success:", data);

      setSubmitted(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        course: "",
        message: "",
      });
    } else {
      console.log(data);
      alert("Failed to submit form");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative pt-36 pb-32 px-6 overflow-hidden bg-slate-900">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <img 
            src={contactBg} 
            alt="Contact Us Background" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-900/90 to-blue-900/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent opacity-10" />
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-bold">Contact Us</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-xs font-bold uppercase tracking-widest mb-6">
            <MessageSquare size={12} />
            Get In Touch
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            We're Here to{" "}
            <span className="text-[#8ab4f8]">
              Help
            </span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Have a question about a course, need support, or just want to say
            hi? Our team is always ready to assist you.
          </p>
        </motion.div>
      </div>

      {/* Form Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 -mt-20 relative z-10 mb-16"
      >
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-blue-900/10">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-2 text-center">
            Send a Message
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-10 text-center">
            How can we help you?
          </h2>

          {submitted ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center py-12"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-blue-500" size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">
                Message Sent Successfully!
              </h3>
              <p className="text-slate-500 font-medium max-w-sm mb-8">
                Thanks for reaching out, {form.name}! We've received your message and will get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    course: "",
                    message: "",
                  });
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-black text-sm hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wide">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User size={18} />
                    </div>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Phone size={18} />
                    </div>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wide">
                    Related Course
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <BookOpen size={18} />
                    </div>
                    <select
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="">Select a course</option>
                      <option>React Full Stack Development</option>
                      <option>Java Full Stack Development</option>
                      <option>MERN Stack Crash Course</option>
                      <option>Front End Web Development</option>
                      <option>Python Full Stack</option>
                      <option>Other / General Inquiry</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wide">
                  Your Message *
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none text-slate-400">
                    <MessageSquare size={18} />
                  </div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all resize-none placeholder:text-slate-400 shadow-sm"
                  />
                </div>
              </div>

              <button
  type="submit"
  disabled={loading}
  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-black text-sm shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 transition-all flex items-center justify-center gap-1 active:scale-95 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
>
  <Send size={18} />

  {loading ? "Sending..." : "Send Message"}

</button>
            </form>
          )}
        </div>
      </motion.div>

      {/* Contact Info Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 mb-20"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {contactInfo.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                whileHover={{ y: -5 }}
                key={i}
                className={`bg-white rounded-[1.5rem] p-6 border ${item.border} shadow-xl shadow-slate-200/40 transition-all duration-300`}
              >
                <div className={`p-4 rounded-xl ${item.bg} w-fit mb-5`}>
                  <Icon size={24} className={item.iconColor} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  {item.label}
                </p>
                <p className="text-sm font-black text-slate-800 leading-snug">
                  {item.value}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1.5">
                  {item.sub}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* FAQ + Social Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 pb-24"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* FAQ */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/30">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-2">
              FAQ
            </p>
            <h2 className="text-2xl font-black text-slate-800 mb-8">
              Common Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-700">
                      {faq.q}
                    </span>
                    <ChevronRight
                      size={18}
                      className={`text-slate-400 transition-transform shrink-0 ml-3 ${openFaq === i ? "rotate-90 text-blue-500" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="px-6 pb-5 text-sm text-slate-500 font-medium leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl shadow-slate-900/20">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">
              Follow Us
            </p>
            <h2 className="text-2xl font-black mb-8">Stay Connected</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  Icon: Briefcase,
                  label: "LinkedIn",
                  color: "hover:bg-blue-600 hover:text-white text-slate-300",
                  link: "https://www.linkedin.com/company/114664017/admin/dashboard/",
                },
                {
                  Icon: MessageCircle,
                  label: "Twitter / X",
                  color: "hover:bg-slate-600 hover:text-white text-slate-300",
                  link: "https://x.com/tanvox2025",
                },
                {
                  Icon: Camera,
                  label: "Instagram",
                  color: "hover:bg-pink-600 hover:text-white text-slate-300",
                  link: "https://www.instagram.com/tanvox_technologies?igsh=aXpib2MxdG85cjB1",
                },
                {
                  Icon: PlayCircle,
                  label: "YouTube",
                  color: "hover:bg-red-600 hover:text-white text-slate-300",
                  link: "#",
                },
              ].map(({ Icon, label, color, link }, i) => (
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm transition-colors duration-300 ${color} hover:border-transparent cursor-pointer`}
                >
                  <Icon size={20} />
                  {label}
                </motion.a>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Follow our social channels to get the latest updates on new courses, special offers, and student success stories.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
