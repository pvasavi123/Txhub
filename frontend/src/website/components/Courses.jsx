import React, { useState, useContext } from "react";
import { Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../context/CartContext";
import awsImg from "../assets/aws.jpg";
import javaImg from "../assets/java_full.jpg";
import reactImg from "../assets/react_full.jpg";
import mlImg from "../assets/ml.jpg";
import uiImg from "../assets/ui_ux.jpg";
import mernImg from "../assets/mern stack development.jpg";
import frontendImg from "../assets/fronteend development.jpg";
import pythonImg from "../assets/python full stack.jpg";
import dataAnalyticsImg from "../assets/Data Analytics.jpg";
import dataScienceImg from "../assets/dataScience.jpg";
import softImg from "../assets/soft.jpg";

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

const trendingCourses = [
  {
    id: 0,
    title: "React Full Stack Development",
    category: "Development",
    students: "1,240 students",
    rating: "4.9",
    // price: "3,999",
    img: reactImg,
  },
  {
    id: 1,
    title: "Selenium Automation Testing",
    category: "Testing",
    students: "890 students",
    rating: "4.7",
    // price: "3,999",
    img: "https://tse2.mm.bing.net/th/id/OIP.g_b84bPN6qKvVjeNS3cmeQHaEH?pid=Api&P=0&h=180",
  },
  {
    id: 2,
    title: "Figma UI/UX Complete Guide",
    category: "UI/UX Design",
    students: "1,050 students",
    rating: "4.8",
    // price: "3,999",
    img: uiImg,
  },
];

const popularCourses = [
  {
    id: 4,
    title: "AWS & DevOps",
    category: "DevOps",
    students: "2,100 students",
    rating: "4.9",
    // price: "3,999",
    img: awsImg,
  },
  {
    id: 3,
    title: "Java Full Stack Development",
    category: "Development",
    students: "1,800 students",
    rating: "4.8",
    // price: "3,999",
    img: javaImg,
  },
  {
    id: 5,
    title: "Machine Learning",
    category: "AI/ML",
    students: "950 students",
    rating: "4.7",
    // price: "3,999",
    img: mlImg,
  },
];

const Courses = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [notification, setNotification] = useState(null);
  const [dbCourses, setDbCourses] = useState([]);
  
  React.useEffect(() => {
    const fetchDbCourses = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/courses-list/");
        const data = await res.json();
        if (res.ok) {
           const mappedDbCourses = data.map(c => {
             const assetImg = getAssetImage(c.title);
             const fallback = getCourseFallbackImage(c.title, c.category);
             return {
               id: c.id + 1000,
               title: c.title,
               category: c.category || "New",
               students: "New",
               rating: "4.8",
               img: assetImg ? assetImg : (c.imageUrl ? (c.imageUrl.startsWith("http") ? c.imageUrl : `http://127.0.0.1:8000${c.imageUrl}`) : fallback)
             };
           });
           setDbCourses(mappedDbCourses);
        }
      } catch (err) { console.error("Failed to fetch DB courses"); }
    };
    fetchDbCourses();
  }, []);
  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);

  const courses =
    activeTab === "trending" ? [...trendingCourses, ...dbCourses] : [...popularCourses, ...dbCourses];

  return (
    <section id="courses" className="bg-slate-50 py-8 sm:py-12 lg:py-16 relative">
      
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
          <div className="bg-white border px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
            <CheckCircle className="text-green-500" size={18} />
            <span className="text-sm font-semibold">
              {notification} added
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* Title */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900">
            Our Courses
          </h2>
          <div className="h-1 w-16 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="bg-gray-200 rounded-full p-1 flex min-w-max">
            <button
              onClick={() => setActiveTab("trending")}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium ${
                activeTab === "trending"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600"
              }`}
            >
              Trending
            </button>

            <button
              onClick={() => setActiveTab("popular")}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium ${
                activeTab === "popular"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600"
              }`}
            >
              Popular
            </button>
          </div>
        </div>

        {/* Grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="contents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {courses.map((course, index) => {
                const added = isInCart(course.title);

                return (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer flex flex-col active:scale-95"
                  >

                    {/* Image */}
                    <div className="h-36 sm:h-40 overflow-hidden relative">
                      <img
                        src={course.img}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />

                      {added && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                          <CheckCircle size={14} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">

                      <p className="text-blue-600 text-xs font-bold uppercase">
                        {course.category}
                      </p>

                      <h3 className="text-sm sm:text-lg font-bold line-clamp-2 mt-1">
                        {course.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center mt-2">
                        {[1,2,3,4,5].map((s)=>(
                          <Star
                            key={s}
                            size={14}
                            className={s <= Math.round(parseFloat(course.rating))
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"}
                          />
                        ))}
                        <span className="text-xs ml-1">{course.rating}</span>
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {course.students}
                      </p>

                      {/* Bottom */}
                      {/* <div className="flex justify-between items-center mt-auto pt-3 border-t">
                        <p className="font-bold text-sm sm:text-lg">
                          ₹{course.price}
                        </p> */}

                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/course/${course.id}`);
                          }}
                          className="px-3 sm:px-5 py-1.5 text-xs sm:text-sm bg-blue-50 text-blue-600 rounded-lg"
                        >
                          Details
                        </button> */}
                      {/* </div> */}

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  );
};

export default Courses;