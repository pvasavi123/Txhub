import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Layers, UserCheck, Clock, Search, Mail,
  CheckCircle, AlertCircle, Award, BookOpen, TrendingUp,
  Bell, Calendar, Download, SlidersHorizontal, MoreVertical,
  RefreshCw, FileText, Activity
} from 'lucide-react';

import awsImg from "../../../../frontend/src/website/assets/aws.jpg";
import javaImg from "../../../../frontend/src/website/assets/java_full.jpg";
import reactImg from "../../../../frontend/src/website/assets/react_full.jpg";
import mlImg from "../../../../frontend/src/website/assets/ml.jpg";
import uiImg from "../../../../frontend/src/website/assets/ui_ux.jpg";
import mernImg from "../../../../frontend/src/website/assets/mern stack development.jpg";
import frontendImg from "../../../../frontend/src/website/assets/fronteend development.jpg";
import pythonImg from "../../../../frontend/src/website/assets/python full stack.jpg";
import dataAnalyticsImg from "../../../../frontend/src/website/assets/Data Analytics.jpg";
import dataScienceImg from "../../../../frontend/src/website/assets/dataScience.jpg";
import softImg from "../../../../frontend/src/website/assets/soft.jpg";

// ── Helpers ─────────────────────────────────────────────────────────────
const getCourseImage = (title) => {
  const t = (title || '').toLowerCase();
  if (t.includes('mern')) return mernImg;
  if (t.includes('react')) return reactImg;
  if (t.includes('java')) return javaImg;
  if (t.includes('aws') || t.includes('devops')) return awsImg;
  if (t.includes('ml') || t.includes('learning') || t.includes('machine')) return mlImg;
  if (t.includes('ui') || t.includes('ux') || t.includes('figma')) return uiImg;
  if (t.includes('data science') || t.includes('science')) return dataScienceImg;
  if (t.includes('data') || t.includes('analytics')) return dataAnalyticsImg;
  if (t.includes('python')) return pythonImg;
  if (t.includes('front end') || t.includes('frontend')) return frontendImg;
  if (t.includes('soft') || t.includes('skills') || t.includes('leadership') || t.includes('speaking')) return softImg;
  if (t.includes('testing') || t.includes('qa') || t.includes('selenium') || t.includes('manual'))
    return 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80';
  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'Completed':
      return {
        label: 'Completed',
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        bar: 'from-emerald-400 to-emerald-600',
      };
    case 'In Progress':
      return {
        label: 'In Progress',
        dot: 'bg-blue-500',
        badge: 'bg-blue-50 text-blue-700 border border-blue-100',
        bar: 'from-blue-400 to-blue-600',
      };
    default:
      return {
        label: 'Not Started',
        dot: 'bg-slate-400',
        badge: 'bg-slate-50 text-slate-500 border border-slate-200',
        bar: 'from-slate-300 to-slate-400',
      };
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ── Component ────────────────────────────────────────────────────────────
const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState('');
  const [courseImageUrl, setCourseImageUrl] = useState('');
  const [students, setStudents] = useState([]);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');

  // Resolve course title from slug — first try DB, then fallback format
  useEffect(() => {
    const resolveTitle = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/courses-list/');
        if (res.ok) {
          const courses = await res.json();
          const match = courses.find(c => c.slug === courseId);
          if (match) { 
            setCourseTitle(match.title); 
            setCourseImageUrl(match.imageUrl ? (match.imageUrl.startsWith("http") ? match.imageUrl : `http://127.0.0.1:8000${match.imageUrl}`) : '');
            return; 
          }
        }
      } catch (_) {/* ignore, use fallback */}
      // Fallback: format slug as title
      const titleMap = {
        'react-full-stack-development': 'MERN Stack / React Full Stack',
        'mern-stack': 'MERN Stack',
        'java-full-stack': 'Java Full Stack Development',
        'software-testing': 'Software Testing & Automation',
        'testing': 'Software Testing & Automation',
        'manual-testing': 'Manual Testing',
        'python-development': 'Python Development',
        'data-science': 'Data Science',
        'ai-ml': 'AI / Machine Learning',
        'aiml': 'AI / Machine Learning',
        'devops': 'DevOps & Cloud',
        'ui-ux-design': 'UI/UX Design',
        'uiux-design': 'UI/UX Design',
        'soft-skills': 'Soft Skills',
        'sql-data-analytics': 'SQL & Data Analytics',
      };
      setCourseTitle(
        titleMap[courseId] ||
        courseId.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())
      );
    };
    resolveTitle();
  }, [courseId]);

  // Fetch from backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/progress/`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setStudents(data.students || []);
      setTotalAssignments(data.total_assignments || 0);
    } catch (err) {
      console.error('Failed to fetch course progress:', err);
      setError(err.message || 'Failed to load student progress data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  // Derived
  const uniqueBatches = Array.from(new Set(students.map(s => s.batch_name))).filter(Boolean);
  const totalEnrolled = students.length;
  const completedCount = students.filter(s => s.status === 'Completed').length;
  const inProgressCount = students.filter(s => s.status === 'In Progress').length;
  const notStartedCount = students.filter(s => s.status === 'Not Started').length;
  const overallRate = totalEnrolled > 0 ? Math.round((completedCount / totalEnrolled) * 100) : 0;
  const avgCompletion = totalEnrolled > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.completion_percentage || 0), 0) / totalEnrolled)
    : 0;

  // Filtered list
  const filtered = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchBatch = selectedBatch === 'All' || s.batch_name === selectedBatch;
    return matchSearch && matchStatus && matchBatch;
  });

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">

      {/* ── TOP NAV ── */}
      <div className="bg-white border-b border-slate-100 py-3.5 px-8 sticky top-0 z-50 flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/courses')}
          className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold transition-all text-sm"
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            Student Progress Dashboard
          </span>
          <button
            onClick={fetchData}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:text-blue-600 transition-colors">
            <Bell size={16} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </button>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="max-w-7xl mx-auto px-8 mt-6">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div
            className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-center opacity-25 mix-blend-overlay hidden md:block"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800')` }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-left">
            {/* Course icon */}
            <div className="w-28 h-28 rounded-2xl bg-blue-900/60 border border-white/10 p-1 flex flex-col items-center justify-center shadow-2xl shrink-0 overflow-hidden">
              <img
                src={courseImageUrl || getCourseImage(courseTitle)}
                alt="Course logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider">
                Student Progress Dashboard
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-none">
                {courseTitle}
              </h1>
              <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
                Track individual student assignment completion, course progress, and engagement metrics.
              </p>
              <div className="flex flex-wrap items-center gap-5 pt-1 text-slate-300 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Users size={13} className="text-blue-400" />
                  {totalEnrolled} Enrolled
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-emerald-400" />
                  {completedCount} Completed
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity size={13} className="text-blue-400" />
                  {inProgressCount} In Progress
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText size={13} className="text-amber-400" />
                  {totalAssignments} Assignments
                </span>
              </div>
            </div>
          </div>

          {/* Completion rate floating card */}
          <div className="relative z-10 bg-slate-900/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shrink-0 self-end md:self-center">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                <circle
                  cx="32" cy="32" r="26"
                  stroke="#6366f1"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 - (avgCompletion / 100) * (2 * Math.PI * 26)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-black text-white">{avgCompletion}%</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Avg. Completion</p>
              <p className="font-extrabold text-white text-sm">{avgCompletion}% overall</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{overallRate}% students done</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI STAT CARDS ── */}
      <div className="max-w-7xl mx-auto px-8 mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Enrolled', value: totalEnrolled, icon: <Users size={15} />, color: 'blue' },
          { label: 'Completed', value: completedCount, icon: <Award size={15} />, color: 'emerald' },
          { label: 'In Progress', value: inProgressCount, icon: <TrendingUp size={15} />, color: 'blue' },
          { label: 'Not Started', value: notStartedCount, icon: <Clock size={15} />, color: 'amber' },
          { label: 'Assignments', value: totalAssignments, icon: <BookOpen size={15} />, color: 'fuchsia' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
              <h2 className="text-3xl font-black text-slate-800 leading-none">{value}</h2>
            </div>
            <div className={`p-2.5 bg-${color}-50 text-${color}-600 rounded-2xl`}>{icon}</div>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div className="max-w-7xl mx-auto px-8 mt-7 flex flex-col lg:flex-row items-center gap-4 justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-xs shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="student-search"
            type="text"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* Status filter */}
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 focus:outline-none cursor-pointer shadow-sm min-w-32"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>

          {/* Batch filter */}
          <select
            id="batch-filter"
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 focus:outline-none cursor-pointer shadow-sm min-w-32"
          >
            <option value="All">All Batches</option>
            {uniqueBatches.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>

          <button className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm">
            <SlidersHorizontal size={15} />
          </button>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="max-w-7xl mx-auto px-8 mt-5">
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">

          {/* Loading */}
          {loading && (
            <div className="py-24 text-center text-slate-400">
              <div className="w-9 h-9 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest">Loading student progress…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-24 text-center flex flex-col items-center gap-3">
              <AlertCircle size={42} className="text-rose-300" />
              <p className="text-sm font-extrabold text-rose-500">Failed to load data</p>
              <p className="text-xs text-slate-400 max-w-sm">{error}</p>
              <button
                onClick={fetchData}
                className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black tracking-wide transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="py-24 text-center flex flex-col items-center gap-3">
              <Users size={42} className="text-slate-200" />
              <p className="text-sm font-extrabold text-slate-600">
                {students.length === 0
                  ? 'No students enrolled in this course yet.'
                  : 'No students match your current filters.'}
              </p>
              {students.length > 0 && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedStatus('All'); setSelectedBatch('All'); }}
                  className="mt-1 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-black hover:bg-blue-100 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-slate-50/50">
              {filtered.map((s) => {
                const cfg = getStatusConfig(s.status);
                const pct = s.completion_percentage ?? s.progress ?? 0;

                return (
                  <div key={s.student_id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                    
                    {/* Header: Avatar, Name, Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0">
                          {(s.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-extrabold text-slate-800 text-sm leading-tight truncate" title={s.name}>{s.name}</p>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">ID: {s.student_id}</p>
                        </div>
                      </div>
                       <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                          <MoreVertical size={16} />
                       </button>
                    </div>

                    {/* Progress Circle & Status Badge */}
                    <div className="flex items-center justify-between mb-5 bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        <div className="flex items-center gap-2">
                           <span className="font-extrabold text-slate-700 text-sm">{pct}%</span>
                           <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${cfg.bar} rounded-full transition-all duration-700`}
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                      {/* Enrollment */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <Calendar size={10} /> Enrolled
                        </p>
                         <p className="text-xs font-bold text-slate-700">{formatDate(s.enrollment_date)}</p>
                      </div>
                      
                      {/* Days */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <Clock size={10} /> Time
                        </p>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-bold ${
                             (s.days_completed ?? 0) >= 90 ? 'text-emerald-600' : 'text-blue-600'
                           }`}>
                             {s.days_completed ?? 0}
                           </span>
                           <span className="text-[10px] text-slate-400 font-semibold">/ 90d</span>
                        </div>
                      </div>

                      {/* Assignments */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 col-span-2 flex justify-between items-center">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                              <BookOpen size={10} /> Tasks
                            </p>
                            <p className="text-xs font-bold text-slate-700">
                               {s.completed_assignments ?? 0} <span className="text-slate-400 font-medium">of {s.total_assignments ?? totalAssignments}</span>
                            </p>
                         </div>
                         {(s.pending_assignments ?? 0) > 0 && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[10px] font-black">
                              {s.pending_assignments} Pending
                            </span>
                         )}
                      </div>
                    </div>

                    {/* Footer: Certificate */}
                    <div className="pt-3 border-t border-slate-100 mt-auto">
                        {s.certificate_eligible ? (
                          <div className="flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-black transition-colors hover:bg-emerald-100 cursor-pointer">
                            <Award size={13} /> Certificate Eligible
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-[10px] font-black" title={(s.days_elapsed ?? 0) > 90 ? 'Course window expired' : 'Not completed yet'}>
                            <AlertCircle size={13} /> {(s.days_elapsed ?? 0) > 90 ? 'Course Expired' : 'Not Yet Eligible'}
                          </div>
                        )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination info */}
        {!loading && !error && (
          <div className="flex items-center justify-between mt-5 text-xs text-slate-400 font-semibold px-2">
            <span>
              Showing {filtered.length} of {totalEnrolled} student{totalEnrolled !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-40">‹</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-black">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-40">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseProgress;
