import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen, Star, Users, Clock, BarChart, ChevronRight, CheckCircle2,
  Play, BookOpen as BookIcon, Award, Globe, Shield, Calendar, ChevronDown,
  User, Sparkles, MessageSquare, ArrowLeft, Plus, Trash2, Send, Video, Link as LinkIcon
} from 'lucide-react';

// Predefined detailed content for all courses
const COURSE_DETAILS_DATA = {
  'react-full-stack-development': {
    title: 'React Full Stack Development',
    category: 'Development',
    banner: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&h=400&fit=crop',
    rating: '4.9',
    reviewsCount: '1,240',
    studentsCount: '3,850',
    duration: '12 Weeks',
    lessonsCount: '48',
    level: 'Intermediate',
    price: '₹4,999',
    originalPrice: '₹19,999',
    language: 'English & Hindi',
    certificate: 'Verifiable Professional Certificate',
    // mentor: {
    //   name: 'Dr. John Doe',
    //   role: 'Principal Engineer & Mentor',
    //   avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&h=150&fit=crop',
    //   bio: 'Former Senior Architect at Tech Giants. Over 15 years of industry experience specializing in React, Node.js, and cloud systems.'
    // },
    overview: 'Master React, Redux, Node.js, Express, and MongoDB in this comprehensive industry-aligned track. You will build highly scalable modern web applications from scratch, implement advanced state management patterns, and deploy them on AWS cloud infrastructure.',
    outcomes: [
      'Build rich interactive SPA using React Hooks, Context API, and Redux Toolkit.',
      'Develop secure, production-grade REST APIs using Node.js, Express, and JWT authentication.',
      'Design advanced databases utilizing MongoDB, Mongoose schemas, and aggregation pipelines.',
      'Deploy full-stack applications with CI/CD pipelines on AWS, Netlify, and Render.'
    ],
    highlights: [
      '5+ Real-world Capstone Projects',
      '1-on-1 Mentor Support & Weekly Live Syncs',
      'Dedicated Job Placement Assistance Portal',
      'Lifetime Access to Curriculum & Resources'
    ],
    stats: {
      placementRate: '94%',
      averageSalary: '₹8.5 LPA',
      highestPackage: '₹22 LPA'
    },
    reviews: [
      { name: 'Amit Sharma', rating: 5, date: '2 days ago', comment: 'The curriculum is super practical! The transition from Frontend to backend was explained wonderfully.' },
      { name: 'Priya Patel', rating: 5, date: '1 week ago', comment: 'Loved the hands-on project reviews. The mentor support is fast and helped resolve all blockers.' }
    ],
    curriculum: [
      {
        title: 'Module 1: Advanced Javascript & React Foundation',
        lessons: ['ES6+ Syntax Essentials & Async/Await', 'React Component Architecture & Hooks State Lifecycle', 'Handling Forms, Validations & Styled Components']
      },
      {
        title: 'Module 2: State Management & Routing',
        lessons: ['Redux Toolkit & Slice Design Patterns', 'React Router DOM v6 Nested Routing', 'Global State Management using Context API']
      },
      {
        title: 'Module 3: Backend Development with Node & Express',
        lessons: ['Express Router & RESTful API Architecture', 'JWT Authentication & Security Middleware', 'File Uploads with Cloudinary integration']
      }
    ]
  },
  'java-full-stack': {
    title: 'Java Full Stack Development',
    category: 'Enterprise Development',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&h=400&fit=crop',
    rating: '4.8',
    reviewsCount: '890',
    studentsCount: '2,920',
    duration: '16 Weeks',
    lessonsCount: '64',
    level: 'Beginner to Advanced',
    price: '₹4,999',
    originalPrice: '₹19,999',
    language: 'English',
    certificate: 'Industrial Training Certificate',
    mentor: {
      name: 'Srinivas Murthy',
      role: 'Enterprise Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop',
      bio: 'Srinivas is a Java veteran with 12+ years of experience leading massive enterprise transformation initiatives.'
    },
    overview: 'Enter the world of robust enterprise software engineering. Learn Java OOP, Spring Boot microservices, Hibernate, REST APIs, and React frontend integration.',
    outcomes: [
      'Write highly clean, performant Java code following OOP and design patterns.',
      'Build modern microservices architectures using Spring Boot and Spring Cloud.',
      'Persist data seamlessly with JPA, Hibernate, PostgreSQL, and MySQL.',
      'Construct a reactive frontend using React integrated with Spring Security REST endpoints.'
    ],
    highlights: [
      'Microservices-based Capstone Projects',
      'Mock Technical Coding Interviews prep',
      'Direct Referrals to Tier-1 Product Companies',
      'Interactive Live Coding sessions weekly'
    ],
    stats: {
      placementRate: '92%',
      averageSalary: '₹7.8 LPA',
      highestPackage: '₹18 LPA'
    },
    reviews: [
      { name: 'Rohan Deshmukh', rating: 5, date: '3 days ago', comment: 'The Microservices module was absolute gold. Highly recommend for enterprise devs.' },
      { name: 'Kavita Iyer', rating: 4, date: '2 weeks ago', comment: 'Very deep coverage of Spring Boot. Homework assignments were challenging but useful.' }
    ],
    curriculum: [
      {
        title: 'Module 1: Core Java & OOP Concepts',
        lessons: ['Java Collections Framework & Custom Comparators', 'Multi-Threading, Synchronization & Streams API', 'OOP Principles: Inheritance, Polymorphism & SOLID Design']
      },
      {
        title: 'Module 2: Database Layer & Hibernate',
        lessons: ['SQL Queries, Joins & Indexing Basics', 'JPA Entity Mapping & Relationships (OneToMany)', 'Transaction Management & Connection Pooling']
      },
      {
        title: 'Module 3: Spring Boot Microservices',
        lessons: ['Spring REST Controllers & Request validation', 'Eureka Service Discovery & API Gateway Setup', 'Spring Security and OAuth2 Integration']
      }
    ]
  },
  'testing': {
    title: 'Software Testing & Automation',
    category: 'Quality Assurance',
    banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&h=400&fit=crop',
    rating: '4.9',
    reviewsCount: '620',
    studentsCount: '1,750',
    duration: '10 Weeks',
    lessonsCount: '40',
    level: 'Beginner Friendly',
    price: '₹4,999',
    originalPrice: '₹19,999',
    language: 'English & Hindi',
    certificate: 'QA Professional Certificate',
    mentor: {
      name: 'Rahul Verma',
      role: 'QA Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop',
      bio: 'Automation specialist who coached 5000+ students on Web, Mobile, and API automation frameworks.'
    },
    overview: 'Become a highly paid Automation QA Engineer. Master Manual Testing, Selenium Web Driver, Java programming, TestNG, Cucumber BDD framework, and Jenkins CI/CD.',
    outcomes: [
      'Master Web Test automation using Selenium WebDriver & Core Java.',
      'Build hybrid, data-driven, and page object model (POM) automation frameworks.',
      'Test APIs programmatically using REST Assured and Postman tool.',
      'Integrate testing into DevOps pipeline with Maven, GitHub, and Jenkins.'
    ],
    highlights: [
      'Manual to Automation smooth transition path',
      'API & Mobile App Automation coverage',
      'Resume reviews & Selenium coding challenge sessions',
      '100% Practical Framework Development'
    ],
    stats: {
      placementRate: '95%',
      averageSalary: '₹6.8 LPA',
      highestPackage: '₹14 LPA'
    },
    reviews: [
      { name: 'Sanjay Kumar', rating: 5, date: '1 day ago', comment: 'Great course for manual testers looking to move to automation. Frame work creation was explained step by step.' },
      { name: 'Neelam Sen', rating: 5, date: '5 days ago', comment: 'REST Assured testing was explained very nicely. Good focus on java basics too.' }
    ],
    curriculum: [
      {
        title: 'Module 1: Java Basics for Selenium',
        lessons: ['Loops, Arrays, and Conditional Statements', 'Class, Object, Methods & Inheritance in Automation', 'Exception Handling & File Reader Utility']
      },
      {
        title: 'Module 2: Selenium Web Driver Core',
        lessons: ['Locators, Xpath Writing & CSS Selector rules', 'Handling Dynamic WebElements, dropdowns & Alerts', 'Framework Design: Page Object Model (POM)']
      },
      {
        title: 'Module 3: Advanced Frameworks & API Testing',
        lessons: ['Cucumber BDD, Feature files & Gherkin Language', 'REST Assured Framework & GET/POST assertions', 'CI/CD Pipeline integration using Jenkins & GitHub']
      }
    ]
  }
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'curriculum' | 'instructor' | 'broadcast'
  const [expandedModule, setExpandedModule] = useState(0);
  const [stats, setStats] = useState({ students: 0, batches: 0, mentorAssignments: 0, progress: 0 });

  useEffect(() => {
    const fetchCourseStats = async () => {
      try {
        const [enrollRes, batchRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/enrollments/'),
          fetch('http://127.0.0.1:8000/api/batches/')
        ]);

        const enrollResult = await enrollRes.json();
        const enrollData = Array.isArray(enrollResult) ? enrollResult : enrollResult.data || [];
        const batchesData = await batchRes.json();

        const mapCourseId = (title) => {
          if (!title) return 'other';
          const t = title.toLowerCase();
          if (t.includes('react') || t.includes('mern') || t.includes('mongodb')) return 'react-full-stack-development';
          if (t.includes('java')) return 'java-full-stack';
          if (t.includes('testing') || t.includes('qa') || t.includes('selenium')) return 'testing';
          return 'other';
        };

        const currentCourseId = courseId || 'react-full-stack-development';

        // Filter enrollments for this course
        const courseEnrollments = enrollData.filter(e => {
          const cId = mapCourseId(e.title || (e.items && e.items[0]?.title));
          return cId === currentCourseId;
        });

        // Filter batches for this course
        const courseBatches = batchesData.filter(b => {
          const cId = mapCourseId(b.course);
          return cId === currentCourseId;
        });

        // Calculate mentor assignments
        const mentorAssignments = courseEnrollments.filter(e => e.assigned_mentor !== null).length;

        // Calculate average progress (amount_paid / total_fee) * 100
        let totalProgress = 0;
        let studentsWithFee = 0;
        courseEnrollments.forEach(e => {
          const totalFee = parseFloat(e.total_fee) || 0;
          const paid = parseFloat(e.amount_paid) || 0;
          if (totalFee > 0) {
            totalProgress += (paid / totalFee) * 100;
            studentsWithFee++;
          }
        });
        const avgProgress = studentsWithFee > 0 ? Math.round(totalProgress / studentsWithFee) : 0;

        setStats({
          students: courseEnrollments.length,
          batches: courseBatches.length,
          mentorAssignments,
          progress: avgProgress
        });
      } catch (err) {
        console.error("Error fetching course metrics in details page:", err);
      }
    };

    fetchCourseStats();
  }, [courseId]);

  // Dynamic broadcast feed state for demo/broadcast simulation
  const [broadcastFeed, setBroadcastFeed] = useState([
    { id: 1, type: 'live', topic: 'Live QA & Doubt Clearing Session', date: 'Tomorrow at 7:00 PM', link: 'meet.google.com/abc-def-ghi' },
    { id: 2, type: 'recorded', topic: 'React Custom Hooks Deep Dive', date: 'Shared 2 days ago', link: 'youtube.com/watch?v=123' },
    { id: 3, type: 'resource', topic: 'Interactive Coding Playgrounds & Code Snippets', date: 'Shared 5 days ago', link: 'github.com/txhub-dev' }
  ]);
  const [newBroadcast, setNewBroadcast] = useState({ type: 'live', topic: '', link: '' });

  // Resolve matching key
  const routeKey = courseId || 'react-full-stack-development';
  const data = COURSE_DETAILS_DATA[routeKey] || COURSE_DETAILS_DATA['react-full-stack-development'];

  const handleAddBroadcast = (e) => {
    e.preventDefault();
    if (!newBroadcast.topic || !newBroadcast.link) return alert('Please fill in all fields');
    const item = {
      id: Date.now(),
      type: newBroadcast.type,
      topic: newBroadcast.topic,
      link: newBroadcast.link,
      date: 'Just Now'
    };
    setBroadcastFeed([item, ...broadcastFeed]);
    setNewBroadcast({ type: 'live', topic: '', link: '' });
  };

  const handleDeleteBroadcast = (id) => {
    setBroadcastFeed(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-800 font-sans pb-16">
      
      {/* ── HEADER NAVIGATION ── */}
      <div className="bg-white border-b border-slate-100 py-3 px-4 md:px-6 sticky top-0 z-50 flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between">
        <button
          onClick={() => navigate('/admin/courses')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors text-xs sm:text-sm"
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Admin Course Control
        </span>
      </div>

      {/* ── HERO BANNER SECTION ── */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-10 md:py-20 px-4 sm:px-6 lg:px-12">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${data.banner})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={11} /> {data.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-3xl">
              {data.title}
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
              {data.overview}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs md:text-sm text-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-yellow-400">
                <Star size={16} className="fill-yellow-400" /> {data.rating}
                <span className="text-slate-400 font-normal">({data.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <Users size={16} className="text-blue-400" /> {stats.students} Students Enrolled
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <Clock size={16} className="text-blue-400" /> {data.duration}
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <BarChart size={16} className="text-blue-400" /> {data.level}
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 shrink-0">
                <img src={data.mentor.avatar} alt={data.mentor.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <p className="text-slate-400 uppercase tracking-widest font-bold">Taught by</p>
                <p className="font-extrabold text-sm text-white">{data.mentor.name} · {data.mentor.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-6 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* LEFT COLUMN: COURSE DETAIL TABS & DETAILS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* TABS HEADER */}
          <div className="flex overflow-x-auto no-scrollbar border-b border-slate-100 bg-white p-2 rounded-2xl shadow-sm gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'curriculum', label: 'Curriculum' },
              { id: 'instructor', label: 'Instructor' },
              { id: 'broadcast', label: 'Broadcast Console', premium: true }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {tab.premium && (
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'}`}>
                    Control
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB CONTENTS */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-800">What You Will Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.outcomes.map((out, idx) => (
                      <div key={idx} className="flex gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs md:text-sm font-bold text-slate-700 leading-snug">{out}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-800">Course Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.highlights.map((high, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        {high}
                      </div>
                    ))}
                  </div>
                </div>

                {/* STATISTICS PANEL */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 p-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-4">Course Operational Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3">
                      <p className="text-2xl md:text-3xl font-black text-blue-900 leading-none">{stats.students}</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 mt-2">Students</p>
                    </div>
                    <div className="p-3 border-l md:border-x border-blue-100">
                      <p className="text-2xl md:text-3xl font-black text-blue-900 leading-none">{stats.batches}</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 mt-2">Active Batches</p>
                    </div>
                    <div className="p-3 border-t md:border-t-0 md:border-r border-blue-100">
                      <p className="text-2xl md:text-3xl font-black text-blue-900 leading-none">{stats.mentorAssignments}</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 mt-2">Mentors Assigned</p>
                    </div>
                    <div className="p-3 border-t md:border-t-0 border-l border-blue-100">
                      <p className="text-2xl md:text-3xl font-black text-blue-900 leading-none">{stats.progress}%</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 mt-2">Avg Progress</p>
                    </div>
                  </div>
                </div>

                {/* REVIEWS */}
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-800">Student Reviews</h3>
                  <div className="space-y-4">
                    {data.reviews.map((rev, idx) => (
                      <div key={idx} className="p-5 border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-extrabold text-sm text-slate-800">{rev.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{rev.date}</p>
                          </div>
                          <div className="flex gap-0.5 text-yellow-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={12} className="fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-xs md:text-sm font-medium italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CURRICULUM TAB */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="text-xl font-black text-slate-800 mb-6">Course Curriculum</h3>
                <div className="space-y-4">
                  {data.curriculum.map((module, idx) => {
                    const isExpanded = expandedModule === idx;
                    return (
                      <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => setExpandedModule(isExpanded ? null : idx)}
                          className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left"
                        >
                          <div>
                            <p className="font-extrabold text-slate-800 text-sm md:text-base">{module.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{module.lessons.length} Lectures</p>
                          </div>
                          <ChevronDown size={18} className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="p-5 divide-y divide-slate-50 bg-white">
                            {module.lessons.map((lesson, lIdx) => (
                              <div key={lIdx} className="py-3 flex items-center justify-between text-xs md:text-sm font-bold text-slate-600">
                                <div className="flex items-center gap-3">
                                  <Play size={14} className="text-blue-500 fill-blue-100" />
                                  <span>{lesson}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">Video</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* INSTRUCTOR TAB */}
            {activeTab === 'instructor' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-blue-100 shrink-0 shadow-lg">
                    <img src={data.mentor.avatar} alt={data.mentor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <h3 className="text-2xl font-black text-slate-800">{data.mentor.name}</h3>
                    <p className="text-blue-600 font-extrabold text-sm">{data.mentor.role}</p>
                    <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">
                      {data.mentor.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* BROADCAST CONSOLE TAB */}
            {activeTab === 'broadcast' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Broadcast Control Room</h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Publish content (Live classes, Recorded modules, Resource links) directly to enrolled students.</p>
                </div>

                <form onSubmit={handleAddBroadcast} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-600">Broadcast New Content</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Content Type</label>
                      <select
                        value={newBroadcast.type}
                        onChange={(e) => setNewBroadcast({ ...newBroadcast, type: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      >
                        <option value="live">Live Class</option>
                        <option value="recorded">Recorded Class</option>
                        <option value="resource">Link / Resource</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Topic / Title</label>
                      <input
                        type="text"
                        value={newBroadcast.topic}
                        onChange={(e) => setNewBroadcast({ ...newBroadcast, topic: e.target.value })}
                        placeholder="e.g. Hooks and Context API"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">URL Link</label>
                    <input
                      type="url"
                      value={newBroadcast.link}
                      onChange={(e) => setNewBroadcast({ ...newBroadcast, link: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md active:scale-95 flex items-center justify-center gap-2 hover:bg-blue-700"
                  >
                    <Send size={14} /> Send Broadcast to Feed
                  </button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-600">Active Broadcasts Roster</h4>
                  {broadcastFeed.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${b.type === 'live' ? 'bg-blue-50 text-blue-600' : b.type === 'recorded' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                          {b.type === 'live' && <Video size={16} />}
                          {b.type === 'recorded' && <Play size={16} />}
                          {b.type === 'resource' && <LinkIcon size={16} />}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-slate-800">{b.topic}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{b.date} · {b.link}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBroadcast(b.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Broadcast"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: STICKY ENROLLMENT SIDEBAR */}
        <div className="order-first lg:order-last lg:col-span-4 lg:sticky lg:top-20 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-blue-500" />
            
            <div className="space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 leading-none">{data.price}</span>
                <span className="text-slate-400 line-through text-sm font-semibold">{data.originalPrice}</span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase ml-auto">75% OFF</span>
              </div>
              
              <button
                onClick={() => alert('Demo Enrollment initiated. Access granted.')}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} fill="white" /> Enroll in Course
              </button>

              <div className="space-y-4 pt-4 border-t border-slate-50 text-xs md:text-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">This Course Includes:</p>
                
                {[
                  { icon: <Clock size={16} className="text-blue-500" />, label: `${data.duration} Duration` },
                  { icon: <BookIcon size={16} className="text-blue-500" />, label: `${data.lessonsCount} Modules/Lectures` },
                  { icon: <Award size={16} className="text-blue-500" />, label: data.certificate },
                  { icon: <Globe size={16} className="text-blue-500" />, label: `Language: ${data.language}` },
                  { icon: <Shield size={16} className="text-blue-500" />, label: 'Fully Secure Verifiable Enrollment' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 font-bold text-slate-600">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CourseDetails;
