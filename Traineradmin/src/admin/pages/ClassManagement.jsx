import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, Plus, Trash2, X, RefreshCw, Image as ImageIcon, AlertCircle } from 'lucide-react';

const API = 'http://127.0.0.1:8000/api';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&h=300&fit=crop';

// Map course title → enrollment count from enrichment data
const mapCourseId = (title) => {
  if (!title) return 'other';
  const t = title.toLowerCase();
  
  if (t === 'manual testing' || t.includes('manual testing')) return 'manual-testing';
  
  if (t.includes('react') || t.includes('mern') || t.includes('mongodb')) return 'mern-stack';
  if (t.includes('java')) return 'java-full-stack';
  
  if (t.includes('software testing') || t.includes('automation') || t.includes('selenium') || t === 'testing') return 'software-testing';
  if (t.includes('testing')) {
    if (t.includes('manual')) return 'manual-testing';
    return 'software-testing'; 
  }
  
  if (t.includes('python')) return 'python-development';
  if (t.includes('ui') || t.includes('ux') || t.includes('design')) return 'uiux-design';
  if (t.includes('devops') || t.includes('aws') || t.includes('docker')) return 'devops';
  if (t.includes('ai') || t.includes('ml') || t.includes('machine')) return 'aiml';
  if (t.includes('data science')) return 'data-science';
  return t.replace(/[^a-z0-9]/g, '-');
};


const ClassManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollCounts, setEnrollCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Course Modal state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', duration: '3 Months', price: '4999' });

  // ── Fetch courses from DB ──────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [courseRes, enrollRes] = await Promise.all([
        fetch(`${API}/courses-list/`),
        fetch(`${API}/enrollments/`),
      ]);
      const courseData = await courseRes.json();
      const enrollResult = await enrollRes.json();
      const enrollData = Array.isArray(enrollResult) ? enrollResult : enrollResult.data || [];

      // Build enrollment count map keyed by normalized course slug
      const counts = {};
      for (const e of enrollData) {
        const key = mapCourseId(e.title || (e.items && e.items[0]?.title));
        counts[key] = (counts[key] || 0) + 1;
      }
      setEnrollCounts(counts);
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // ── Delete course ─────────────────────────────────────────────────
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await fetch(`${API}/courses-list/${id}/`, { method: 'DELETE' });
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete course.');
    }
  };

  // ── Add Course ────────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Course title is required.'); return; }
    setSaving(true);
    setFormError('');
    try {
      const res = await fetch(`${API}/courses-list/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          imageUrl: form.imageUrl.trim() || FALLBACK_IMG,
          duration: form.duration.trim() || '12 Weeks',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.title?.[0] || data.detail || JSON.stringify(data));
        return;
      }
      setCourses(prev => [data, ...prev]);
      setShowModal(false);
      setForm({ title: '', description: '', imageUrl: '', duration: '12 Weeks' });
    } catch (err) {
      setFormError('Failed to save course. Check connection.');
    } finally {
      setSaving(false);
    }
  };

  const studentCount = (course) => {
    const key = mapCourseId(course.title);
    return enrollCounts[key] || 0;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 lg:px-8 pt-6 relative">

      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">My Courses</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchCourses}
            className="p-2.5 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <Plus size={16} /> New Course
          </button>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          {error}
          <button onClick={fetchCourses} className="ml-auto text-xs font-bold underline">Retry</button>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && courses.length === 0 && (
        <div className="py-20 text-center">
          <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-semibold">No courses yet. Create your first course.</p>
        </div>
      )}

      {/* ── Courses Grid ── */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {courses.map((course) => {
            const imgSrc = course.imageUrl ? (course.imageUrl.startsWith("http") ? course.imageUrl : `http://127.0.0.1:8000${course.imageUrl}`) : FALLBACK_IMG;
            const count = studentCount(course);
            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col group"
              >
                {/* Banner */}
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={imgSrc}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = FALLBACK_IMG; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-bold text-lg leading-tight drop-shadow-sm">{course.title}</h4>
                    {course.duration && (
                      <span className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {course.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col">
                  {course.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                  )}

                  <div className="flex justify-between text-xs text-slate-500 font-bold">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-slate-400" /> {count} Students
                    </span>
                  </div>

                  <div className="flex gap-3 mt-auto pt-1">
                    <button
                      onClick={() => navigate(`/admin/courses/${course.slug}/progress`)}
                      className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 rounded-xl text-xs font-black tracking-wide uppercase transition-colors active:scale-95 text-center"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      className="px-3 py-2.5 border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors active:scale-95 flex items-center justify-center shrink-0"
                      title="Delete Course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add Course Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Add New Course</h3>
              <button
                onClick={() => { setShowModal(false); setFormError(''); }}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" /> {formError}
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. React Full Stack Development"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief course description..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g. 3 Months"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                    Price (₹)
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 4999"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                  Banner Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..."
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 shrink-0">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <ImageIcon size={18} className="text-slate-300" />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                  Duration
                </label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  placeholder="e.g. 12 Weeks"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormError(''); }}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60 shadow-md"
                >
                  {saving ? 'Saving…' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;