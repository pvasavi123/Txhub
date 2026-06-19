import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Star, CheckCircle, ShoppingCart, LayoutGrid, Globe, Building2, Layers, ChevronDown, Check, Filter, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import SEO from "../components/SEO";
import { AuthContext } from "../context/AuthContext";
import trainingBg from "../assets/training.png";
import awsImg from "../assets/aws.jpg";
import javaImg from "../assets/java_full.jpg";
import reactImg from "../assets/react_full.jpg";
import mlImg from "../assets/ml.jpg";
import uiImg from "../assets/ui_ux.jpg";
import dataAnalyticsImg from "../assets/Data Analytics.jpg";
import backendImg from "../assets/backend development.jpg";
import dataScienceImg from "../assets/dataScience.jpg";
import frontendImg from "../assets/fronteend development.jpg";
import mernImg from "../assets/mern stack development.jpg";
import pythonImg from "../assets/python full stack.jpg";
import softImg from "../assets/soft.jpg";
import { SlidersHorizontal } from "lucide-react";

const getAssetImage = (title) => {
  const t = (title || "").toLowerCase();
  if (t.includes("mern")) return mernImg;
  if (t.includes("react")) return reactImg;
  if (t.includes("java")) return javaImg;
  if (t.includes("python")) return pythonImg;
  if (t.includes("aws") || t.includes("devops")) return awsImg;
  if (t.includes("ml") || t.includes("machine")) return mlImg;
  if (t.includes("ui") || t.includes("ux") || t.includes("figma")) return uiImg;
  if (t.includes("data science") || t.includes("datascience")) return dataScienceImg;
  if (t.includes("data") || t.includes("analytics")) return dataAnalyticsImg;
  if (t.includes("front end") || t.includes("frontend")) return frontendImg;
  if (t.includes("soft") || t.includes("skills") || t.includes("leadership") || t.includes("speaking")) return softImg;
  if (t.includes("testing") || t.includes("qa") || t.includes("selenium") || t.includes("manual")) return "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80";
  return null;
};

const getCourseFallbackImage = (title, category) => {
  const t = (title || '').toLowerCase();
  const c = (category || '').toLowerCase();
  const h = title ? Math.abs(title.split('').reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0)) : 0;
  
  const pools = {
    software: ['1517694712202-14dd9538aa97', '1555066931-4365d14bab8c', '1526374965328-7f61d4dc18c5'],
    devops: ['1667372393119-3d4c48d07fc9', '1517077304055-6e89abbf09b0', '1451187580459-43490279c0fa'],
    testing: ['1607799279861-4dd421887fb3', '1516321318423-f06f85e504b3', '1498050108023-c5249f4df085'],
    design: ['1561070791-2526d30994b5', '1586717791821-3f44a563fa4c', '1454165804606-c3d57bc86b40'],
    ai: ['1677442136019-21780ecad995', '1677442135703-1787eea5ce01', '1518770660439-4636190af475', '1550751827-4bd374c3f58b'],
    data: ['1551288049-bebda4e38f71', '1460925895917-afdab827c52f', '1488590528505-98d2b5aba04b'],
    default: ['1498050108023-c5249f4df085', '1488590528505-98d2b5aba04b', '1454165804606-c3d57bc86b40']
  };

  let pool = pools.default;
  if (t.includes('react') || t.includes('javascript') || t.includes('python') || t.includes('java') || t.includes('mern') || t.includes('backend') || t.includes('frontend')) pool = pools.software;
  else if (t.includes('aws') || t.includes('devops') || t.includes('docker') || t.includes('cloud')) pool = pools.devops;
  else if (t.includes('testing') || t.includes('selenium') || t.includes('automation') || t.includes('qa')) pool = pools.testing;
  else if (t.includes('figma') || t.includes('ui') || t.includes('ux') || t.includes('design')) pool = pools.design;
  else if (t.includes('machine') || t.includes('ai') || t.includes('ml')) pool = pools.ai;
  else if (t.includes('data') || t.includes('analytics') || t.includes('language processing')) pool = pools.data;
  else if (c.includes('software')) pool = pools.software;
  else if (c.includes('testing')) pool = pools.testing;
  else if (c.includes('design')) pool = pools.design;
  else if (c.includes('ai') || c.includes('machine')) pool = pools.ai;
  else if (c.includes('devops')) pool = pools.devops;
  else if (c.includes('data')) pool = pools.data;
  
  return `https://images.unsplash.com/photo-${pool[h % pool.length]}?q=80&w=600&h=300&fit=crop`;
};

const allCourses = [
  {
    id: 99,
    title: "Manual Testing",
    category: "Testing",
    level: "Online",
    rating: "4.8",
    students: "1,520 students",
    price: "4,999",
    img: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80",
  },
  {
    id: 0,
    title: "React ",
    category: "Software Development",
    level: "Online",
    rating: "4.9",
    students: "1,240 students",
    price: "4,999",
    img: reactImg,
  },
  {
    id: 1,
    title: "Selenium Automation Testing",
    category: "Testing",
    level: "Internship",
    rating: "4.7",
    students: "890 students",
    price: "4,999",
    img: "https://tse2.mm.bing.net/th/id/OIP.g_b84bPN6qKvVjeNS3cmeQHaEH",
  },
  {
    id: 2,
    title: "Figma UI/UX Complete Guide",
    category: "UI/UX Design",
    level: "Online",
    rating: "4.8",
    students: "1,050 students",
    price: "4,999",
    img: uiImg,
  },
  {
    id: 3,
    title: "Java Full Stack Development",
    category: "Software Development",
    level: "Online",
    rating: "4.6",
    students: "980 students",
    price: "4,999",
    img: javaImg,
  },
  {
    id: 4,
    title: "AWS & DevOps",
    category: "DevOps",
    level: "Online",
    rating: "4.9",
    students: "1,400 students",
    price: "4,999",
    img: awsImg,
  },
  {
    id: 5,
    title: "Machine Learning",
    category: "AI/ML",
    level: "Online",
    rating: "4.8",
    students: "1,200 students",
    price: "4,999",
    img: mlImg,
  },
  {
    id: 6,
    title: "Data Science Fundamentals",
    category: "Data Science",
    level: "Online",
    rating: "4.8",
    students: "2,100 students",
    price: "4,999",
    img: dataScienceImg,
  },
  {
    id: 7,
    title: "MERN Stack Crash Course",
    category: "Software Development",
    level: "Online",
    rating: "4.7",
    students: "1,850 students",
    price: "4,999",
    img: mernImg,
  },
  {
    id: 8,
    title: "Front End Web Development",
    category: "Software Development",
    level: "Online",
    rating: "4.9",
    students: "3,200 students",
    price: "4,999",
    img: frontendImg,
  },
  {
    id: 9,
    title: "Python Full Stack",
    category: "Software Development",
    level: "Online",
    rating: "4.8",
    students: "900 students",
    price: "4,999",
    img: pythonImg,
  },
  {
    id: 10,
    title: "Data Analytics Masterclass",
    category: "Data Science",
    level: "Online",
    rating: "4.6",
    students: "1,150 students",
    price: "4,999",
    img: dataAnalyticsImg,
  },
  {
    id: 11,
    title: "Advanced Software Testing",
    category: "Testing",
    level: "Online",
    rating: "4.8",
    students: "1,450 students",
    price: "4,999",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    id: 12,
    title: "API Testing with Postman",
    category: "Testing",
    level: "Online",
    rating: "4.9",
    students: "980 students",
    price: "4,999",
    img: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80",
  },
  {
    id: 13,
    title: "Mobile App Automation (Appium)",
    category: "Testing",
    level: "Online",
    rating: "4.7",
    students: "600 students",
    price: "4,999",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  },
  {
    id: 14,
    title: "Leadership & Team Management",
    category: "Soft Skills",
    level: "Online",
    rating: "4.9",
    students: "1,120 students",
    price: "4,999",
    img: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
  },
  {
    id: 15,
    title: "Public Speaking Mastery",
    category: "Soft Skills",
    level: "Online",
    rating: "4.8",
    students: "850 students",
    price: "4,999",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  },
  {
    id: 16,
    title: "Critical Thinking & Problem Solving",
    category: "Soft Skills",
    level: "Online",
    rating: "4.7",
    students: "950 students",
    price: "4,999",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  },
];


const courseOptions = [
  "Manual Testing Complete Course",
  "React Full Stack Development",
  "Figma UI/UX Complete Guide",
  "Java Full Stack Development",
  "Machine Learning",
  "Data Science Fundamentals",
  "MERN Stack Crash Course",
  "Front End Web Development",
  "Python Full Stack",
  "Data Analytics Masterclass",
  "Advanced Software Testing",
  "API Testing with Postman",
  "Mobile App Automation (Appium)"
];


const Explore = () => {
  const location = useLocation();
  const navigate = useNavigate();

useEffect(() => {
  if (location.state?.mode) {
    setMode(location.state.mode);
  }

  if (location.state?.hideControls) {
    setHideControls(true);
  }

  setTimeout(() => {
    document.getElementById("courses-grid")?.scrollIntoView({
      behavior: "smooth"
    });
  }, 100);

}, [location.state]);
  



  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState("Online");
  const [hideControls, setHideControls] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(""); // default = Online
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [selectedOption, setSelectedOption] = useState("");

  const [notification, setNotification] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { addToCart, isInCart } = useContext(CartContext);
  const { user, openAuthModal } = useContext(AuthContext); // Get user and modal trigger
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [dbCourses, setDbCourses] = useState([]);

  useEffect(() => {
    const fetchDbCourses = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/courses-list/");
        const data = await res.json();
        if (res.ok) {
           const mappedDbCourses = data.map(c => {
             const assetImg = getAssetImage(c.title);
             const fallback = getCourseFallbackImage(c.title, c.category);
             return {
               id: c.id + 1000, // Prevent ID collisions
               title: c.title,
               category: c.category || "Other",
               level: "Online",
               rating: "4.8",
               students: "New",
               price: c.price || "4,999",
               img: assetImg ? assetImg : (c.imageUrl ? (c.imageUrl.startsWith("http") ? c.imageUrl : `http://127.0.0.1:8000${c.imageUrl}`) : fallback),
               slug: c.slug
             };
           });
           setDbCourses(mappedDbCourses);
        }
      } catch (err) {
        console.error("Failed to fetch DB courses:", err);
      }
    };
    fetchDbCourses();
  }, []);

  // useEffect(() => {
  //   const fetchEnrollments = async () => {
  //     if (user?.email) {
  //       try {
  //         const res = await fetch(`http://127.0.0.1:8000/api/enrollments/?email=${user.email}`);
  //         const data = await res.json();
  //         if (res.ok) setUserEnrollments(data.data || []);
  //       } catch (err) {
  //         console.error("Failed to fetch enrollments:", err);
  //       }
  //     }
  //   };
  //   fetchEnrollments();
  // }, [user]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (user?.email) {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/enrollments/?email=${user.email}`);
          const data = await res.json();
          if (res.ok) setUserEnrollments(data.data || []);
        } catch (err) {
          console.error("Failed to fetch enrollments:", err);
        }
      }
    };

    fetchEnrollments();

    // ✅ ADD THIS LINE HERE (scroll to top)
    // window.scrollTo(0, 0);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }, [user]);

  const getEnrollment = (courseTitle) => {
    return userEnrollments.find(e =>
      e.title.toLowerCase().includes(courseTitle.toLowerCase()) ||
      courseTitle.toLowerCase().includes(e.title.toLowerCase())
    );
  };

  const isEnrolled = (courseTitle) => {
    const enrollment = getEnrollment(courseTitle);
    return enrollment?.payment_status === "completed";
  };

  const isPartial = (courseTitle) => {
    const enrollment = getEnrollment(courseTitle);
    return enrollment?.payment_status === "partial";
  };

  const combinedCourses = [...allCourses, ...dbCourses];

  const filteredCourses = combinedCourses.filter((course) => {
    const cleanSearch = search.toLowerCase().trim();

    const matchesCategory =
      category === "All" ||
      course.category.toLowerCase().replace(/\s/g, "") ===
      category.toLowerCase().replace(/\s/g, "");

    const matchesSearch =
      cleanSearch === ""
        ? true
        : course.title.toLowerCase().includes(cleanSearch) ||
        course.category.toLowerCase().includes(cleanSearch);

    // ✅ ADD THIS (MAIN LOGIC)
    const matchesMode =
      mode === "Online"
        ? course.level.toLowerCase() === "online"
        : true;

    return matchesCategory && matchesSearch && matchesMode;
  });

  // const handleAddToCart = (e, course) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   const added = addToCart(course);
  //   if (added) {
  //     setNotification(course.title);
  //     setTimeout(() => setNotification(null), 2000);
  //   }
  // };

  const handleAddToCart = async (e, course) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!user?.email) {
        openAuthModal("login");
        return;
      }

      // ✅ prevent duplicate
      if (isInCart(course.title)) {
        alert("Already in cart ⚠️");
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/addcart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          course_id: course.id,
          title: course.title,
          price: course.price,
          img: course.img.startsWith("http")
            ? course.img
            : window.location.origin + course.img
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        alert(JSON.stringify(data));
        return;
      }

      const added = addToCart(course);

      if (added) {
        setNotification(course.title);
        setTimeout(() => setNotification(null), 2000);
      }

    } catch (err) {
      console.error(err);
      alert("Server error ⚠️");
    }
  };


  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
    } else {
      setCategory("All");
    }
  }, [location.state]);

  // ✅ Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category]);

  useEffect(() => {
    // Close any dropdown when page loads
    const closeDropdownEvent = new Event("closeDropdown");
    window.dispatchEvent(closeDropdownEvent);
  }, []);




  return (
    <>
      <SEO
        title="Explore Courses"
        description="Browse our wide selection of elite courses in Software Development, Data Science, AI/ML, and more."
        keywords="explore courses, online learning, tech skills, software development courses"
      />
      {/* Navbar is now handled globally */}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-bounce">
          <div className="bg-white/80 backdrop-blur-md border border-blue-200 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-slate-800 font-semibold">{notification} added to cart</span>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="relative pt-28 sm:pt-36 pb-8 sm:pb-12 overflow-hidden bg-[#f0f7ff]">

        {/* Background */}
        <div
          className="absolute inset-y-0 right-0 w-2/3 z-0 bg-cover bg-right-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${trainingBg})` }}
        ></div>

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#f0f7ff] via-[#f0f7ff]/90 to-transparent"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-10 lg:px-16">

          {/* Heading */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              Advance with <span className="text-blue-600">Premium Courses</span>
            </h1>

            <p className="text-slate-500 text-sm sm:text-base mb-6">
              Master new skills with our training and placement support.
            </p>

            {/* 🔍 SEARCH BAR */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                document.getElementById("courses-grid")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center bg-white rounded-full shadow-md border px-4 py-2"
            >
              <Search className="text-blue-500 mr-2" size={20} />

              <input
                type="text"
                placeholder="What would you like to learn today?"
                className="flex-1 outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>



            {/* ✅ FILTER BUTTON (LIKE IMAGE 2) */}
            <div className="mt-4">
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm text-slate-700 font-medium hover:bg-slate-50 active:scale-95 transition lg:hidden"
              >
                <SlidersHorizontal size={18} className="text-slate-600" />
                Filter & Sort
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Main Layout */}
      <section id="courses-grid" className="bg-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 mb-12">
          {/* 🔘 ONLINE / OFFLINE FILTER (Moved below Hero) */}
          {!hideControls && (
  <div className="flex justify-center">
            <div className="relative flex bg-slate-50 shadow-inner rounded-full p-1 border border-slate-200">
              <div
                className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-500 ease-out ${mode === "Online" ? "left-1" : "left-1/2"
                  }`}
              ></div>
              {/* <button
                onClick={() => setMode("Online")}
                className={`relative z-10 px-8 sm:px-12 py-2 sm:py-2.5 text-xs sm:text-sm font-black transition-colors duration-300 ${mode === "Online" ? "text-white" : "text-slate-500"
                  }`}
              >
                Online
              </button> */}
              {/* <button
                onClick={() => setMode("Offline")}
                className={`relative z-10 px-8 sm:px-12 py-2 sm:py-2.5 text-xs sm:text-sm font-black transition-colors duration-300 ${mode === "Offline" ? "text-white" : "text-slate-500"
                  }`}
              >
                Offline
              </button> */}
            </div>
          </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 grid lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          {mode === "Online" && (
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-32 z-10 self-start bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-blue-500/5">
                <h2 className="font-black text-xs uppercase tracking-widest mb-4 text-slate-400 font-sans">Filter Categories</h2>

                <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide no-scrollbar px-1">
                  {["All", "Software Development", "Testing", "UI/UX Design", "DevOps", "AI/ML", "Data Science", "Soft Skills"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                      }}
                      className={`whitespace-nowrap px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm ${category === cat
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
                        : "text-slate-500 bg-slate-50 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          <div className={`${mode === "Online" ? "lg:col-span-3" : "lg:col-span-4"}`}>


            <style>
              {`
                @keyframes slideUpFade {
                  0% { opacity: 0; transform: translateY(40px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
              `}
            </style>


            {/* Courses Grid */}
            <div className="w-full">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {mode === "Offline" ? (
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">


                    {/* POIP */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border">
                      <h2 className="font-bold text-lg mb-2">
                        POIP (Placements Oriented Intensive Program)
                      </h2>

                      <p className="text-sm text-slate-500 mb-2">⏱ 6 hrs/day</p>
                      <p className="text-sm font-medium text-blue-600 mb-3">
                        Best for: Training + placement assistance
                      </p>

                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>✔ Learn from industry experts</li>
                        <li>✔ Work on real-time projects</li>
                        <li>✔ Get 1 year LMS access</li>
                        <li>✔ Improve communication & aptitude skills</li>
                        <li>✔ Daily doubt support</li>
                        <li>✔ Practice with assignments & mock interviews</li>
                        <li>✔ Build Resume, LinkedIn & GitHub</li>
                        <li>✔ Regular tests to track progress</li>
                        <li>✔ Attend placement drives</li>
                        <li>✔ Get 12 months placement support</li>
                        <li>✔ Receive course completion certificate</li>
                      </ul>

                      <p className="mt-4 text-lg font-bold text-blue-600">₹24,999</p>
                    

                      <button
                        onClick={() => {
                          setSelectedCourse("POIP");
                          setShowForm(true);
                        }}
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg"
                      >
                        Join the Course
                      </button>
                    </div>

                    {/* COIP */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border">
                      <h2 className="font-bold text-lg mb-2">
                        COIP (Company Oriented Internship Program)
                      </h2>

                      <p className="text-sm text-slate-500 mb-2">⏱ 6–8 hrs/day</p>
                      <p className="text-sm font-medium text-blue-600 mb-3">
                        Best for: Training +  Internship + placement assistance
                      </p>

                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>✔ Learn from industry experts</li>
                        <li>✔ 6 months internship (Tanvox Technologies – client-based)</li>
                        <li>✔ Work on real-time client projects</li>
                        <li>✔ Get 1 year LMS access</li>
                        <li>✔ 1:1 mentor support</li>
                        <li>✔ Build Resume, LinkedIn & GitHub</li>
                        <li>✔ Practice with mock interviews & tasks</li>
                        <li>✔ Attend direct company interviews</li>
                        <li>✔ Get 12 months placement support</li>
                        <li>✔ Receive internship & course certificates</li>
                        <li>✔ Agile & Scrum methodology exposure</li>
                      </ul>

                      <p className="mt-4 text-lg font-bold text-blue-600">₹49,999</p>
                    

                      <button
                        onClick={() => {
                          setSelectedCourse("COIP");
                          setShowForm(true);
                        }}
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg"
                      >
                        Join the Course
                      </button>
                    </div>


                  </div>
                ) : (
                  filteredCourses.map((course, index) => {
                    const added = isInCart(course.title);
                    const enrollment = getEnrollment(course.title);
                    const enrolled = enrollment?.payment_status === "completed";
                    const partial = enrollment?.payment_status === "partial";

                    return (
                      <div
                        key={course.id}
                        className="group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full active:scale-95"
                      >

                        {/* Image */}
                        <Link
                          to={`/course/${course.id}`}
                          className="block overflow-hidden relative h-40 sm:h-44"
                        >
                          <img
                            src={course.img}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {added && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                              <CheckCircle size={14} />
                            </div>
                          )}

                          {enrolled && (
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                <CheckCircle className="text-green-500" size={16} />
                                <span className="text-slate-800 font-bold text-xs uppercase tracking-widest">Enrolled</span>
                              </div>
                            </div>
                          )}
                        </Link>

                        {/* Content */}
                        <div className="p-4 sm:p-5 flex flex-col flex-1">

                          <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1">
                            {course.category}
                          </p>

                          <Link to={`/course/${course.id}`}>
                            <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight mb-2 line-clamp-2">
                              {course.title}
                            </h3>
                          </Link>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-1">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-slate-500 text-xs font-semibold">
                              {course.rating}
                            </span>
                            <span className="text-slate-300 mx-1">•</span>
                            <span className="text-slate-500 text-xs">
                              {course.students}
                            </span>
                          </div>



                          {/* Buttons */}
                          <div className="mt-auto pt-3 border-t border-slate-100 flex gap-2 flex-wrap">

                            {/* Enroll / Pay Balance */}
                            {enrolled ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigate("/my-courses");
                                }}
                                className="flex-1 py-2.5 sm:py-3 bg-green-100 text-green-600 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm active:scale-95 border border-green-200"
                              >
                                Enrolled
                              </button>
                            ) : partial ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigate("/checkout", {
                                    state: {
                                      items: [course],
                                      isBalancePayment: true,
                                      totalOriginal: enrollment.total_fee,
                                      amountPreviouslyPaid: enrollment.amount_paid
                                    }
                                  });
                                }}
                                className="flex-1 py-2.5 sm:py-3 bg-orange-500 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm active:scale-95 shadow-lg shadow-orange-500/20"
                              >
                                Pay Balance
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigate(`/course/${course.id}`);
                                }}
                                className="flex-1 py-2.5 sm:py-3 bg-blue-500 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm active:scale-95"
                              >
                                Enroll
                              </button>
                            )}

                            {/* Cart */}
                            <button
                              onClick={(e) => !enrolled && handleAddToCart(e, course)}
                              disabled={added || enrolled}
                              className={`flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-center ${added || enrolled
                                ? "bg-green-100 text-green-600"
                                : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              {added || enrolled ? <CheckCircle size={18} /> : <ShoppingCart size={18} />}
                            </button>

                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* No Results */}
              {mode === "Online" && filteredCourses.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-400">No courses found</p>
                </div>
              )}
            </div>

            {mode === "Online" && filteredCourses.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-lg">No courses found matching your search.</p>
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="mt-4 text-blue-500 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {showForm && selectedCourse === "POIP" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BLUR BACKGROUND */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setShowForm(false)}
          ></div>

          {/* FORM CARD */}
          <div className="relative w-[92%] sm:w-[90%] max-w-lg bg-white rounded-3xl shadow-2xl p-5 sm:p-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Join POIP Program
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X className="text-slate-400 hover:text-red-500" />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  phone: e.target.phone.value,
                  program: "POIP",
                  course: e.target.course.value,
                };

                await fetch("https://script.google.com/macros/s/AKfycbwwXGHyymh2jV8Pjvbt8TI11UmG7FnhtbRRYd44LhDdnokRJiHjNAhcMgY8FWnlNP9U/exec", {
                  method: "POST",
                  body: JSON.stringify(formData),
                });

                alert("POIP Submitted!");
                setShowForm(false);
              }}
              className="space-y-4"
            >

              {/* NAME */}
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl border"
              />

              {/* EMAIL */}
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl border"
              />

              {/* PHONE */}
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-xl border"
              />

              {/* ✅ DROPDOWN (ADD HERE) */}
<div className="relative">

  {/* INPUT BOX */}
  <div
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white flex justify-between items-center cursor-pointer"
  >
    <span className={selectedOption ? "text-slate-800" : "text-slate-400"}>
      {selectedOption || "Select Course"}
    </span>

    <ChevronDown
      size={18}
      className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
    />
  </div>

  {/* DROPDOWN LIST */}
  {isDropdownOpen && (
    <div className="absolute z-50 mt-2 w-full max-h-52 overflow-y-auto bg-white border rounded-xl shadow-lg">

      {courseOptions.map((course, i) => (
        <div
          key={i}
          onClick={() => {
            setSelectedOption(course);
            setIsDropdownOpen(false);
          }}
          className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm"
        >
          {course}
        </div>
      ))}

    </div>
  )}

</div>

              {/* BUTTON */}
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl">
                Submit Application
              </button>

            </form>

          </div>
        </div>
      )}

      {showForm && selectedCourse === "COIP" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setShowForm(false)}
          ></div>

          <div className="relative w-[92%] sm:w-[90%] max-w-lg bg-white rounded-3xl shadow-2xl p-5 sm:p-8">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Join COIP Program
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X className="text-slate-400 hover:text-red-500" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  phone: e.target.phone.value,
                  program: "COIP",
                  course: e.target.course.value,
                };

                await fetch("https://script.google.com/macros/s/AKfycbwwXGHyymh2jV8Pjvbt8TI11UmG7FnhtbRRYd44LhDdnokRJiHjNAhcMgY8FWnlNP9U/exec", {
                  method: "POST",
                  body: JSON.stringify(formData),
                });

                alert("COIP Submitted!");
                setShowForm(false);
              }}
              className="space-y-4"
            >

              {/* NAME */}
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl border"
              />

              {/* EMAIL */}
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl border"
              />

              {/* PHONE */}
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-xl border"
              />

              {/* ✅ DROPDOWN (ADD HERE) */}
<div className="relative">

  {/* INPUT BOX */}
  <div
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white flex justify-between items-center cursor-pointer"
  >
    <span className={selectedOption ? "text-slate-800" : "text-slate-400"}>
      {selectedOption || "Select Course"}
    </span>

    <ChevronDown
      size={18}
      className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
    />
  </div>

  {/* DROPDOWN LIST */}
  {isDropdownOpen && (
    <div className="absolute z-50 mt-2 w-full max-h-52 overflow-y-auto bg-white border rounded-xl shadow-lg">

      {courseOptions.map((course, i) => (
        <div
          key={i}
          onClick={() => {
            setSelectedOption(course);
            setIsDropdownOpen(false);
          }}
          className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm"
        >
          {course}
        </div>
      ))}

    </div>
  )}

</div>

              {/* BUTTON */}
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl">
                Submit Application
              </button>

            </form>

          </div>
        </div>
      )}

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-[300] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsFilterDrawerOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[3rem] shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800">Filters</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Refine your search</p>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-3 bg-slate-50 rounded-2xl text-slate-400 active:scale-90 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32">
              {/* Category Selection */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Select Category</p>
                <div className="grid grid-cols-2 gap-3 items-stretch">
                  {["All", "Software Development", "Testing", "UI/UX Design", "DevOps", "AI/ML", "Data Science", "Soft Skills"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                     className={`px-3 py-3 rounded-2xl font-bold text-[12px] leading-tight flex items-center justify-center text-center h-[50px] truncate ${
  category === cat
    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-[1.02]"
    : "bg-slate-50 text-slate-600 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30"
}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-md border-t border-slate-50">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer is now handled globally */}
    </>
  );
};

export default Explore;



