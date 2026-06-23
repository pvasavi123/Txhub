import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Users,
  Video,
  Ticket,
  ArrowRight,
  Star,
  MonitorPlay
} from "lucide-react";
import eventsBg from "../assets/event1.png";

const upcomingEvents = [
  {
    id: 1,
    title: "Java Full Stack Enterprise Hackathon",
    type: "Java Full Stack",
    mode: "Hybrid",
    date: "July 15 - 16, 2025",
    time: "48 Hours",
    location: "Hyderabad & Online",
    price: "Free",
    spotsLeft: 85,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-600 to-blue-600",
  },
  {
    id: 2,
    title: "Python & React Web Buildathon",
    type: "Python Full Stack",
    mode: "Online",
    date: "August 10 - 12, 2025",
    time: "72 Hours",
    location: "Virtual (Discord)",
    price: "Free",
    spotsLeft: 150,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    title: "AI & ML Innovation Challenge",
    type: "AI/ML",
    mode: "Offline",
    date: "September 5 - 6, 2025",
    time: "36 Hours",
    location: "T-Hub, Hyderabad",
    price: "₹500",
    spotsLeft: 50,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-600 to-pink-600",
  },
  {
    id: 4,
    title: "Cloud & DevOps Scalability Challenge",
    type: "Cloud & DevOps",
    mode: "Online",
    date: "October 1 - 2, 2025",
    time: "48 Hours",
    location: "Online",
    price: "Free",
    spotsLeft: 200,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-orange-500 to-red-500",
  }
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

const filterTypes = ["All", "Java Full Stack", "Python Full Stack", "AI/ML", "Cloud & DevOps"];

const EventsPage = () => {
  const [filter, setFilter] = useState("All");

  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  const filteredEvents = upcomingEvents.filter(
    (event) => filter === "All" || event.type === filter
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: "480px" }}>
        {/* Background with zoom-in */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img 
            src={eventsBg} 
            alt="Tech Event Hackathon" 
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

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 pt-36 pb-28 text-center relative z-10">
          {/* Breadcrumb */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-6 font-medium tracking-wide"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-white font-bold">Hackathons</span>
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
               <Star size={14} className="text-yellow-400 fill-yellow-400" />
            </motion.span>
            Build & Compete
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-8"
          >
            Student{" "}
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
              Hackathons
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
            Join our intense, expert-led hackathons to solve real-world problems, build amazing projects, and win exciting prizes while connecting with industry leaders.
          </motion.p>
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
          {filterTypes.map((type, i) => (
            <motion.button
              key={type}
              variants={{
                hidden: { opacity: 0, y: 16, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, delay: 0.3 + i * 0.07 } },
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(type)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md overflow-hidden ${
                filter === type
                  ? "text-white shadow-slate-900/30"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
               {filter === type && (
                <motion.span
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-slate-800 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {type}
            </motion.button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <div ref={gridRef}>
          <AnimatePresence mode="wait">
             <motion.div
                key={filter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
              {filteredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  animate={gridInView ? "visible" : "hidden"}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(59,130,246,0.12)" }}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 transition-shadow duration-400 flex flex-col cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-black text-slate-800 shadow-lg">
                      {event.price}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${event.gradient} shadow-lg`}>
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-black text-slate-800 leading-snug mb-5 group-hover:text-blue-600 transition-colors duration-300">
                      {event.title}
                    </h3>

                    <div className="space-y-4 mb-6 flex-1">
                      <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <Calendar size={16} className="text-blue-500" />
                        </div>
                        {event.date}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                          <Clock size={16} className="text-orange-500" />
                        </div>
                        {event.time}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                          {event.mode === "Online" ? (
                            <Video size={16} className="text-emerald-500" />
                          ) : (
                            <MapPin size={16} className="text-pink-500" />
                          )}
                        </div>
                        {event.location}
                      </div>
                    </div>
                     <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                         <div className="flex -space-x-2">
                             {[...Array(3)].map((_, i) => (
                                 <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                             ))}
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                  +{event.spotsLeft}
                              </div>
                         </div>
                         <motion.button 
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-1 text-xs font-black text-blue-600"
                         >
                            View Details <ArrowRight size={14} />
                         </motion.button>
                     </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Empty state */}
        <AnimatePresence>
          {filteredEvents.length === 0 && (
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.35 }}
               className="text-center py-24 bg-white rounded-[2rem] shadow-sm border border-slate-100 mt-10"
            >
              <motion.div
                 animate={{ y: [0, -8, 0] }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                 className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Ticket className="text-slate-300" size={32} />
              </motion.div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">No Events Found</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">There are currently no upcoming events in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Host an event CTA */}
        <motion.div
           ref={ctaRef}
           initial={{ opacity: 0, y: 50 }}
           animate={ctaInView ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
           className="mt-20 bg-white border border-slate-100 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl shadow-blue-900/5 relative overflow-hidden max-w-4xl mx-auto"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400" />
          
          <motion.div
             className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
             initial={{ scale: 0 }}
             animate={ctaInView ? { scale: 1 } : {}}
             transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
             className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <MonitorPlay size={28} className="text-blue-600" />
          </motion.div>

          <motion.h2
             initial={{ opacity: 0, y: 12 }}
             animate={ctaInView ? { opacity: 1, y: 0 } : {}}
             transition={{ delay: 0.3 }}
             className="text-3xl font-black text-slate-800 mb-4"
          >
            Want to Host a Hackathon?
          </motion.h2>

          <motion.p
             initial={{ opacity: 0, y: 12 }}
             animate={ctaInView ? { opacity: 1, y: 0 } : {}}
             transition={{ delay: 0.4 }}
             className="text-slate-500 text-base max-w-xl mx-auto mb-8 leading-relaxed font-medium"
          >
            Partner with TXHub to organize coding competitions, engage developers,
            and discover top tech talent.
          </motion.p>

          <motion.div
             initial={{ opacity: 0, y: 12 }}
             animate={ctaInView ? { opacity: 1, y: 0 } : {}}
             transition={{ delay: 0.5 }}
             className="flex justify-center"
          >
             <motion.button 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.97 }} 
                className="relative overflow-hidden px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-900/20 transition-all group"
             >
                <span className="relative z-10 flex items-center gap-2">
                   Partner With Us
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
             </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventsPage;
