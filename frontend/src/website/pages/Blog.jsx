import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronRight,
  Clock,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Search,
} from "lucide-react";

// Importing images
import javaImg from "../assets/java_full.jpg";
import pythonImg from "../assets/python full stack.jpg";
import reactImg from "../assets/react_full.jpg";
import frontendImg from "../assets/fronteend development.jpg";
import mernImg from "../assets/mern stack development.jpg";
import mlImg from "../assets/ml.jpg";
import awsImg from "../assets/aws.jpg";
import dsImg from "../assets/dataScience.jpg";
import blogBg from "../assets/Blog.png.png";

const blogPosts = [
  {
    id: 1,
    title: "Why Java Remains the King of Enterprise Full Stack Development",
    excerpt:
      "Explore how Java combined with Spring Boot and modern frontend frameworks continues to dominate the enterprise software landscape in 2026.",
    category: "Software Development",
    categoryColor: "bg-blue-100 text-blue-600",
    date: "June 10, 2026",
    readTime: "12 min read",
    image: javaImg,
    featured: true,
  },
  {
    id: 2,
    title: "Building Rapid, Scalable Apps with Python Full Stack",
    excerpt:
      "From Django's robustness to FastAPI's incredible speed, discover why Python is the ultimate backend language for modern full stack developers.",
    category: "Software Development",
    categoryColor: "bg-blue-100 text-blue-600",
    date: "June 8, 2026",
    readTime: "10 min read",
    image: pythonImg,
    featured: true,
  },
  {
    id: 3,
    title: "The Evolution of React: Building Full Stack Apps Seamlessly",
    excerpt:
      "React has evolved beyond just the view layer. Learn how Next.js and React server components are blurring the line between frontend and backend.",
    category: "Software Development",
    categoryColor: "bg-cyan-100 text-cyan-600",
    date: "June 5, 2026",
    readTime: "8 min read",
    image: reactImg,
    featured: false,
  },
  {
    id: 4,
    title: "Mastering the Modern Frontend Ecosystem in 2026",
    excerpt:
      "CSS architecture, modern JavaScript frameworks, and component-driven design: your roadmap to becoming a top-tier frontend developer.",
    category: "Software Development",
    categoryColor: "bg-teal-100 text-teal-600",
    date: "June 1, 2026",
    readTime: "6 min read",
    image: frontendImg,
    featured: false,
  },
  {
    id: 5,
    title: "Why the MERN Stack is the Startup Standard",
    excerpt:
      "MongoDB, Express, React, and Node.js. Unpack the stack that empowers startups to build rapidly and scale massively with a single language.",
    category: "Software Development",
    categoryColor: "bg-green-100 text-green-600",
    date: "May 28, 2026",
    readTime: "15 min read",
    image: mernImg,
    featured: false,
  },
  {
    id: 6,
    title: "Demystifying Machine Learning: From Theory to Application",
    excerpt:
      "Cut through the hype. Understand the core algorithms powering today's AI and how you can implement them in your own projects.",
    category: "AI/ML",
    categoryColor: "bg-blue-100 text-blue-600",
    date: "May 25, 2026",
    readTime: "11 min read",
    image: mlImg,
    featured: false,
  },
  {
    id: 7,
    title: "Cloud Computing and DevOps: Automating the Future",
    excerpt:
      "Continuous integration, infrastructure as code, and AWS services. Learn the practices that are revolutionizing software delivery.",
    category: "DevOps",
    categoryColor: "bg-orange-100 text-orange-600",
    date: "May 20, 2026",
    readTime: "9 min read",
    image: awsImg,
    featured: false,
  },
  {
    id: 8,
    title: "The Art and Science of Data Analytics",
    excerpt:
      "Data is the new oil, but only if you know how to refine it. Explore the essential techniques and tools for actionable data science.",
    category: "Data Science",
    categoryColor: "bg-blue-100 text-blue-600",
    date: "May 15, 2026",
    readTime: "7 min read",
    image: dsImg,
    featured: false,
  },
];

const categories = [
  { name: "All", count: 8 },
  { name: "Software Development", count: 5 },
  { name: "AI/ML", count: 1 },
  { name: "Data Science", count: 1 },
  { name: "DevOps", count: 1 },
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
  hidden: { opacity: 0, x: -20 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredRef = useRef(null);
  const featuredInView = useInView(featuredRef, { once: true, margin: "-60px" });

  const regularRef = useRef(null);
  const regularInView = useInView(regularRef, { once: true, margin: "-60px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  const filtered = blogPosts.filter((post) => {
    const matchCat =
      activeCategory === "All" || post.category === activeCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: "500px" }}>

        {/* Background with zoom-in */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={blogBg}
            alt="Blog Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/92 via-blue-900/88 to-blue-900/80" />
        </motion.div>

        {/* Animated floating orbs */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Centered Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-36 pb-28 text-center">

          {/* Breadcrumb */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-8 font-medium tracking-wide"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-white font-bold">Insights</span>
          </motion.div>

          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/15 rounded-full px-5 py-2 text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-lg"
          >
            <motion.span
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
            >
              <TrendingUp size={14} className="text-blue-400" />
            </motion.span>
            Discover Tech Trends
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-8"
          >
            Insights &{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300 inline-block"
              animate={{
                filter: [
                  "drop-shadow(0 0 0px rgba(96,165,250,0))",
                  "drop-shadow(0 0 12px rgba(96,165,250,0.7))",
                  "drop-shadow(0 0 0px rgba(96,165,250,0))",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Perspectives
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="text-blue-200/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Dive into our latest articles on software engineering, artificial
            intelligence, cloud infrastructure, and the future of tech.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 relative max-w-xl mx-auto group"
          >
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10"
              size={20}
            />
            <input
              type="text"
              placeholder="Search articles by topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-5 pl-14 pr-6 text-sm font-medium text-white shadow-2xl outline-none focus:bg-white focus:text-slate-900 focus:border-white placeholder:text-slate-300 transition-all duration-300"
            />
            {/* Shimmer sweep on search bar */}
            <motion.span
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">

        {/* Category Filter */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              variants={{
                hidden: { opacity: 0, y: 16, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, delay: 0.3 + i * 0.07 } },
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.name)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md overflow-hidden ${
                activeCategory === cat.name
                  ? "bg-slate-800 text-white shadow-slate-900/30"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {activeCategory === cat.name && (
                <motion.span
                  layoutId="activePill"
                  className="absolute inset-0 bg-slate-800 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {cat.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Featured Posts */}
        <AnimatePresence mode="wait">
          {featured.length > 0 && (
            <motion.div
              key="featured"
              className="mb-20"
              ref={featuredRef}
            >
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={featuredInView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-8 origin-left"
              >
                <div className="h-px bg-slate-200 flex-1" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Featured Reads
                </p>
                <div className="h-px bg-slate-200 flex-1" />
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {featured.map((post, i) => (
                  <motion.div
                    key={post.id}
                    custom={i}
                    variants={cardVariant}
                    initial="hidden"
                    animate={featuredInView ? "visible" : "hidden"}
                    whileHover={{ y: -10, boxShadow: "0 24px 48px rgba(59,130,246,0.15)" }}
                    className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 transition-shadow duration-500 flex flex-col cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                      {/* Read time badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] font-black text-slate-700 shadow-sm">
                        <Clock size={10} />
                        {post.readTime}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="mb-3">
                        <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${post.categoryColor} shadow-sm`}>
                          {post.category}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 leading-tight mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {post.title}
                      </h2>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">{post.date}</span>
                        <motion.span
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-1 text-xs font-black text-blue-600"
                        >
                          Read more <ArrowRight size={12} />
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Regular Posts Grid */}
        <AnimatePresence mode="wait">
          {regular.length > 0 && (
            <motion.div key="regular" ref={regularRef}>
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={regularInView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-8 origin-left"
              >
                <div className="h-px bg-slate-200 flex-1" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Latest Articles
                </p>
                <div className="h-px bg-slate-200 flex-1" />
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regular.map((post, i) => (
                  <motion.div
                    key={post.id}
                    custom={i}
                    variants={cardVariant}
                    initial="hidden"
                    animate={regularInView ? "visible" : "hidden"}
                    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(59,130,246,0.12)" }}
                    className="group bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/40 transition-shadow duration-400 flex flex-col cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[9px] font-black text-slate-700 shadow-sm">
                        <Clock size={9} />
                        {post.readTime}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-3">
                        <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${post.categoryColor} shadow-sm`}>
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">{post.date}</span>
                        <motion.span
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-1 text-xs font-black text-blue-600"
                        >
                          Read more <ArrowRight size={12} />
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="text-center py-32 bg-white rounded-[2rem] shadow-sm border border-slate-100 mt-10"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <BookOpen className="text-slate-300" size={40} />
              </motion.div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">
                No articles found
              </h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                We couldn't find any articles matching your search criteria. Try
                a different topic or keyword.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Newsletter CTA ── */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 bg-slate-900 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl shadow-slate-900/30"
        >
          {/* Background orbs inside CTA */}
          <motion.div
            className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-blue-900/20" />

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 }}
              className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-4"
            >
              Stay in the loop
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="text-3xl md:text-4xl font-black text-white mb-4"
            >
              Join Our Tech Community
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="text-slate-400 font-medium mb-10 max-w-lg mx-auto leading-relaxed"
            >
              Have any questions, need career guidance, or want to explore our
              programs? Reach out to our team today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45 }}
              className="flex justify-center"
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} className="relative overflow-hidden rounded-2xl">
                <Link
                  to="/contact"
                  className="relative block px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-colors shadow-lg shadow-blue-900/50"
                >
                  {/* Shimmer */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                  />
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;
