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
           const mappedDbCourses = data.map(c => ({
             id: c.id + 1000,
             title: c.title,
             category: c.category || "New",
             students: "New",
             rating: "4.8",
             img: c.imageUrl ? (c.imageUrl.startsWith("http") ? c.imageUrl : `http://127.0.0.1:8000${c.imageUrl}`) : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
           }));
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