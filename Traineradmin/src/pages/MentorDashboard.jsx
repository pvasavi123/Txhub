import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, Send, CheckCircle, ClipboardList,
  TrendingUp, Award, Clock, Search, MoreVertical, Plus, FileText, Download,
  GraduationCap, Calendar, Bell, X, Upload, Trash2, Eye, Edit3, Check,
  ChevronDown, AlertCircle, Star, Paperclip, LogOut, Layers, ChevronLeft,
  Video, Radio, StopCircle, History, UserCheck, ChevronRight, Menu
} from 'lucide-react';
import api from '../api/client';

// ─── TOAST SYSTEM ──────────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
        }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-200' : type === 'error' ? 'bg-red-200' : 'bg-blue-200'
        }`}>
        {type === 'success' ? <Check className="w-4 h-4" /> : type === 'error' ? <X className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
      </div>
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 rounded-lg hover:bg-black/5"><X className="w-4 h-4" /></button>
    </motion.div>
  );
}

// ─── MODAL WRAPPER ─────────────────────────────────────────
function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const widthClass = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-lg';
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`bg-white rounded-3xl shadow-2xl w-full ${widthClass} max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ─── CIRCULAR PROGRESS COMPONENT ───────────────────────────
const CircularProgress = ({ progress, size = 36, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const color = progress > 80 ? '#22c55e' : progress > 40 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle className="text-slate-100" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" r={radius} cx={size / 2} cy={size / 2} className="transition-all duration-1000 ease-out" />
      </svg>
      <span className="absolute text-[10px] font-bold text-slate-600">{progress}%</span>
    </div>
  );
};

// ─── INITIAL MOCK DATA ─────────────────────────────────────
const INITIAL_STUDENTS = [];

const INITIAL_COURSES = [];

const INITIAL_NOTES = [];

const INITIAL_ASSIGNMENTS = [];

const ALL_COURSES_LIST = [
  'All Courses',
  'React ',
  'Java Full Stack Development',
  'Python Full Stack',
  'MERN Stack',
  'Front End Web Development',
  'Manual Testing',
  'Advanced Software Testing',
  'API Testing with Postman',
  'Mobile App Automation',
  'Figma UI/UX Design',
  'AWS & Devops',
  'Machine Learning',
  'Data Science',
  'Data Analytics',
  'Leadership & Team Management',
  'Public Speaking Mastery',
  'Critical Thinking & Problem Solving'
];

const TABS = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'batches', label: 'Batches', icon: Layers },
  { id: 'online-classes', label: 'Online Classes', icon: Video },
];

const COURSE_IMAGES = {
  'React Full Stack Development': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&h=200&fit=crop',
  'UI/UX Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=300&h=200&fit=crop',
  'AI/ML': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=300&h=200&fit=crop',
  'Data Science': 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?q=80&w=300&h=200&fit=crop',
  'Testing': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&h=200&fit=crop',
  'Devops': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=300&h=200&fit=crop',
  'Soft Skills': 'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=300&h=200&fit=crop',
  'default': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&h=200&fit=crop'
};

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [attendance, setAttendance] = useState({});
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [batchActiveTab, setBatchActiveTab] = useState('notes');
  const [studentSearch, setStudentSearch] = useState('');
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [focusIndex, setFocusIndex] = useState(0);
  const [onlineClasses, setOnlineClasses] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const trainerDataRaw = localStorage.getItem('trainer_data');
  const trainerData = trainerDataRaw ? JSON.parse(trainerDataRaw) : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = trainerData ? { 
          trainer_id: trainerData.id,
          trainer_email: trainerData.email
        } : {};

        // Use allSettled so one failing endpoint doesn't block others
        const [studentsRes, notesRes, assignmentsRes, overviewRes, batchesRes] = await Promise.allSettled([
          api.get('/students/', { params }),
          api.get('/notes/', { params }),
          api.get('/assignments/', { params }),
          api.get('/mentor-overview/', { params }),
          api.get('/batches/', { params }),
        ]);

        // Process students — core data, always show
        if (studentsRes.status === 'fulfilled') {
          const studentData = studentsRes.value.data;
          if (Array.isArray(studentData) && studentData.length > 0) {
            setStudents(studentData);
          }
        } else {
          console.error('Students fetch failed:', studentsRes.reason);
        }

        // Process notes
        if (notesRes.status === 'fulfilled') {
          const notesData = notesRes.value.data;
          if (Array.isArray(notesData) && notesData.length > 0) setNotes(notesData);
        } else {
          console.error('Notes fetch failed:', notesRes.reason);
        }

        // Process assignments
        if (assignmentsRes.status === 'fulfilled') {
          const assignmentsData = assignmentsRes.value.data;
          if (Array.isArray(assignmentsData) && assignmentsData.length > 0) setAssignments(assignmentsData);
        } else {
          console.error('Assignments fetch failed:', assignmentsRes.reason);
        }

        // Process batches — show only the batches assigned to the logged-in mentor
        if (batchesRes.status === 'fulfilled') {
          let batchesData = batchesRes.value.data;
          if (Array.isArray(batchesData)) {
            if (trainerData && trainerData.id) {
              batchesData = batchesData.filter(b => b.assigned_mentor === trainerData.id);
            }
            setBatches(batchesData);
          }
        } else {
          console.error('Batches fetch failed:', batchesRes.reason);
        }

        // Process overview
        const MAIN_COURSES = [
          "Java Full Stack",
          "MERN Stack",
          "Testing",
          "Soft Skills",
          "Data Science",
          "React Full Stack Development",
          "UI/UX Design",
          "AI/ML",
          "Devops",
          "Python Development",
          "SQL & Data Analytics",
          "Software Development"
        ];

        if (overviewRes.status === 'fulfilled' && overviewRes.value.data) {
          setOverviewData(overviewRes.value.data);
          if (overviewRes.value.data.course_breakdown) {
            const dynamicCourses = Object.entries(overviewRes.value.data.course_breakdown)
              .filter(([, count]) => count > 0)
              .map(([title, count], i) => ({
                id: i + 1, title,
                students: count,
                rating: (4.5 + Math.random() * 0.5).toFixed(1),
                progress: Math.min(100, count * 10),
                image: COURSE_IMAGES[title] || COURSE_IMAGES['default'],
              }));

            if (trainerData?.assigned_course === 'All Courses') {
              const activeTitles = dynamicCourses.map(dc => dc.title);
              const remaining = MAIN_COURSES.filter(c => !activeTitles.includes(c)).map((c, idx) => ({
                id: dynamicCourses.length + idx + 1,
                title: c,
                students: 0,
                rating: (4.5 + Math.random() * 0.5).toFixed(1),
                progress: 0,
                image: COURSE_IMAGES[c] || COURSE_IMAGES['default']
              }));
              setCourses([...dynamicCourses, ...remaining]);
            } else if (dynamicCourses.length > 0) {
              setCourses(dynamicCourses);
            } else if (trainerData?.assigned_course) {
              setCourses([{
                id: 1, title: trainerData.assigned_course, students: 0, rating: 5.0, progress: 0,
                image: COURSE_IMAGES[trainerData.assigned_course] || COURSE_IMAGES['default']
              }]);
            }
          }
        } else {
          // Fallback: still show the mentor's course even if overview fails
          if (trainerData?.assigned_course) {
            if (trainerData.assigned_course === 'All Courses') {
              const list = MAIN_COURSES.map((c, i) => ({
                id: i + 1, title: c, students: 0, rating: 5.0, progress: 0,
                image: COURSE_IMAGES[c] || COURSE_IMAGES['default']
              }));
              setCourses(list);
            } else {
              setCourses([{
                id: 1, title: trainerData.assigned_course, students: 0, rating: 5.0, progress: 0,
                image: COURSE_IMAGES[trainerData.assigned_course] || COURSE_IMAGES['default']
              }]);
            }
          }
          console.error('Overview fetch failed:', overviewRes.reason);
        }

      } catch (error) {
        console.error('Error fetching mentor data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Reset attendance map whenever students list changes
    setAttendance(students.reduce((acc, s) => ({ ...acc, [s.id]: false }), {}));
    // Reset focus index too
    setFocusIndex(0);
  }, [students]);

  // Modal states
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showStudentDetail, setShowStudentDetail] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(null);
  const [showAssignmentSubmissions, setShowAssignmentSubmissions] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Use real API data for stats, fall back to local state
  const stats = [
    { label: 'Total Students', value: (overviewData?.total_students ?? students.length).toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' },
    { label: 'Active Courses', value: courses.length.toString(), icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-l-indigo-500' },
  ];

  // ═══════════════════════════════════════════
  //  OVERVIEW TAB
  // ═══════════════════════════════════════════
  const OverviewTab = () => {
    // Use recent_students from API if available, otherwise fall back to local students
    const recentStudents = overviewData?.recent_students?.length > 0
      ? overviewData.recent_students
      : students.slice(0, 3);

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
        {loading && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 text-blue-700 text-sm font-medium">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading real data from server...
          </div>
        )}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {stats.map((stat, idx) => (
    <motion.div
      key={idx}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        bg-white
        border-l-4 ${stat.border} border border-y-slate-200 border-r-slate-200
        p-6
        shadow-[0_10px_40px_rgba(15,23,42,0.06)]
        hover:shadow-[0_20px_60px_rgba(79,70,229,0.12)]
        transition-all
        duration-300
        cursor-pointer
      `}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-500" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`
              w-12 h-12
              rounded-xl
              flex items-center justify-center
              ${stat.bg}
              shadow-sm
            `}
          >
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>

        {/* Value */}
        <h2 className="text-4xl font-black text-slate-800 tracking-tight mt-2">
          {stat.value}
        </h2>

        {/* Label */}
        <p className="text-sm text-slate-500 font-medium mt-1">
          {stat.label}
        </p>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            Updated Today
          </span>

          <button
            onClick={() => {
              if (idx === 0) setActiveTab("students");
              if (idx === 1) setActiveTab("courses");
            }}
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-all group"
          >
            View More
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  ))}
</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="
  lg:col-span-3
  relative
  overflow-hidden
  rounded-[32px]
  bg-white
  border border-slate-200
  p-7
  shadow-[0_20px_60px_rgba(15,23,42,0.08)]
">

  {/* Background Glow */}
  <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
  <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-20"></div>

  <div className="relative z-10">

    {/* Header */}
    <div className="flex items-center justify-between mb-7">
      <div>
        <h3 className="text-xl font-black text-slate-800">
          Recent Students
        </h3>

        <p className="text-sm text-slate-400 mt-1">
          {recentStudents.length} students enrolled recently
        </p>
      </div>

      <button
        onClick={() => setActiveTab("students")}
        className="
          px-4 py-2
          rounded-xl
          bg-blue-50
          text-blue-600
          text-sm
          font-semibold
          hover:bg-blue-100
          transition-all
        "
      >
        View All →
      </button>
    </div>

    {/* Students List */}
    <div className="space-y-4">

      {recentStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Users className="w-12 h-12 text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">
            No students registered yet
          </p>
        </div>
      ) : (
        recentStudents.map((student) => (
          <motion.div
            key={student.id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setShowStudentDetail(student)}
            className="
              group
              flex
              items-center
              justify-between
              p-4
              rounded-2xl
              bg-slate-50
              border
              border-slate-100
              hover:border-blue-200
              hover:bg-white
              hover:shadow-lg
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="
                w-12 h-12
                rounded-2xl
                bg-gradient-to-br
                from-blue-500
                to-blue-600
                text-white
                flex
                items-center
                justify-center
                font-bold
                shadow-lg
                shadow-blue-200
              ">
                {(student.name || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              {/* Student Info */}
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {student.name}
                </h4>

                <p className="text-sm text-slate-500">
                  {student.course ||
                    student.courseSpecialization ||
                    "No Course"}
                </p>

                {student.batch_date &&
                  student.batch_date !== "Not Specified" && (
                    <p className="text-xs text-blue-500 font-medium mt-1">
                      📅 {student.batch_date}
                    </p>
                  )}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  student.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {student.status}
              </span>

              <CircularProgress
                progress={student.progress || 0}
                size={46}
              />
            </div>
          </motion.div>
        ))
      )}

    </div>

  </div>
</div>
        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════
  //  STUDENTS TAB
  // ═══════════════════════════════════════════
  const StudentsTab = () => {
    const filtered = students.filter(s => {
      const matchesSearch = (s.name || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s.course || s.courseSpecialization || '').toLowerCase().includes(studentSearch.toLowerCase());
      const matchesBatch = !selectedBatchId || s.batch_id === selectedBatchId;
      return matchesSearch && matchesBatch;
    });

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">Student Roster <span className="text-sm font-normal text-slate-400 ml-2">({filtered.length} students)</span></h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search students..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <button onClick={() => { const blob = new Blob([`Name,Email,Course,Batch Date,Progress,Status\n` + filtered.map(s => `${s.name},${s.email},${s.course || s.courseSpecialization || ''},${s.batch_date || ''},${s.progress}%,${s.status}`).join('\n')], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click(); URL.revokeObjectURL(url); showToast('Student list exported as CSV!'); }}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600" title="Export CSV"><Download className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/30">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Batch Date</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-semibold">Loading students...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <GraduationCap className="w-12 h-12 text-slate-200" />
                      <p className="text-sm font-semibold">No students found for your course yet.</p>
                      <p className="text-xs">Students who register for your assigned course will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-md">{(student.name || '?').charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="font-semibold text-sm text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-400">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{student.course || student.courseSpecialization || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {student.batch_date && student.batch_date !== 'Not Specified' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-lg">
                        📅 {student.batch_date}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <CircularProgress progress={student.progress || 0} size={36} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${student.status === 'Active' ? 'bg-green-100 text-green-700' :
                        student.status === 'At Risk' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>{student.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setShowStudentDetail(student)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════
  //  COURSES TAB
  // ═══════════════════════════════════════════
  const CoursesTab = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800">My Courses</h3>
        <button onClick={() => setShowNewCourse(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group">
            <div className="h-40 overflow-hidden relative">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1 mb-2 w-max"><Award className="w-3 h-3" /> {course.rating} Rating</span>
                <h4 className="font-bold text-lg leading-tight">{course.title}</h4>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.students} Students</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-500 rounded-full" style={{ width: `${course.progress}%` }} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowCourseDetail(course)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors active:scale-95">Manage</button>
                <button onClick={() => { setCourses(prev => prev.filter(c => c.id !== course.id)); showToast(`"${course.title}" removed`); }}
                  className="px-3 py-2 border border-slate-200 text-rose-500 rounded-xl hover:bg-rose-50 transition-colors" title="Delete Course"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // ═══════════════════════════════════════════
  //  NOTES TAB
  // ═══════════════════════════════════════════
  const NotesTab = () => {
    const fileInputRef = useRef(null);
    const [stagedFiles, setStagedFiles] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(trainerData?.assigned_course || '');
    const [selectedBatch, setSelectedBatch] = useState(selectedBatchId ? batches.find(b => b.id === selectedBatchId)?.name || '' : '');
    const [dragOver, setDragOver] = useState(false);
    const [sending, setSending] = useState(false);

    const typeStyle = (ext) => {
      if (ext === 'PDF') return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' };
      if (['DOC', 'DOCX'].includes(ext)) return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' };
      if (['PPT', 'PPTX'].includes(ext)) return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' };
      if (['XLS', 'XLSX'].includes(ext)) return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' };
      if (['ZIP', 'RAR'].includes(ext)) return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' };
      return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' };
    };

    const stageFiles = (files) => {
      const newFiles = Array.from(files).map(f => ({
        name: f.name,
        size: f.size < 1024 * 1024 ? (f.size / 1024).toFixed(1) + ' KB' : (f.size / (1024 * 1024)).toFixed(2) + ' MB',
        ext: f.name.split('.').pop().toUpperCase(),
        id: Date.now() + Math.random(),
        fileObj: f,
      }));
      setStagedFiles(prev => [...prev, ...newFiles]);
    };

    const handleSend = async () => {
      if (stagedFiles.length === 0) { showToast('Please select at least one file first', 'error'); return; }
      if (!selectedCourse) { showToast('Please select a course first', 'error'); return; }
      setSending(true);
      let successCount = 0;
      for (const f of stagedFiles) {
        try {
          const formData = new FormData();
          formData.append('title', f.name);
          formData.append('course', selectedCourse);
          formData.append('batch_month', selectedBatch);
          formData.append('content', `Type: ${f.ext}, Size: ${f.size}`);
          formData.append('fileLink', f.fileObj);
          if (trainerData?.id) formData.append('trainer', trainerData.id);

          const res = await api.post('/notes/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (res.status === 200 || res.status === 201) {
            setNotes(prev => [res.data, ...prev]);
            successCount++;
          }
        } catch (err) {
          showToast(`Failed: ${f.name}`, 'error');
          console.error(err.response?.data || err.message);
        }
      }
      setSending(false);
      if (successCount > 0) {
        setStagedFiles([]);
        showToast(`${successCount} file(s) sent to "${selectedCourse}" students!`);
      }
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT – Shared Materials (already sent) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Shared Materials <span className="text-sm font-normal text-slate-400">({notes.filter(n => !selectedBatchId || n.batch_month === batches.find(b => b.id === selectedBatchId)?.name).length})</span></h3>
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <FileText className="w-12 h-12 mb-3 text-slate-200" />
              <p className="text-sm font-semibold">No materials shared yet.</p>
              <p className="text-xs mt-1">Upload files on the right and click Send to Students.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {notes.filter(n => !selectedBatchId || n.batch_month === batches.find(b => b.id === selectedBatchId)?.name).map(note => {
                const ext = (note.title || '').split('.').pop().toUpperCase();
                const s = typeStyle(ext);
                return (
                  <div key={note.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border ${s.bg} ${s.text} ${s.border}`}>{ext || 'FILE'}</div>
                      <div>
                        <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors text-sm">{note.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {note.course}{note.batch_month ? ` · ${note.batch_month}` : ' · All Batches'} · {new Date(note.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <button onClick={async () => {
                      try { await api.delete(`/notes/${note.id}/`); setNotes(prev => prev.filter(n => n.id !== note.id)); showToast(`Deleted "${note.title}"`); }
                      catch { showToast('Delete failed', 'error'); }
                    }} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT – Upload panel */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 h-max space-y-4">
          <h3 className="font-bold text-lg text-slate-800">Upload New Material</h3>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Course *</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
              <option value="">-- Select Course --</option>
              {ALL_COURSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Batch (Optional)</label>
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
              <option value="">All Batches</option>
              {batches.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Step 1 – Pick files */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Step 1 — Select Files</label>
            <input type="file" ref={fileInputRef} multiple className="hidden" onChange={(e) => { stageFiles(e.target.files); e.target.value = ''; }} />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); stageFiles(e.dataTransfer.files); }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${dragOver ? 'border-blue-400 bg-blue-50 scale-[1.01]' : 'border-slate-300 hover:bg-blue-50/50 hover:border-blue-300'
                }`}
            >
              <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">Click or drag & drop files here</p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOC, PPT, XLS up to 10MB</p>
            </div>
          </div>

          {/* Step 2 – Preview staged files */}
          {stagedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Step 2 — Confirm & Send ({stagedFiles.length} file{stagedFiles.length !== 1 ? 's' : ''})
                </label>
                <button onClick={() => setStagedFiles([])} className="text-xs text-rose-400 hover:text-rose-600 hover:underline">Clear all</button>
              </div>
              {stagedFiles.map((f) => {
                const s = typeStyle(f.ext);
                return (
                  <div key={f.id} className={`flex items-center justify-between p-3 bg-white rounded-xl border ${s.border} shadow-sm`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 ${s.bg} ${s.text}`}>
                        {f.ext.slice(0, 4)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{f.name}</p>
                        <p className="text-xs text-slate-400">{f.size}</p>
                      </div>
                    </div>
                    <button onClick={() => setStagedFiles(prev => prev.filter(x => x.id !== f.id))}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Send button */}
          <button onClick={handleSend} disabled={sending || stagedFiles.length === 0}
            className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${stagedFiles.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
              }`}>
            {sending
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
              : <><Send className="w-4 h-4" /> Send to Students{stagedFiles.length > 0 ? ` (${stagedFiles.length})` : ''}</>}
          </button>
        </div>
      </motion.div>
    );
  };



  // ═══════════════════════════════════════════
  //  ATTENDANCE TAB (BATCH SPECIFIC)
  // ═══════════════════════════════════════════
  const BatchAttendanceTab = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const filteredStudents = students.filter(s => {
      const matchSearch = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.course || s.courseSpecialization || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchBatch = !selectedBatchId || s.batch_id === selectedBatchId;
      return matchSearch && matchBatch;
    });

    const absentCount = (selectedBatchId ? students.filter(s => s.batch_id === selectedBatchId).length : students.length) - presentCount;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // focusIndex is now at component level — doesn't reset on re-render

    const currentFocusStudent = filteredStudents.length > 0 ? filteredStudents[focusIndex % filteredStudents.length] : null;

    const handleFocusPresent = () => {
      if (!currentFocusStudent) return;
      setAttendance(prev => ({ ...prev, [currentFocusStudent.id]: true }));
      setFocusIndex(prev => prev + 1);
      showToast(`${currentFocusStudent.name} marked Present!`, 'success');
    };
    const handleFocusAbsent = () => {
      if (!currentFocusStudent) return;
      setAttendance(prev => ({ ...prev, [currentFocusStudent.id]: false }));
      setFocusIndex(prev => prev + 1);
      showToast(`${currentFocusStudent.name} marked Absent!`, 'info');
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">

        {/* Hub Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-blue-600" />
              Attendance Hub
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">{today}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase">Present</p>
              <p className="text-xl font-black text-green-600">{presentCount}</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase">Absent</p>
              <p className="text-xl font-black text-rose-600">{absentCount}</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <button onClick={async () => {
              const records = Object.keys(attendance).map(id => ({
                student: parseInt(id),
                attendance_date: new Date().toISOString().split('T')[0],
                status: attendance[id] ? 'Present' : 'Absent',
                batch: selectedBatchId ? parseInt(selectedBatchId) : null,
                mentor: trainerData?.id || null
              }));
              try {
                const res = await api.post('/attendance/', records);
                if (res.status === 200 || res.status === 201) {
                  showToast('Attendance records saved!');
                } else {
                  showToast('Failed to save attendance', 'error');
                }
              } catch (e) {
                showToast('Network error while saving attendance', 'error');
              }
            }} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95">
              Save Records
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT PANEL: Focus, Check-in, Calendar */}
          <div className="xl:col-span-1 space-y-6">

            {/* Minimalist Check-in (Search) */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-blue-500" /> Quick Check-in</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search by name or course..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
              </div>
            </div>

            {/* Flashcard Focus Mode */}
            {currentFocusStudent && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
                <h3 className="font-bold text-blue-300 mb-6 flex items-center gap-2"><Star className="w-5 h-5" /> Focus Mode</h3>

                <AnimatePresence mode="wait">
                  <motion.div key={currentFocusStudent.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-inner relative z-10">
                    <div className="w-16 h-16 rounded-full bg-blue-500/30 border-2 border-blue-400/50 mx-auto flex items-center justify-center text-2xl font-black shadow-lg mb-4 text-white">
                      {currentFocusStudent.name.charAt(0)}
                    </div>
                    <h4 className="font-bold text-xl mb-1">{currentFocusStudent.name}</h4>
                    <p className="text-sm text-blue-200 mb-6">{currentFocusStudent.course}</p>

                    <div className="flex gap-3">
                      <button onClick={handleFocusAbsent} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-rose-400 transition-all font-bold text-sm text-slate-300 active:scale-95">
                        Absent
                      </button>
                      <button onClick={handleFocusPresent} className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition-all font-bold text-sm shadow-lg shadow-blue-500/30 text-white active:scale-95">
                        Present
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="text-center mt-4 text-xs text-slate-400 font-medium">Card {focusIndex % students.length + 1} of {students.length}</div>
              </div>
            )}


          </div>

          {/* RIGHT PANEL: Traditional Data Table */}
          <div className="xl:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col h-[750px]">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-blue-500" /> Detailed Roster</h3>
              <div className="flex gap-2">
                <button onClick={() => { const all = {}; students.forEach(s => all[s.id] = true); setAttendance(all); showToast('All Present!'); }} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors">Mark All Present</button>
                <button onClick={() => { const all = {}; students.forEach(s => all[s.id] = false); setAttendance(all); showToast('Reset'); }} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">Reset</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-0 hide-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-md z-10 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-400">No students found.</td></tr>
                  ) : filteredStudents.map((student) => {
                    const isPresent = attendance[student.id];
                    return (
                      <motion.tr layout key={student.id} className={`group transition-colors hover:bg-slate-50/50 ${isPresent ? 'bg-green-50/20' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-colors ${isPresent ? 'bg-green-500' : 'bg-slate-300 group-hover:bg-blue-400'
                              }`}>
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm">{student.name}</div>
                              <div className="text-xs text-slate-400">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{student.course}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <select
                              value={isPresent ? 'present' : 'absent'}
                              onChange={(e) => setAttendance(prev => ({ ...prev, [student.id]: e.target.value === 'present' }))}
                              className={`px-3 py-1.5 rounded-lg text-sm font-bold border outline-none cursor-pointer transition-colors ${isPresent
                                  ? 'bg-green-50 text-green-700 border-green-200 focus:ring-2 focus:ring-green-500/20'
                                  : 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-2 focus:ring-rose-500/20'
                                }`}
                            >
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════
  //  ASSIGNMENTS TAB
  // ═══════════════════════════════════════════
  const AssignmentsTab = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">Assignments <span className="text-sm font-normal text-slate-400">({assignments.filter(a => !selectedBatchId || a.batch_month === batches.find(b => b.id === selectedBatchId)?.name).length})</span></h3>
        <button onClick={() => setShowNewAssignment(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95">
          <Plus className="w-4 h-4" /> New Assignment
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.filter(a => !selectedBatchId || a.batch_month === batches.find(b => b.id === selectedBatchId)?.name).map(a => (
          <div key={a.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${a.status === 'Active' ? 'bg-green-100 text-green-700' : a.status === 'Closed' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'
                }`}>{a.status || 'Active'}</span>
              <button onClick={async () => {
                try {
                  await api.delete(`/assignments/${a.id}/`);
                  setAssignments(prev => prev.filter(x => x.id !== a.id)); showToast(`Deleted "${a.title}"`);
                } catch { showToast('Delete failed', 'error'); }
              }}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">{a.title}</h4>
            <p className="text-xs text-slate-500 mb-2">{a.course} {a.batch_month && `· ${a.batch_month}`} · Due: {a.dueDate}</p>
            {a.fileLink && (
              <div className="flex items-center gap-3 mb-3">
                <a href={a.fileLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors border border-blue-100">
                  <Eye className="w-3 h-3 flex-shrink-0" /> View Document
                </a>
                <a href={a.fileLink} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-200">
                  <Download className="w-3 h-3 flex-shrink-0" /> Download
                </a>
              </div>
            )}
            <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
               <Clock className="w-3 h-3"/> Uploaded: {new Date(a.created_at).toLocaleDateString()}
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Assigned Students</div>
                <div className="text-sm font-bold text-slate-600">{a.assigned_students_count || 0}</div>
              </div>
              <button onClick={() => setShowAssignmentSubmissions(a)} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1">
                <Eye className="w-3 h-3" /> View Submissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // ═══════════════════════════════════════════
  //  NEW COURSE FORM MODAL
  // ═══════════════════════════════════════════
  const NewCourseForm = () => {
    const [title, setTitle] = useState('');
    const [studentCount, setStudentCount] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim()) { showToast('Please enter a course title', 'error'); return; }
      const newCourse = {
        id: Date.now(), title: title.trim(), students: parseInt(studentCount) || 0, rating: 5.0, progress: 0,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&h=200&fit=crop',
      };
      setCourses(prev => [...prev, newCourse]);
      showToast(`Course "${title}" created!`);
      setShowNewCourse(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Course Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full Stack JavaScript"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Expected Students</label>
          <input type="number" value={studentCount} onChange={(e) => setStudentCount(e.target.value)} placeholder="e.g. 50"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors active:scale-95">
          Create Course
        </button>
      </form>
    );
  };

  // ═══════════════════════════════════════════
  //  ASSIGNMENT SUBMISSIONS MODAL
  // ═══════════════════════════════════════════
  const SubmissionsList = ({ assignment }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubs, setLoadingSubs] = useState(true);

    useEffect(() => {
      if (!assignment) return;
      api.get(`/assignments/submissions/?assignment_id=${assignment.id}`)
        .then(res => setSubmissions(res.data))
        .catch(err => console.error("Error fetching submissions:", err))
        .finally(() => setLoadingSubs(false));
    }, [assignment]);

    if (loadingSubs) return <div className="text-center py-6 text-slate-500">Loading submissions...</div>;

    if (submissions.length === 0) return <div className="text-center py-6 text-slate-500">No submissions yet.</div>;

    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {submissions.map(sub => (
          <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div className="font-semibold text-slate-800">{sub.student_name}</div>
              <div className="text-xs text-slate-500 mt-1">Submitted: {new Date(sub.submitted_at).toLocaleString()}</div>
            </div>
            {sub.fileLink ? (
              <div className="flex items-center gap-2">
                <a href={sub.fileLink} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2">
                  <Eye className="w-4 h-4" /> View
                </a>
                <a href={sub.fileLink} download target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-200">
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">No File</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // ═══════════════════════════════════════════
  //  NEW ASSIGNMENT FORM MODAL
  // ═══════════════════════════════════════════
  const NewAssignmentForm = () => {
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState(trainerData?.assigned_course || '');
    const [batch, setBatch] = useState(selectedBatchId ? batches.find(b => b.id === selectedBatchId)?.name || '' : '');
    const [dueDate, setDueDate] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!title.trim() || !dueDate) { showToast('Please fill all fields', 'error'); return; }

      try {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', '');
        formData.append('course', course);
        formData.append('batch_month', batch);
        formData.append('dueDate', dueDate);
        if (trainerData?.id) {
          formData.append('trainer', trainerData.id);
        }
        if (file) {
          formData.append('fileLink', file);
        }

        const res = await api.post('/assignments/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.status === 200 || res.status === 201) {
          const newAssign = res.data;
          setAssignments(prev => [newAssign, ...prev]);
          showToast(`Assignment "${title}" created!`);
          setShowNewAssignment(false);
        } else {
          showToast('Failed to save to database.', 'error');
          console.error('Assignment error:', res.data);
        }
      } catch (err) {
        console.error('Assignment save error:', err.response?.data || err.message);
        showToast(`Error: ${JSON.stringify(err.response?.data || err.message)}`, 'error');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Assignment Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build a REST API"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Course *</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
              <option value="">-- Select Course --</option>
              {ALL_COURSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Batch</label>
            <select value={batch} onChange={(e) => setBatch(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
              <option value="">All Batches</option>
              {batches.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Due Date *</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Assignment File</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors active:scale-95">
          Create Assignment
        </button>
      </form>
    );
  };

  // ═══════════════════════════════════════════
  //  BATCHES TAB
  // ═══════════════════════════════════════════
  const BatchesTab = () => {
    if (!selectedBatchId) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">My Batches <span className="text-sm font-normal text-slate-400">({batches.length})</span></h3>
          </div>
          {batches.length === 0 ? (
            <div className="p-10 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
              <Layers size={32} className="mx-auto mb-3 text-slate-200" />
              <p className="font-semibold">No batches assigned to you yet.</p>
              <p className="text-xs mt-1">Batches created by admins will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map(b => (
                <div key={b.id} onClick={() => { setSelectedBatchId(b.id); setBatchActiveTab('notes'); }}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-blue-500" />
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{b.name}</h4>
                  </div>
                  <div className="text-sm text-slate-500 space-y-2">
                    <p className="flex items-center gap-2"><BookOpen size={16} className="text-blue-400" /> {b.course}</p>
                    <p className="flex items-center gap-2"><Calendar size={16} className="text-blue-400" /> Start: {b.startDate || 'TBD'}</p>
                    <p className="flex items-center gap-2"><Users size={16} className="text-blue-400" /> {b.students ? b.students.length : 0} Students</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      );
    }

    const selectedBatch = batches.find(b => b.id === selectedBatchId);
    if (!selectedBatch) return null;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <button onClick={() => setSelectedBatchId(null)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Batch Details</p>
            <h2 className="text-xl font-bold text-slate-800">{selectedBatch.name}</h2>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-2 mb-2 hide-scrollbar gap-2 border-b border-slate-100">
          {[{ id: 'notes', label: 'Notes', icon: Send }, { id: 'attendance', label: 'Attendance', icon: CheckCircle }, { id: 'assignments', label: 'Assignments', icon: ClipboardList }].map(tab => {
            const isActive = batchActiveTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setBatchActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl text-sm font-bold transition-all whitespace-nowrap border-b-2 ${isActive ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}>
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {batchActiveTab === 'notes' && <NotesTab key="notes" />}
            {batchActiveTab === 'attendance' && <BatchAttendanceTab key="attendance" />}
            {batchActiveTab === 'assignments' && <AssignmentsTab key="assignments" />}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════
  //  ONLINE CLASSES TAB
  // ═══════════════════════════════════════════
  const OnlineClassesTab = () => {
    const [classes, setClasses] = useState([]);
    const [tabView, setTabView] = useState('upcoming'); // 'upcoming' | 'history'
    const [scheduling, setScheduling] = useState(false);
    const [form, setForm] = useState({ title: '', batch: '', start_time: '', meeting_link: '' });
    const [saving, setSaving] = useState(false);
    const [startingId, setStartingId] = useState(null);
    const [endingId, setEndingId] = useState(null);

    const fetchClasses = async () => {
      try {
        const params = trainerData ? { 
          mentor_id: trainerData.id,
          mentor_email: trainerData.email
        } : {};
        const res = await api.get('/online-classes/', { params });
        setClasses(Array.isArray(res.data) ? res.data : (res.data.results || []));
      } catch (e) {
        console.error('Failed to load online classes:', e);
        // Do NOT call showToast here to prevent infinite re-render loops 
        // since this component is defined inside the parent render function.
      }
    };

    useEffect(() => { fetchClasses(); }, []);

    const handleSchedule = async () => {
      if (!form.title.trim() || !form.batch || !form.start_time) {
        showToast('Please fill all fields', 'error'); return;
      }
      setSaving(true);
      try {
        await api.post('/online-classes/', {
          title: form.title,
          batch: form.batch,
          start_time: new Date(form.start_time).toISOString(),
          mentor: trainerData?.id || null,
          mentor_email: trainerData?.email || null,
          status: 'SCHEDULED',
          meeting_link: form.meeting_link.trim() || null,
        });
        showToast('Class scheduled successfully!');
        setScheduling(false);
        setForm({ title: '', batch: '', start_time: '', meeting_link: '' });
        fetchClasses();
      } catch (e) {
        showToast('Failed to schedule class', 'error');
      } finally {
        setSaving(false);
      }
    };

    const handleStart = async (cls) => {
      setStartingId(cls.id);
      try {
        const res = await api.post(`/online-classes/${cls.id}/start/`);
        const { join_url } = res.data;
        fetchClasses();
        showToast('Class started! Opening BBB room…', 'success');
        window.open(join_url, '_blank');
      } catch (e) {
        showToast('Failed to start class', 'error');
      } finally {
        setStartingId(null);
      }
    };

    const handleEnd = async (cls) => {
      setEndingId(cls.id);
      try {
        await api.post(`/online-classes/${cls.id}/end/`);
        showToast('Class ended');
        fetchClasses();
      } catch (e) {
        showToast('Failed to end class', 'error');
      } finally {
        setEndingId(null);
      }
    };

    const upcoming = classes.filter(c => c.status === 'SCHEDULED' || c.status === 'LIVE');
    const history  = classes.filter(c => c.status === 'ENDED');

    const StatusBadge = ({ status }) => {
      const map = {
        LIVE:      { bg: 'bg-red-100 text-red-700 border border-red-200', dot: 'bg-red-500', label: 'LIVE' },
        SCHEDULED: { bg: 'bg-blue-100 text-blue-700 border border-blue-200', dot: 'bg-blue-400', label: 'Scheduled' },
        ENDED:     { bg: 'bg-slate-100 text-slate-500 border border-slate-200', dot: 'bg-slate-400', label: 'Ended' },
      };
      const s = map[status] || map.ENDED;
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.bg}`}>
          {status === 'LIVE' && <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />}
          {s.label}
        </span>
      );
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-semibold mb-1 flex items-center gap-2"><Radio className="w-4 h-4 animate-pulse" /> Live Teaching</p>
              <h2 className="text-2xl font-black">Online Classes</h2>
              <p className="text-blue-200 text-sm mt-1">{upcoming.filter(c => c.status === 'LIVE').length} live · {upcoming.filter(c => c.status === 'SCHEDULED').length} scheduled</p>
            </div>
            <button onClick={() => setScheduling(true)} className="flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg">
              <Plus className="w-4 h-4" /> Schedule Class
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-2">
          {[{ id: 'upcoming', label: 'Upcoming & Live', icon: Video }, { id: 'history', label: 'Class History', icon: History }].map(t => (
            <button key={t.id} onClick={() => setTabView(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${ tabView === t.id ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Schedule Class Form */}
        {scheduling && (
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-blue-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" /> Schedule New Class</h3>
              <button onClick={() => setScheduling(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Class Title</label>
                <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. React Hooks Deep Dive" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Batch</label>
                <select value={form.batch} onChange={e => setForm(f => ({...f, batch: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
                  <option value="">Select batch…</option>
                  {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Start Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={form.start_time} 
                  min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                  onChange={e => setForm(f => ({...f, start_time: e.target.value}))} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Meeting Link (Google Meet)</label>
                <input value={form.meeting_link} onChange={e => setForm(f => ({...f, meeting_link: e.target.value}))} placeholder="e.g. https://meet.google.com/abc-defg-hij" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            </div>
            <button onClick={handleSchedule} disabled={saving} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2 disabled:opacity-60">
              {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</> : <><Check className="w-4 h-4" /> Confirm Schedule</>}
            </button>
          </div>
        )}

        {/* Class Cards */}
        <div className="space-y-4">
          {(tabView === 'upcoming' ? upcoming : history).length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">{tabView === 'upcoming' ? 'No upcoming or live classes' : 'No class history yet'}</p>
              {tabView === 'upcoming' && <button onClick={() => setScheduling(true)} className="mt-3 text-blue-600 text-sm font-bold hover:underline">Schedule your first class →</button>}
            </div>
          ) : (tabView === 'upcoming' ? upcoming : history).map(cls => (
            <div key={cls.id} className={`bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border transition-all ${ cls.status === 'LIVE' ? 'border-red-200 shadow-red-50 ring-1 ring-red-100' : 'border-slate-100 hover:shadow-md'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${ cls.status === 'LIVE' ? 'bg-red-100' : cls.status === 'ENDED' ? 'bg-slate-100' : 'bg-blue-100'}`}>
                    <Video className={`w-5 h-5 ${ cls.status === 'LIVE' ? 'text-red-600' : cls.status === 'ENDED' ? 'text-slate-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800">{cls.title}</h4>
                      <StatusBadge status={cls.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> {cls.mentor_name || trainerData?.name || 'You'}</span>
                      <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {cls.batch}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {cls.start_time ? new Date(cls.start_time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</span>
                      {cls.end_time && <span className="flex items-center gap-1"><StopCircle className="w-3.5 h-3.5" /> Ended: {new Date(cls.end_time).toLocaleString('en-IN', { timeStyle: 'short' })}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {cls.status === 'SCHEDULED' && (
                    <button onClick={() => handleStart(cls)} disabled={startingId === cls.id} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-green-200 disabled:opacity-60">
                      {startingId === cls.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Radio className="w-4 h-4" />}
                      Start Class
                    </button>
                  )}
                  {cls.status === 'LIVE' && (
                    <>
                      <button onClick={() => handleStart(cls)} disabled={startingId === cls.id} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-60">
                        <Video className="w-4 h-4" /> Rejoin
                      </button>
                      <button onClick={() => handleEnd(cls)} disabled={endingId === cls.id} className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-rose-200 disabled:opacity-60">
                        {endingId === cls.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <StopCircle className="w-4 h-4" />}
                        End Class
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════
  //  ATTENDANCE TAB
  // ═══════════════════════════════════════════
  const AttendanceTab = () => {
    const [attView, setAttView] = useState('create'); // 'create' | 'history'
    const [attBatchId, setAttBatchId] = useState('');
    const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
    const [batchStudents, setBatchStudents] = useState([]);
    const [attMap, setAttMap] = useState({}); // { studentId: 'Present'|'Absent' }
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [savingAtt, setSavingAtt] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [groupDetails, setGroupDetails] = useState({});

    // Fetch students for selected batch
    useEffect(() => {
      if (!attBatchId) { setBatchStudents([]); return; }
      setLoadingStudents(true);
      api.get('/batches/', { params: trainerData ? { trainer_id: trainerData.id } : {} })
        .then(res => {
          const batch = (res.data || []).find(b => String(b.id) === String(attBatchId));
          const students = batch?.students || [];
          setBatchStudents(students);
          // Default all to Absent
          const defaultMap = {};
          students.forEach(s => { defaultMap[s.id] = 'Absent'; });
          setAttMap(defaultMap);
        })
        .catch(() => setBatchStudents([]))
        .finally(() => setLoadingStudents(false));
    }, [attBatchId]);

    // Fetch history
    const fetchHistory = () => {
      setLoadingHistory(true);
      const params = {};
      if (trainerData?.id) params.mentor_id = trainerData.id;
      api.get('/attendance/', { params })
        .then(res => {
          const records = res.data || [];
          // Group by date + batch
          const grouped = {};
          records.forEach(r => {
            const key = `${r.attendance_date}__${r.batch}`;
            if (!grouped[key]) {
              grouped[key] = {
                date: r.attendance_date,
                batch_id: r.batch,
                batch_name: r.batch_name || `Batch #${r.batch}`,
                records: []
              };
            }
            grouped[key].records.push(r);
          });
          setHistory(Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date)));
        })
        .catch(() => setHistory([]))
        .finally(() => setLoadingHistory(false));
    };

    useEffect(() => {
      if (attView === 'history') fetchHistory();
    }, [attView]);

    const handleSave = async () => {
      if (!attBatchId || !attDate || batchStudents.length === 0) {
        showToast('Select a batch and date first', 'error');
        return;
      }
      setSavingAtt(true);
      const payload = batchStudents.map(s => ({
        student: s.id,
        attendance_date: attDate,
        batch: parseInt(attBatchId),
        mentor: trainerData?.id || null,
        status: attMap[s.id] || 'Absent'
      }));
      try {
        await api.post('/attendance/', payload);
        showToast('Attendance saved successfully!', 'success');
      } catch (err) {
        showToast('Failed to save attendance', 'error');
      } finally {
        setSavingAtt(false);
      }
    };

    const toggleDetail = (key) => {
      setExpandedGroup(prev => prev === key ? null : key);
    };

    const selectedBatch = batches.find(b => String(b.id) === String(attBatchId));

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
        {/* Sub-nav */}
        <div className="flex gap-2">
          {[{ id: 'create', label: 'Mark Attendance', icon: UserCheck }, { id: 'history', label: 'View History', icon: History }].map(v => (
            <button key={v.id} onClick={() => setAttView(v.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                attView === v.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}>
              <v.icon className="w-4 h-4" />{v.label}
            </button>
          ))}
        </div>

        {attView === 'create' && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><UserCheck className="w-5 h-5 text-blue-600" /> Mark Attendance</h3>
              <p className="text-sm text-slate-500 mt-1">Select a batch and date, then mark Present / Absent for each student.</p>
            </div>
            <div className="p-6 space-y-5">
              {/* Batch + Date selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Batch</label>
                  <select value={attBatchId} onChange={e => setAttBatchId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                    <option value="">-- Choose Batch --</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name} {b.course ? `(${b.course})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Attendance Date</label>
                  <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                </div>
              </div>

              {/* Student Table */}
              {!attBatchId && (
                <div className="text-center py-12 text-slate-400">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Select a batch to load students</p>
                </div>
              )}
              {attBatchId && loadingStudents && (
                <div className="flex items-center justify-center py-12 gap-3 text-blue-600">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading students...
                </div>
              )}
              {attBatchId && !loadingStudents && batchStudents.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No students found in this batch</p>
                </div>
              )}
              {attBatchId && !loadingStudents && batchStudents.length > 0 && (
                <div>
                  {/* Quick actions */}
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-semibold text-slate-600">{batchStudents.length} student(s) in {selectedBatch?.name}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { const m = {}; batchStudents.forEach(s => { m[s.id] = 'Present'; }); setAttMap(m); }}
                        className="px-3 py-1.5 text-xs font-bold bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors">✓ All Present</button>
                      <button onClick={() => { const m = {}; batchStudents.forEach(s => { m[s.id] = 'Absent'; }); setAttMap(m); }}
                        className="px-3 py-1.5 text-xs font-bold bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors">✗ All Absent</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {batchStudents.map((student, idx) => {
                      const isPresent = attMap[student.id] === 'Present';
                      return (
                        <div key={student.id}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            isPresent ? 'bg-green-50 border-green-200' : 'bg-red-50/50 border-red-100'
                          }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                              isPresent ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-600'
                            }`}>{(student.name || '?').charAt(0).toUpperCase()}</div>
                            <div>
                              <p className="font-semibold text-sm text-slate-800">{student.name}</p>
                              <p className="text-xs text-slate-400">{student.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setAttMap(prev => ({ ...prev, [student.id]: 'Absent' }))}
                              className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                !isPresent ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-red-300'
                              }`}>Absent</button>
                            <button onClick={() => setAttMap(prev => ({ ...prev, [student.id]: 'Present' }))}
                              className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                isPresent ? 'bg-green-500 text-white border-green-500 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-green-300'
                              }`}>Present</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary + Save */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-2xl flex items-center justify-between">
                    <div className="flex gap-4 text-sm">
                      <span className="font-bold text-green-700">{Object.values(attMap).filter(v => v === 'Present').length} Present</span>
                      <span className="font-bold text-red-600">{Object.values(attMap).filter(v => v === 'Absent').length} Absent</span>
                      <span className="text-slate-500">/ {batchStudents.length} Total</span>
                    </div>
                    <button onClick={handleSave} disabled={savingAtt}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-60">
                      {savingAtt ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                      Save Records
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {attView === 'history' && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><History className="w-5 h-5 text-blue-600" /> Attendance History</h3>
                <p className="text-sm text-slate-500 mt-1">Grouped by date and batch</p>
              </div>
              <button onClick={fetchHistory} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors" title="Refresh">
                <History className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {loadingHistory && (
                <div className="flex items-center justify-center py-12 gap-3 text-blue-600">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading history...
                </div>
              )}
              {!loadingHistory && history.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No attendance records found</p>
                </div>
              )}
              {!loadingHistory && history.length > 0 && (
                <div className="space-y-3">
                  {history.map((group, idx) => {
                    const key = `${group.date}__${group.batch_id}`;
                    const presentCount = group.records.filter(r => r.status === 'Present').length;
                    const absentCount = group.records.filter(r => r.status === 'Absent').length;
                    const total = group.records.length;
                    const isExpanded = expandedGroup === key;
                    return (
                      <div key={key} className="border border-slate-100 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-xl">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800">{group.date}</p>
                              <p className="text-xs text-slate-500">{group.batch_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex gap-3 text-xs font-bold">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg">{presentCount} Present</span>
                              <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg">{absentCount} Absent</span>
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">{total} Total</span>
                            </div>
                            <button onClick={() => toggleDetail(key)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                              {isExpanded ? 'Hide' : 'View'}
                              <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="p-4 border-t border-slate-100">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                                  <th className="pb-2">#</th>
                                  <th className="pb-2">Student</th>
                                  <th className="pb-2">Email</th>
                                  <th className="pb-2">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.records.map((r, i) => (
                                  <tr key={r.id} className="border-b border-slate-50 last:border-0">
                                    <td className="py-2.5 text-slate-400 text-xs">{i + 1}</td>
                                    <td className="py-2.5 font-semibold text-slate-700">{r.student_name || `Student #${r.student}`}</td>
                                    <td className="py-2.5 text-slate-400 text-xs">{r.student_email || '—'}</td>
                                    <td className="py-2.5">
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                        r.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                      }`}>{r.status}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans">
      {/* Mobile Top Navbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200/80 px-6 flex items-center justify-between z-[140] shadow-sm">
        <img
          src="/logo1.png"
          alt="TX Hub"
          className="h-10 w-auto object-contain mix-blend-multiply brightness-110 contrast-110"
        />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Sidebar/Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[145]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 bottom-0 left-0 w-72 bg-white z-[150] shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Logo & Close */}
                <div className="flex items-center justify-between mb-8">
                  <img
                    src="/logo1.png"
                    alt="TX Hub"
                    className="h-12 w-auto object-contain mix-blend-multiply brightness-110 contrast-110"
                  />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <nav className="space-y-2">
                  {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-95 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <tab.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{tab.label}</span>
                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Profile Card & Logout */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                    {(trainerData?.name || "T").charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-sm font-black text-slate-800 truncate">{trainerData?.name || "Trainer"}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate">Mentor</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    localStorage.removeItem("trainer_access_token");
                    localStorage.removeItem("trainer_refresh_token");
                    localStorage.removeItem("trainer_data");
                    navigate("/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 bg-white rounded-xl font-bold shadow-sm hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 h-screen sticky top-0 p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex flex-col gap-2 px-2 mb-10">
            <img
              src="/logo1.png"
              alt="TX Hub"
              className="h-14 w-auto object-contain mix-blend-multiply brightness-110 contrast-110 self-start"
            />
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-95 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="truncate">{tab.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Card */}
        <div className="pt-6 border-t border-slate-50">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black shadow-sm">
                {(trainerData?.name || "T").charAt(0).toUpperCase()}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-black text-slate-800 truncate">{trainerData?.name || "Trainer"}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase truncate">Mentor</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 pt-24 sm:p-8 lg:p-12 pb-12">
        {/* Header */}
        <div className="flex flex-row justify-between items-center gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Mentor Workspace
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 lg:mt-2">
              <span className="text-slate-500 text-xs sm:text-sm">
                Welcome back,
              </span>
              <span className="text-blue-600 text-xs sm:text-sm font-bold">
                {trainerData?.name || "Trainer"}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] sm:text-xs font-semibold">
                {trainerData?.assigned_course || "All Courses"}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("trainer_access_token");
              localStorage.removeItem("trainer_refresh_token");
              localStorage.removeItem("trainer_data");
              navigate("/login");
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-200 text-slate-600 bg-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="relative">

  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{
        duration: 0.35,
        ease: "easeInOut"
      }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-4 sm:p-6 lg:p-8">

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

        <div className="relative z-10">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "students" && <StudentsTab />}
          {activeTab === "courses" && <CoursesTab />}
          {activeTab === "batches" && <BatchesTab />}
          {activeTab === "online-classes" && <OnlineClassesTab />}
          {activeTab === "attendance" && <AttendanceTab />}
        </div>

      </div>
    </motion.div>
  </AnimatePresence>
        </div>
      </main>
      {/* ── MODALS ─────────────────────────────── */}
      <AnimatePresence>
        {showNewCourse && (
          <Modal isOpen onClose={() => setShowNewCourse(false)} title="Create New Course"><NewCourseForm /></Modal>
        )}
        {showNewAssignment && (
          <Modal isOpen onClose={() => setShowNewAssignment(false)} title="Create New Assignment"><NewAssignmentForm /></Modal>
        )}
        {showStudentDetail && (
          <Modal isOpen onClose={() => setShowStudentDetail(null)} title="Student Details">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-blue-500 text-white flex items-center justify-center font-black text-2xl shadow-xl mb-4">
                {showStudentDetail.name.charAt(0)}
              </div>
              <h2 className="text-xl font-black text-slate-800">{showStudentDetail.name}</h2>
              <p className="text-sm text-slate-500">{showStudentDetail.email}</p>
              {showStudentDetail.created_at && (
                <p className="text-xs text-slate-400 mt-1">Registered: {showStudentDetail.created_at}</p>
              )}
              <div className="flex gap-3 mt-6 text-center w-full flex-wrap">
                {[
                  { label: 'Course', value: showStudentDetail.course || 'N/A' },
                  { label: 'Batch Date', value: showStudentDetail.batch_date && showStudentDetail.batch_date !== 'Not Specified' ? showStudentDetail.batch_date : '—' },
                  { label: 'Progress', value: `${showStudentDetail.progress || 0}%` },
                  { label: 'Status', value: showStudentDetail.status },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 flex-1 min-w-[100px]">
                    <p className="text-xs text-slate-400 font-bold uppercase">{item.label}</p>
                    <p className={`text-sm font-bold mt-1 ${item.label === 'Status' && item.value === 'Active' ? 'text-green-600' :
                        item.label === 'Status' && item.value === 'At Risk' ? 'text-amber-600' :
                          item.label === 'Batch Date' ? 'text-blue-600' : 'text-slate-700'
                      }`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => { showToast(`Emailed ${showStudentDetail.name}`); setShowStudentDetail(null); }}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors active:scale-95">Send Message</button>
            </div>
          </Modal>
        )}
        {showCourseDetail && (
          <Modal isOpen onClose={() => setShowCourseDetail(null)} title="Course Details" size="lg">
            <div className="space-y-5">
              <img src={showCourseDetail.image} alt={showCourseDetail.title} className="w-full h-48 object-cover rounded-2xl" />
              <h2 className="text-xl font-black text-slate-800">{showCourseDetail.title}</h2>
              <div className="grid grid-cols-3 gap-4">
                {[{ label: 'Students', value: showCourseDetail.students }, { label: 'Rating', value: showCourseDetail.rating + ' ★' }, { label: 'Progress', value: showCourseDetail.progress + '%' }].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase">{item.label}</p>
                    <p className="text-lg font-bold text-slate-700 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setActiveTab('notes'); setShowCourseDetail(null); }} className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors">Upload Notes</button>
                <button onClick={() => { setActiveTab('assignments'); setShowCourseDetail(null); setTimeout(() => setShowNewAssignment(true), 300); }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Add Assignment</button>
              </div>
            </div>
          </Modal>
        )}
        {showResourceModal && (
          <Modal isOpen onClose={() => setShowResourceModal(false)} title="Create Resource">
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Choose what resource to create:</p>
              {[
                { label: 'Upload Notes / Material', icon: FileText, action: () => { setShowResourceModal(false); setActiveTab('notes'); } },
                { label: 'Create New Assignment', icon: ClipboardList, action: () => { setShowResourceModal(false); setActiveTab('assignments'); setTimeout(() => setShowNewAssignment(true), 300); } },
              ].map((item, i) => (
                <button key={i} onClick={item.action}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all text-left active:scale-[0.98]">
                  <div className="p-2 rounded-xl bg-blue-100"><item.icon className="w-5 h-5 text-blue-600" /></div>
                  <span className="font-semibold text-slate-700">{item.label}</span>
                </button>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <Modal isOpen={!!showAssignmentSubmissions} onClose={() => setShowAssignmentSubmissions(null)} title={`Submissions: ${showAssignmentSubmissions?.title}`} size="lg">
        {showAssignmentSubmissions && <SubmissionsList assignment={showAssignmentSubmissions} />}
      </Modal>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }` }} />
    </div>
  );
}
