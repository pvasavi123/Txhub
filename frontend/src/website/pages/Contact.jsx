import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
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
import contactimage from "../assets/contactimage.png";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@txhub.in",
    sub: "We reply within 24 hours",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    border: "border-blue-100",
    hoverGlow: "hover:shadow-blue-200/60",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 9676507387",
    sub: "Mon–Sat, 9 AM to 6 PM IST",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    border: "border-blue-100",
    hoverGlow: "hover:shadow-blue-200/60",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Hyderabad, Telangana",
    sub: "India — 500081",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    border: "border-blue-100",
    hoverGlow: "hover:shadow-blue-200/60",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sat",
    sub: "9:00 AM – 6:00 PM IST",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-500",
    border: "border-cyan-100",
    hoverGlow: "hover:shadow-cyan-200/60",
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

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* floating keyframe helper */
const floatAnim = {
  y: [0, -10, 0],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

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

  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-80px" });

  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-80px" });

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
      const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          course: form.course,
          message: form.message,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", course: "", message: "" });
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
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: "480px" }}>

        {/* Background image with subtle zoom-in on mount */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={contactimage}
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020b2a]/85 via-[#020b2a]/50 to-transparent" />
        </motion.div>

        {/* Animated floating light orbs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 left-32 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-44">

          {/* Breadcrumb */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex items-center gap-1.5 text-blue-200 text-sm mb-6 font-medium"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-blue-300" />
            <span className="text-white font-bold">Contact Us</span>
          </motion.div>

          {/* Left-aligned text */}
          <div className="max-w-lg">
            {/* Badge */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
              custom={1}
              className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-1.5 text-white/90 text-xs font-bold uppercase tracking-widest mb-5 backdrop-blur-sm bg-white/5"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <MessageSquare size={12} />
              </motion.span>
              Get In Touch
            </motion.div>

            {/* Heading — word by word stagger */}
            <div className="mb-5 overflow-hidden">
              <motion.h1
                className="text-5xl md:text-6xl font-black text-white leading-tight"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                We're Here to{" "}
                <motion.span
                  className="text-[#5b9cf6] inline-block"
                  animate={{ textShadow: ["0 0 0px #5b9cf6", "0 0 20px #5b9cf6aa", "0 0 0px #5b9cf6"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Help
                </motion.span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="text-blue-100 text-base max-w-md font-medium leading-relaxed"
            >
              Have a question about a course, need support, or just want to say
              hi? Our team is always ready to assist you.
            </motion.p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FORM SECTION
      ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto px-6 -mt-28 relative z-10 mb-16"
      >
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-blue-900/10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-2 text-center"
          >
            Send a Message
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.45 }}
            className="text-3xl md:text-4xl font-black text-slate-800 mb-10 text-center"
          >
            How can we help you?
          </motion.h2>

          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── Success State ── */
              <motion.div
                key="success"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <CheckCircle className="text-blue-500" size={48} />
                  </motion.div>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-black text-slate-800 mb-3"
                >
                  Message Sent Successfully!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-500 font-medium max-w-sm mb-8"
                >
                  Thanks for reaching out! We've received your message and will
                  get back to you within 24 hours.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", phone: "", course: "", message: "" });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-200 transition-all"
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              /* ── Form ── */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Row 1 */}
                <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wide">
                      Your Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
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
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
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
                </motion.div>

                {/* Row 2 */}
                <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Phone size={18} />
                      </div>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wide">
                      Related Course
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
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
                </motion.div>

                {/* Message */}
                <motion.div variants={fadeUp}>
                  <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wide">
                    Your Message *
                  </label>
                  <div className="relative group">
                    <div className="absolute top-4 left-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
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
                </motion.div>

                {/* Submit button */}
                <motion.div variants={fadeUp}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!loading ? { scale: 0.97 } : {}}
                    className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-black text-sm shadow-xl shadow-blue-200 transition-shadow flex items-center justify-center gap-2 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {/* Shimmer overlay */}
                    {!loading && (
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                      />
                    )}
                    <motion.span
                      animate={loading ? { rotate: 360 } : { rotate: 0 }}
                      transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                    >
                      <Send size={18} />
                    </motion.span>
                    {loading ? "Sending..." : "Send Message"}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════
          CONTACT INFO CARDS
      ═══════════════════════════════════════ */}
      <div ref={cardsRef} className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {contactInfo.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariant}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(59,130,246,0.15)" }}
                className={`bg-white rounded-[1.5rem] p-6 border ${item.border} shadow-xl shadow-slate-200/40 transition-shadow duration-300 cursor-default`}
              >
                <motion.div
                  className={`p-4 rounded-xl ${item.bg} w-fit mb-5`}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon size={24} className={item.iconColor} />
                </motion.div>
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
      </div>

      {/* ═══════════════════════════════════════
          FAQ + SOCIAL SECTION
      ═══════════════════════════════════════ */}
      <div ref={faqRef} className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={faqInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/30"
          >
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-2">
              FAQ
            </p>
            <h2 className="text-2xl font-black text-slate-800 mb-8">
              Common Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={faqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                  className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-700">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 90 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronRight
                        size={18}
                        className={`text-slate-400 shrink-0 ml-3 ${openFaq === i ? "text-blue-500" : ""}`}
                      />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-sm text-slate-500 font-medium leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={faqInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl shadow-slate-900/20"
          >
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
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={faqInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 p-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm transition-colors duration-300 ${color} hover:border-transparent cursor-pointer`}
                >
                  <motion.span
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon size={20} />
                  </motion.span>
                  {label}
                </motion.a>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Follow our social channels to get the latest updates on new
                courses, special offers, and student success stories.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
