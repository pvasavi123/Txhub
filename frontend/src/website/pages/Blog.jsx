import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
    excerpt: "Explore how Java combined with Spring Boot and modern frontend frameworks continues to dominate the enterprise software landscape in 2026.",
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
    excerpt: "From Django's robustness to FastAPI's incredible speed, discover why Python is the ultimate backend language for modern full stack developers.",
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
    excerpt: "React has evolved beyond just the view layer. Learn how Next.js and React server components are blurring the line between frontend and backend.",
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
    excerpt: "CSS architecture, modern JavaScript frameworks, and component-driven design: your roadmap to becoming a top-tier frontend developer.",
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
    excerpt: "MongoDB, Express, React, and Node.js. Unpack the stack that empowers startups to build rapidly and scale massively with a single language.",
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
    excerpt: "Cut through the hype. Understand the core algorithms powering today's AI and how you can implement them in your own projects.",
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
    excerpt: "Continuous integration, infrastructure as code, and AWS services. Learn the practices that are revolutionizing software delivery.",
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
    excerpt: "Data is the new oil, but only if you know how to refine it. Explore the essential techniques and tools for actionable data science.",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Banner */}
      <div className="relative pt-36 pb-28 px-6 overflow-hidden bg-slate-900">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <img 
            src={blogBg} 
            alt="Blog Background" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-blue-900/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent opacity-10" />
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-8 font-medium tracking-wide">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-white font-bold">Insights</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-lg">
            <TrendingUp size={14} className="text-blue-400" />
            Discover Tech Trends
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">Perspectives</span>
          </h1>
          <p className="text-blue-200/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Dive into our latest articles on software engineering, artificial intelligence, cloud infrastructure, and the future of tech.
          </p>

          {/* Search */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-12 relative max-w-xl mx-auto group"
          >
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search articles by topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-5 pl-14 pr-6 text-sm font-medium text-white shadow-2xl outline-none focus:bg-white focus:text-slate-900 focus:border-white placeholder:text-slate-300 transition-all duration-300"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">
        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md ${
                activeCategory === cat.name
                  ? "bg-slate-800 text-white shadow-slate-900/30 scale-105"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Featured Posts */}
        {featured.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-200 flex-1" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Featured Reads
              </p>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-8"
            >
              {featured.map((post) => (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  key={post.id}
                  className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-500 flex flex-col cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-3">
                      <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${post.categoryColor} shadow-sm`}>
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-2 flex-1">
                      {post.excerpt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Regular Posts Grid */}
        {regular.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-200 flex-1" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Latest Articles
              </p>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {regular.map((post) => (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.01 }}
                  key={post.id}
                  className="group bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-400 flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-3">
                      <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${post.categoryColor} shadow-sm`}>
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-2 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[2rem] shadow-sm border border-slate-100 mt-10"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-slate-300" size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">
              No articles found
            </h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">
              We couldn't find any articles matching your search criteria. Try a different topic or keyword.
            </p>
          </motion.div>
        )}

        {/* Newsletter CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl shadow-slate-900/30"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-blue-900/20" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-4">
              Stay in the loop
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Join Our Tech Community
            </h2>
            <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
              Have any questions, need career guidance, or want to explore our programs? Reach out to our team today.
            </p>
            <div className="flex justify-center">
              <Link 
                to="/contact"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-blue-900/50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;
