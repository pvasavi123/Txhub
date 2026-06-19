
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import SEO from "../components/SEO";
import { Star, CheckCircle, Clock, Calendar, MapPin, Globe, BookOpen, GraduationCap, ArrowRight, Video, Lock } from "lucide-react";
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

/**
 * Detailed course data including all curricula, requirements, and metadata.
 * Indexed by ID to match the Explore page navigation.
 */
const courseData = [
  {
    id: 0,
    title: "React Full Stack Development",
    description: "Master the art of building scalable web applications using the MERN stack (MongoDB, Express, React, Node.js). This course takes you from frontend fundamentals to advanced backend architecture.",
    price: "4,999",
    rating: "4.9",
    students: "1,240 students",
    language: "English",
    duration: "3 Months",
    mode: "Online",
    location: "Hyderabad",
    batchStart: "04 May 2026",
    category: "Software Development",
    img: reactImg,
    instructor: "John Developer",
    instructorBio: "Senior Full Stack Engineer with 10+ years of experience in React and Node.js ecosystems.",
    instructorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    instructorCourses: [
      { id: 3, title: "Java Full Stack Development", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4", price: "3,999" },
      { id: 5, title: "Machine Learning Masterclass", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995", price: "3,999" }
    ],
    learn: [
      "Modern React Hook & Context API",
      "Node.js & Express REST APIs",
      "MongoDB Database Design",
      "Fullstack Authentication with JWT"
    ],
    content: [
      "Introduction to Modern Web Development",
      "React Components & State Management",
      "Backend Development with Node.js",
      "Database Integration & Deployment"
    ],
    requirements: [
      "Basic HTML, CSS, and JavaScript knowledge",
      "A laptop with at least 8GB RAM",
      "Curiosity to learn and build projects"
    ]
  },
  {
    id: 1,
    title: "Selenium Automation Testing",
    description: "Go from manual tester to automation expert. Learn how to write robust, maintainable test scripts using Selenium WebDriver and Java for enterprise-level applications.",
    price: "4,999",
    rating: "4.7",
    students: "890 students",
    language: "English",
    duration: "2 Months",
    mode: "Internship",
    location: "Remote",
    batchStart: "15 April 2026",
    category: "Testing",
    img: "https://tse2.mm.bing.net/th/id/OIP.g_b84bPN6qKvVjeNS3cmeQHaEH",
    instructor: "Ravi Testing",
    learn: [
      "Selenium WebDriver Architectures",
      "TestNG & Maven Integration",
      "Page Object Model (POM) Design",
      "Cucumber & BDD Frameworks"
    ],
    content: [
      "Automation Fundamentals",
      "Writing Your First Test Script",
      "Advanced Locators & Actions",
      "Framework Development from Scratch"
    ],
    requirements: [
      "Basic programming knowledge",
      "Interest in automation and QA",
      "A machine with Java installed"
    ],
    instructorBio: "Expert QA Automation Engineer specialized in Selenium and Java testing frameworks.",
    instructorImage: "https://randomuser.me/api/portraits/men/45.jpg",
    instructorCourses: [
      { id: 0, title: "React Full Stack", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c", price: "3,999" }
    ]
  },
  {
    id: 2,
    title: "Figma UI/UX Complete Guide",
    description: "Design stunning user interfaces and research impactful user experiences. This course covers everything from wireframing to high-fidelity prototyping in Figma.",
    price: "4,999",
    rating: "4.8",
    students: "1,050 students",
    language: "English",
    duration: "1.5 Months",
    mode: "Offline",
    location: "Hyderabad",
    batchStart: "04 May 2026",
    category: "UI/UX Design",
    img: uiImg,
    instructor: "Design Expert Sarah",
    learn: [
      "User Research & Empathy Mapping",
      "Wireframing & Visual Design",
      "Interactive Prototyping in Figma",
      "Design Systems & Handover"
    ],
    content: [
      "UX Design Foundations",
      "Mastering Figma Layouts & Components",
      "Visual Design Principles",
      "Portfolio Project & Review"
    ],
    requirements: [
      "No prior design experience needed",
      "A creative mindset",
      "Figma account (free version is fine)"
    ]
  },
  {
    id: 3,
    title: "Java Full Stack Development",
    description: "Become an enterprise-ready Java developer. Learn Core Java, Spring Boot, and React to build secure, high-performance web applications used by major corporations.",
    price: "4,999",
    rating: "4.6",
    students: "980 students",
    language: "English",
    duration: "3 Months",
    mode: "Online",
    location: "Hyderabad",
    batchStart: "04 May 2026",
    category: "Software Development",
    img: javaImg,
    instructor: "Advanced Java Guru",
    learn: [
      "Core Java & Multi-threading",
      "Spring Boot & Microservices",
      "React Integration with Java APIs",
      "Database Security & SQL"
    ],
    content: [
      "Java Language Deep-Dive",
      "Developing Backend with Spring",
      "Frontend with React & Redux",
      "Project Deployment & CI/CD"
    ],
    requirements: [
      "Basic understanding of programming",
      "Familiarity with logic and math",
      "Passionate about enterprise tech"
    ]
  },
  {
    id: 4,
    title: "AWS & DevOps",
    description: "Master the cloud. Learn to manage infrastructure at scale using AWS services, Docker, Kubernetes, and modern DevOps tools to speed up delivery cycles.",
    price: "4,999",
    rating: "4.9",
    students: "1,400 students",
    language: "English",
    duration: "2.5 Months",
    mode: "Training & Internship",
    location: "Remote",
    batchStart: "04 May 2026",
    category: "DevOps",
    img: awsImg,
    instructor: "Cloud Solutions Architect",
    learn: [
      "AWS Core Services (EC2, S3, RDS)",
      "Containerization with Docker",
      "Kubernetes Orchestration",
      "Jenkins & CI/CD Pipelines"
    ],
    content: [
      "Cloud Foundation & IAM",
      "Virtualization & Networking",
      "Infrastructure as Code",
      "Monitoring & Scaling Strategies"
    ],
    requirements: [
      "Basic Networking knowledge",
      "Familiarity with the Linux terminal",
      "An active AWS Free Tier account"
    ]
  },
  {
    id: 5,
    title: "Machine Learning",
    description: "Step into the world of Data Science and AI. Learn the math, the algorithms, and the Python tools required to build predictive models and analyze complex datasets.",
    price: "4,999",
    rating: "4.8",
    students: "1,200 students",
    language: "English",
    duration: "3 Months",
    mode: "Offline",
    location: "Remote",
    batchStart: "5 May 2026",
    category: "AI/ML",
    img: mlImg,
    instructor: "ML Scientist Alex",
    learn: [
      "Supervised & Unsupervised Learning",
      "Python Data Science Libraries",
      "Neural Networks & Deep Learning",
      "Model Training & Optimizaton"
    ],
    content: [
      "Statistics & Linear Algebra",
      "Regression & Decision Trees",
      "Natural Language Processing",
      "AI Ethical Considerations"
    ],
    requirements: [
      "Intermediate Python knowledge",
      "Basic understanding of Calculus",
      "A machine capable of running ML libs"
    ]
  },
  {
    id: 6,
    title: "Data Science Fundamentals",
    description: "Learn the core concepts of Data Science, including data exploration, visualization, and statistical modeling. Master the tools needed to turn raw data into actionable insights.",
    price: "4,999",
    rating: "4.8",
    students: "2,100 students",
    language: "English",
    duration: "3 Months",
    mode: "Online",
    location: "Remote",
    batchStart: "05 May 2026",
    category: "Data Science",
    img: dataScienceImg,
    instructor: "Sarah Data",
    instructorBio: "Senior Data Scientist with 7+ years of experience in predictive modeling and machine learning.",
    instructorImage: "https://randomuser.me/api/portraits/women/3.jpg",
    learn: [
      "Python for Data Science",
      "Exploratory Data Analysis",
      "Statistical Hypothesis Testing",
      "Data Visualization with Seaborn"
    ],
    content: [
      "Introduction to Data Science",
      "Data Wrangling & Cleaning",
      "Statistical Foundations",
      "Final Capstone Project"
    ],
    requirements: [
      "Basic math skills",
      "No prior coding experience required",
      "A curious and analytical mind"
    ]
  },
  {
    id: 7,
    title: "MERN Stack Crash Course",
    description: "Master the art of building scalable web applications using the MERN stack (MongoDB, Express, React, Node.js). This course takes you from frontend fundamentals to advanced backend architecture.",
    price: "4,999",
    rating: "4.7",
    students: "1,850 students",
    language: "English",
    duration: "3 Months",
    mode: "Online",
    location: "Hyderabad",
    batchStart: "04 May 2026",
    category: "Software Development",
    img: mernImg,
    instructor: "John Developer",
    instructorBio: "Senior Full Stack Engineer with 10+ years of experience in React and Node.js ecosystems.",
    instructorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    instructorCourses: [
      { id: 3, title: "Java Full Stack Development", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4", price: "3,999" },
      { id: 5, title: "Machine Learning Masterclass", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995", price: "3,999" }
    ],
    learn: [
      "Modern React Hook & Context API",
      "Node.js & Express REST APIs",
      "MongoDB Database Design",
      "Fullstack Authentication with JWT"
    ],
    content: [
      "Introduction to Modern Web Development",
      "React Components & State Management",
      "Backend Development with Node.js",
      "Database Integration & Deployment"
    ],
    requirements: [
      "Basic HTML, CSS, and JavaScript knowledge",
      "A laptop with at least 8GB RAM",
      "Curiosity to learn and build projects"
    ]
  },
  {
    id: 8,
    title: "Front End Web Development",
    description: "Build beautiful, responsive, and interactive user interfaces using modern HTML, CSS, and JavaScript. Master React and Tailwind CSS to create professional-grade web applications.",
    price: "4,999",
    rating: "4.9",
    students: "3,200 students",
    language: "English",
    duration: "2 Months",
    mode: "Offline",
    location: "Hyderabad",
    batchStart: "04 May 2026",
    category: "Software Development",
    img: frontendImg,
    instructor: "Sarah Frontend",
    instructorBio: "Expert UI Developer with 8+ years of experience in modern frontend frameworks.",
    instructorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    learn: [
      "Semantic HTML5 & Modern CSS",
      "Advanced JavaScript & ES6+",
      "React Components & State",
      "Responsive Design & Tailwind"
    ],
    content: [
      "Web Foundations",
      "JavaScript Deep Dive",
      "Modern UI with React",
      "Performance & Deployment"
    ],
    requirements: [
      "Basic computer literacy",
      "Interest in design",
      "No prior coding needed"
    ]
  },
  {
    id: 9,
    title: "Python Full Stack",
    description: "Become a versatile developer by mastering Python for both backend and frontend development. Learn Django, PostgreSQL, and React to build robust full-stack applications.",
    price: "4,999",
    rating: "4.8",
    students: "900 students",
    language: "English",
    duration: "3.5 Months",
    mode: "Training",
    location: "Hyderabad",
    batchStart: "10 May 2026",
    category: "Software Development",
    img: pythonImg,
    instructor: "Guido Dev",
    instructorBio: "Senior Python Architect specialized in Django and scalable backend systems.",
    instructorImage: "https://randomuser.me/api/portraits/men/11.jpg",
    learn: [
      "Python Programming Basics",
      "Django Web Framework",
      "REST APIs with Django",
      "React Frontend Integration"
    ],
    content: [
      "Python Fundamentals",
      "Web Apps with Django",
      "Database Design & SQL",
      "Frontend Development"
    ],
    requirements: [
      "Basic logical thinking",
      "Laptop with 8GB RAM",
      "Dedication to learn"
    ]
  },
  {
    id: 10,
    title: "Data Analytics Masterclass",
    description: "Unlock insights from data using Python, SQL, and PowerBI. Learn to clean, analyze, and visualize data to drive business decisions.",
    price: "4,999",
    rating: "4.6",
    students: "1,150 students",
    language: "English",
    duration: "2.5 Months",
    mode: "Online",
    location: "Remote",
    batchStart: "15 May 2026",
    category: "Data Science",
    img: dataAnalyticsImg,
    instructor: "Dr. Data",
    instructorBio: "Data Scientist with a PhD in Statistics and 10+ years of corporate analytics experience.",
    instructorImage: "https://randomuser.me/api/portraits/women/65.jpg",
    learn: [
      "Data Cleaning with Pandas",
      "SQL for Data Analysis",
      "Visualizing with Tableau/PowerBI",
      "Statistical Analysis Basics"
    ],
    content: [
      "Introduction to Analytics",
      "Advanced SQL Queries",
      "Python for Data Science",
      "Business Intelligence Tools"
    ],
    requirements: [
      "Basic math knowledge",
      "Interest in numbers",
      "Excel familiarity is a plus"
    ]
  },
  {
    id: 11,
    title: "Advanced Software Testing",
    description: "Master enterprise-level testing strategies. Learn about performance testing, security testing, and advanced automation frameworks.",
    price: "4,499",
    rating: "4.8",
    students: "1,450 students",
    language: "English",
    duration: "2 Months",
    mode: "Offline",
    location: "Hyderabad",
    batchStart: "20 May 2026",
    category: "Testing",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    instructor: "Mike Tester",
    instructorBio: "QA Lead with expertise in performance and security testing for large-scale systems.",
    instructorImage: "https://randomuser.me/api/portraits/men/22.jpg",
    learn: [
      "Performance Testing (JMeter)",
      "Security & Pentesting Basics",
      "CI/CD in Testing",
      "Cloud Testing Strategies"
    ],
    content: [
      "Advanced Test Planning",
      "Automated Performance Tests",
      "Security Vulnerability Checks",
      "Agile Testing Mindset"
    ],
    requirements: [
      "Basic QA knowledge",
      "Familiarity with Selenium",
      "Analytical mindset"
    ]
  },
  {
    id: 12,
    title: "API Testing with Postman",
    description: "Learn how to test and document REST APIs efficiently using Postman. Automate your API tests and ensure high-quality communication between services.",
    price: "4,999",
    rating: "4.9",
    students: "980 students",
    language: "English",
    duration: "1 Month",
    mode: "Online",
    location: "Remote",
    batchStart: "25 May 2026",
    category: "Testing",
    img: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80",
    instructor: "Alex API",
    instructorBio: "Backend Developer and API specialist with a passion for quality assurance.",
    instructorImage: "https://randomuser.me/api/portraits/men/5.jpg",
    learn: [
      "REST API Fundamentals",
      "Postman Collections & Scripts",
      "API Automation Testing",
      "Mocking & Documentation"
    ],
    content: [
      "Introduction to APIs",
      "Postman Essentials",
      "Scripting & Automation",
      "Integration Testing"
    ],
    requirements: [
      "Basic understanding of Web",
      "Curiosity about APIs",
      "Laptop installed with Postman"
    ]
  },
  {
    id: 13,
    title: "Mobile App Automation (Appium)",
    description: "Master mobile application testing for iOS and Android. Learn to write automated test scripts using Appium and enhance mobile app quality.",
    price: "4,999",
    rating: "4.7",
    students: "600 students",
    language: "English",
    duration: "2 Months",
    mode: "Training",
    location: "Hyderabad",
    batchStart: "01 June 2026",
    category: "Testing",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    instructor: "Mobile Guru",
    instructorBio: "Expert Mobile QA Engineer with experience in both native and hybrid app testing.",
    instructorImage: "https://randomuser.me/api/portraits/men/88.jpg",
    learn: [
      "Mobile Testing Ecosystem",
      "Appium Framework Setup",
      "Android & iOS Automation",
      "Mobile Device Cloud Testing"
    ],
    content: [
      "Appium Fundamentals",
      "Handling Mobile Elements",
      "Cross-Platform Testing",
      "Continuous Integration for Mobile"
    ],
    requirements: [
      "Basic Java/Python knowledge",
      "Machine with Android Studio",
      "Passion for mobile tech"
    ]
  },
  {
    id: 14,
    title: "Leadership & Team Management",
    description: "Transition from an individual contributor to an effective leader. Learn to manage teams, resolve conflicts, and drive project success.",
    price: "4,999",
    rating: "4.9",
    students: "1,120 students",
    language: "English",
    duration: "1 Month",
    mode: "Online",
    location: "Remote",
    batchStart: "10 June 2026",
    category: "Soft Skills",
    img: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
    instructor: "Leader Jane",
    instructorBio: "Senior Management Consultant with 15+ years of experience in leading multi-national teams.",
    instructorImage: "https://randomuser.me/api/portraits/women/10.jpg",
    learn: [
      "Strategic Planning",
      "Conflict Resolution",
      "Agile Team Leadership",
      "Effective Communication"
    ],
    content: [
      "Leadership Styles",
      "Team Building & Dynamics",
      "Performance Management",
      "Stakeholder Communication"
    ],
    requirements: [
      "Professional experience",
      "Willingness to grow",
      "Empathy and open-mindedness"
    ]
  },
  {
    id: 15,
    title: "Public Speaking Mastery",
    description: "Overcome stage fright and become a confident speaker. Learn the art of storytelling, body language, and persuasive communication.",
    price: "4,999",
    rating: "4.8",
    students: "850 students",
    language: "English",
    duration: "1.5 Months",
    mode: "Offline",
    location: "Hyderabad",
    batchStart: "15 June 2026",
    category: "Soft Skills",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    instructor: "Orator Mark",
    instructorBio: "Professional speaker and toastmaster with over 500+ successful stage presentations.",
    instructorImage: "https://randomuser.me/api/portraits/men/33.jpg",
    learn: [
      "Vocal Variety & Tone",
      "Body Language Mastery",
      "Storytelling Techniques",
      "Handling Q&A Sessions"
    ],
    content: [
      "Speech Preparation",
      "Engagement Strategies",
      "Visual Aids & Slides",
      "Real-world Practice"
    ],
    requirements: [
      "Desire to communicate better",
      "Regular practice commitment",
      "Open to feedback"
    ]
  },
  {
    id: 16,
    title: "Critical Thinking & Problem Solving",
    description: "Enhance your decision-making skills and learn to solve complex problems logically. Develop a framework for analytical thinking in professional environments.",
    price: "4,999",
    rating: "4.7",
    students: "950 students",
    language: "English",
    duration: "1 Month",
    mode: "Online",
    location: "Remote",
    batchStart: "20 June 2026",
    category: "Soft Skills",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    instructor: "Thinker Sam",
    instructorBio: "Cognitive psychologist and corporate strategy consultant specializing in decision science.",
    instructorImage: "https://randomuser.me/api/portraits/men/15.jpg",
    learn: [
      "Logical Fallacies & Biases",
      "Root Cause Analysis",
      "Creative Solution Design",
      "Strategic Decision Making"
    ],
    content: [
      "Thinking Frameworks",
      "Analyzing Complex Data",
      "Problem-Solving Workshops",
      "Collaborative Decisions"
    ],
    requirements: [
      "Analytical mindset",
      "Eagerness to learn",
      "No specific prerequisites"
    ]
  },
  {
    id: 99,
    title: "Manual Testing Complete Course",
    description: "Master the fundamentals of software testing. Learn about test planning, execution, bug reporting, and the software development lifecycle from a QA perspective.",
    price: "4,999",
    rating: "4.8",
    students: "1,520 students",
    language: "English",
    duration: "1.5 Months",
    mode: "Online",
    location: "Remote",
    batchStart: "04 May 2026",
    category: "Testing",
    img: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80",
    instructor: "Kevin QA",
    instructorBio: "QA Manager with 12+ years of experience in manual and automated testing processes.",
    instructorImage: "https://randomuser.me/api/portraits/men/42.jpg",
    learn: [
      "SDLC & STLC Methodologies",
      "Test Case Design Techniques",
      "Defect Lifecycle & Reporting",
      "Agile & Scrum Testing"
    ],
    content: [
      "Testing Fundamentals",
      "Types of Testing",
      "Test Planning & Management",
      "Real-world Project Testing"
    ],
    requirements: [
      "Attention to detail",
      "Basic computer knowledge",
      "Communication skills"
    ]
  },
];


const relatedCourses = [
  { id: 3, title: "Java Full Stack Development", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4", price: "3,999" },
  { id: 4, title: "AWS & DevOps", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa", price: "3,999" },
  { id: 2, title: "Figma UI/UX Complete Guide", img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e", price: "3,999" },
];

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);

  const { isLoggedIn, openAuthModal, user } = useContext(AuthContext);
  const [notification, setNotification] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courseLiveSessions, setCourseLiveSessions] = useState([]);
  const [dbCourse, setDbCourse] = useState(null);

  useEffect(() => {
    if (parseInt(id) >= 1000) {
      const fetchDbCourse = async () => {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/courses-list/");
          const data = await res.json();
          if (res.ok) {
            const match = data.find(c => (c.id + 1000).toString() === id);
            if (match) {
               setDbCourse({
                 id: match.id + 1000,
                 title: match.title,
                 description: match.details || `Learn ${match.title} with expert instructors.`,
                 price: match.price || "4,999",
                 rating: "4.8",
                 students: "New",
                 language: "English",
                 duration: match.duration || "Flexible",
                 mode: "Online",
                 location: "Remote",
                 batchStart: "Flexible",
                 category: match.category || "Software Development",
                 img: match.imageUrl ? (match.imageUrl.startsWith("http") ? match.imageUrl : `http://127.0.0.1:8000${match.imageUrl}`) : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
                 instructor: "TXhub Expert",
                 instructorBio: "Experienced industry professional with a track record of success.",
                 instructorImage: "https://randomuser.me/api/portraits/men/32.jpg",
                 learn: ["Core concepts and fundamentals", "Hands-on projects", "Industry best practices"],
                 content: ["Introduction", "Core Modules", "Advanced Topics", "Final Project"],
                 requirements: ["Basic computer skills", "Willingness to learn and practice"]
               });
            }
          }
        } catch (err) { console.error("DB course fetch failed"); }
      };
      fetchDbCourse();
    }
  }, [id]);

  useEffect(() => {
    const fetchEnrollmentsAndLive = async () => {
      // 1. Fetch live classes globally
      try {
        const liveRes = await fetch(`http://127.0.0.1:8000/api/live/`);
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          setCourseLiveSessions(liveData);
        }
      } catch (err) { console.error("Live fetch failed"); }

      // 2. Fetch Enrollments
      if (!user?.email) return;
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/enrollments/?email=${user.email}`);
        const data = await response.json();
        if (response.ok) setEnrollments(data.data || []);
      } catch (err) { console.error("Enrollment check failed"); }
    };
    fetchEnrollmentsAndLive();
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const course = courseData.find(c => c.id.toString() === id) || dbCourse;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4">Course Not Found</h2>
          <button onClick={() => navigate("/explore")} className="text-blue-600 font-bold hover:underline">
            ← Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const added = isInCart(course.title);
  const enrollment = enrollments.find(e =>
    (e.title && (e.title.toLowerCase().includes(course.title.toLowerCase()) || course.title.toLowerCase().includes(e.title.toLowerCase()))) ||
    (e.items && e.items.some(item => item.id === course.id))
  );
  const enrolled = enrollment?.payment_status === "completed";
  const partial = enrollment?.payment_status === "partial";

  const handleEnroll = () => {
    if (!isLoggedIn) {
      openAuthModal("login");
    } else {
      navigate("/checkout", { state: { items: [course], direct: true } });
    }
  };

  const activeLiveSessions = courseLiveSessions.filter(session => session.targetCourse === course.title);

  const handleAddToCart = () => {
    const success = addToCart(course);
    if (success) {
      setNotification(course.title);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <>
      <SEO
        title={course.title}
        description={course.description || `Learn ${course.title} at TXhub. Expert-led training with hands-on projects.`}
        ogImage={course.img}
        ogType="article"
      />
      {/* Navbar handled globally */}

      {/* Dynamic Toast Notification */}
      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-bottom duration-300">
          <div className="bg-white/90 backdrop-blur-md border border-blue-200 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-slate-800 font-black text-lg leading-none">{notification}</p>
              <p className="text-slate-400 text-sm mt-1">Has been added to your cart</p>
            </div>
          </div>
        </div>
      )}

      <section className="pt-28 pb-16 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">

          {/* MAIN CONTENT COLUMN */}
          <div className="lg:col-span-2">

            {/* Featured Image & Overlays */}
            <div className="relative group overflow-hidden rounded-[2.5rem]">
              <img
                src={course.img}
                alt={course.title}
                className="w-full h-56 sm:h-72 md:h-[28rem] object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* <div className="absolute top-8 left-8 flex gap-3">
                <span className="bg-white/95 backdrop-blur px-5 py-2.5 rounded-2xl text-blue-600 font-black shadow-sm uppercase tracking-widest text-[10px]">
                  {course.category}
                </span>
                <span className="bg-blue-600 px-5 py-2.5 rounded-2xl text-white font-black shadow-lg uppercase tracking-widest text-[10px]">
                  {course.mode}
                </span>
              </div> */}
            </div>

            {/* Title & Stats */}
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-10 tracking-tight leading-tight">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <span className="font-black text-yellow-700 text-lg">{course.rating}</span>
                <span className="text-yellow-600/50 text-sm font-bold">({course.students.split(' ')[0]})</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 font-bold italic">
                <Globe size={18} className="text-blue-400" />
                <span>{course.language}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 font-bold italic">
                <Calendar size={18} className="text-blue-400" />
                <span>Starts {course.batchStart}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-xl mt-8 leading-relaxed font-medium">
              {course.description}
            </p>

            {/* Premium Info Grid */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-500/5 mt-10 grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { label: "Duration", value: course.duration, icon: <Clock className="text-blue-500" size={20} /> },
                { label: "Batch Start", value: course.batchStart, icon: <Calendar className="text-blue-500" size={20} /> },
                { label: "Location", value: course.location, icon: <MapPin className="text-blue-500" size={20} /> },
                { label: "Certificate", value: "Available", icon: <GraduationCap className="text-blue-500" size={20} /> },
                { label: "Level", value: "All Levels", icon: <BookOpen className="text-blue-500" size={20} /> },
                { label: "Access", value: "Lifetime", icon: <Globe className="text-blue-500" size={20} /> }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{item.label}</p>
                  </div>
                  <p className="font-black text-slate-800 text-lg ml-7">{item.value}</p>
                </div>
              ))}
            </div>

            {activeLiveSessions.length > 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-[2.5rem] shadow-xl mt-10 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Video size={100} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                      <span className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
                      </span>
                      Active Live Broadcasts
                    </h2>
                    <p className="text-blue-100 font-medium">Join scheduled interactive sessions led by industry experts.</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4 relative z-10">
                  {activeLiveSessions.map((session, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">{session.batchMonth} Batch</p>
                        <h3 className="font-bold text-lg">{session.topic}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg text-sm font-bold">
                          <Calendar size={16} /> {session.date}
                        </div>
                        {session.time && (
                          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg text-sm font-bold">
                            <Clock size={16} /> {session.time}
                          </div>
                        )}
                        {enrolled ? (
                          <a href={session.link} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white text-blue-600 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shrink-0">
                            <Video size={18} /> Join Now
                          </a>
                        ) : (
                          <button onClick={handleEnroll} className="px-5 py-2.5 bg-white/20 text-white rounded-xl font-bold flex items-center gap-2 shadow-inner shrink-0 cursor-not-allowed">
                            <Lock size={18} /> Enroll to Unlock
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs for Learning/Curriculum */}
            <div className="mt-12 space-y-12">
              {/* Learning Goals */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-500/[0.02]">
                <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                  <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                  What You Will Learn
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.learn.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                      <div className="bg-white p-1 rounded-full shadow-sm">
                        <CheckCircle className="text-blue-500 shrink-0" size={22} />
                      </div>
                      <span className="font-bold text-slate-600 leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum Section */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-500/[0.02]">
                <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 font-display">
                  <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                  Curriculum Content
                </h2>
                <div className="space-y-4">
                  {course.content.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-6 rounded-2xl border border-slate-100 hover:border-blue-500/20 hover:bg-blue-50/20 transition-all cursor-pointer group">
                      <div className="flex items-center gap-6">
                        <span className="text-3xl font-black text-slate-100 group-hover:text-blue-500/20 transition-all">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-black text-slate-700 text-lg">{item}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        Locked
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-500/[0.02]">
                <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                  <div className="h-8 w-1 bg-red-500 rounded-full"></div>
                  Prerequisites
                </h2>
                <ul className="space-y-4">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-600 font-bold">
                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructor Section */}

            </div>
          </div>

          {/* SIDEBAR PANEL */}
          <div className="relative">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg sticky top-24 p-6 flex flex-col items-center">

              <div className="w-full text-center mb-6">
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-2 px-4 py-1.5 bg-slate-50 rounded-full inline-block">Enrollment Fee</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-black text-blue-600 italic tracking-tighter">₹{course.price}</span>
                </div>
                <p className="text-slate-400 text-sm font-bold mt-4 italic">No hidden charges • GST Included</p>
              </div>

              {/* USP List */}
              <div className="w-full space-y-3 mb-6">
                {[
                  { text: "Full lifetime access", color: "text-green-500" },
                  { text: "Certificate of completion", color: "text-green-500" },
                  { text: "Access on all devices", color: "text-green-500" },
                  { text: "24/7 Premium Support", color: "text-green-500" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-600 font-black text-sm">
                    <div className="bg-green-50 p-1.5 rounded-lg border border-green-100">
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              {/* <div className="w-full space-y-4">
                {enrolled ? (
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xl transition-all shadow-2xl shadow-green-500/20 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                  >
                    Start Course <ArrowRight size={22} />
                  </button>
                ) : partial ? (
                  <button
                    onClick={() => navigate("/checkout", {
                      state: {
                        items: [course],
                        isBalancePayment: true,
                        totalOriginal: enrollment.total_fee,
                        amountPreviouslyPaid: enrollment.amount_paid
                      }
                    })}
                    className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xl transition-all shadow-2xl shadow-orange-500/20 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                  >
                    Pay Balance <ArrowRight size={22} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleEnroll}
                      disabled={added}
                      className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-2xl relative overflow-hidden group ${added
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : "bg-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:translate-y-0"
                        }`}
                    >
                      <span className="relative z-10">{added ? "Already in Cart" : "Enroll Now"}</span>
                      {!added && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}
                    </button>

                    {!added && (
                      <>
                        <button
                          onClick={handleAddToCart}
                          className="w-full py-5 rounded-2xl border-2 border-blue-600 text-blue-600 font-black text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3"
                        >
                          Add to Cart
                        </button>

                        <button
                          onClick={() => navigate("/checkout")}
                          className="w-full py-5 rounded-2xl border border-blue-600 text-blue-600 font-black text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3"
                        >
                          Checkout
                        </button>
                      </>
                    )}

                    <button className="w-full py-4 text-slate-400 font-black hover:text-slate-800 text-[10px] uppercase tracking-widest transition-all">
                      Apply Discount Coupon
                    </button>
                  </div> */}

              {/* Action Buttons */}
              <div className="w-full space-y-4">
                {enrolled ? (
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xl transition-all shadow-2xl shadow-green-500/20 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                  >
                    Start Course <ArrowRight size={22} />
                  </button>
                ) : partial ? (
                  <button
                    onClick={() => navigate("/checkout", {
                      state: {
                        items: [course],
                        isBalancePayment: true,
                        totalOriginal: enrollment.total_fee,
                        amountPreviouslyPaid: enrollment.amount_paid
                      }
                    })}
                    className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xl transition-all shadow-2xl shadow-orange-500/20 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                  >
                    Pay Balance <ArrowRight size={22} />
                  </button>
                ) : (
                  <>

                    <button
                      onClick={handleAddToCart}
                      disabled={added}
                      className={`
    w-[70%]
    mx-auto
    py-2.5
    rounded-xl
    font-semibold
    text-sm
    transition-all
    duration-300
    flex
    items-center
    justify-center
    gap-2
    ${added
                          ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border border-transparent shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02]"
                        }
  `}
                    >
                      {added && <CheckCircle size={16} />}
                      {added ? "Added to Cart" : "Add to Cart"}
                    </button>

                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          openAuthModal("login");
                        } else {
                          navigate("/checkout", { state: { items: [course] } });
                        }
                      }}
                      className="
    w-[70%]
    mx-auto
    py-2.5
    rounded-xl
    bg-gradient-to-r
    from-slate-50
    to-blue-50
    border
    border-blue-200
    text-blue-700
    font-semibold
    text-sm
    hover:from-blue-50
    hover:to-blue-100
    transition-all
    duration-300
    flex
    items-center
    justify-center
  "
                    >
                      Checkout
                    </button>
                    <button className="w-full py-4 text-slate-400 font-black hover:text-slate-800 text-[10px] uppercase tracking-widest transition-all">
                      Apply Discount Coupon
                    </button>
                  </>
                )}
              </div>

              {/* Satisfaction Guarantee */}
              <div className="mt-10 border-t border-slate-50 pt-8 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Premium Learning Experience</p>
              </div>

            </div>
          </div>

        </div>

        {/* Recommended Footer */}
        <div className="max-w-7xl mx-auto px-6 mt-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Recommended Courses</h2>
            <button className="text-blue-600 font-black flex items-center gap-2 hover:gap-3 transition-all">Explore All <ArrowRight size={20} /></button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedCourses.map((rel, i) => (
              <div
                key={i}
                onClick={() => navigate(`/course/${rel.id}`)}
                className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-500/[0.03] hover:shadow-2xl transition-all cursor-pointer group"
              >
                <img src={rel.img} className="w-full h-48 object-cover rounded-[2rem] group-hover:scale-[1.02] transition-all" alt={rel.title} />
                <div className="p-4">
                  <h3 className="font-black text-slate-800 text-lg leading-tight mb-2">{rel.title}</h3>
                  <p className="text-blue-600 font-black text-xl italic">₹{rel.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
};

export default CourseDetails;


