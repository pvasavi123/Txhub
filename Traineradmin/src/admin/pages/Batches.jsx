import React, { useState, useEffect } from 'react';

import {
  Calendar,
  Trash2,
  Plus,
  Layers,
  Cpu,
  Clock,
  ChevronLeft,
  User,
  ArrowRight,
  Code2,
  Coffee,
  Database,
  Globe,
  Bug,
  ShieldCheck,
  Terminal,
  Smartphone,
  PenTool,
  Cloud,
  Brain,
  BarChart3,
  PieChart,
  Mic
} from "lucide-react";

const COURSE_LIST = [
  { name: 'React'},
  { name: 'Java Full Stack'},
  { name: 'Python FullStack' },
  { name: 'MERN Stack' },
  { name: 'Web Development' },
  { name: 'Manual Testing' },
  { name: 'Advanced Software Testnig' },
  { name: 'API Testing with Postman'},
  { name: 'Mobile App Automation' },
  { name: 'UI/UX Design' },
  { name: 'AWS & DevOps' },
  { name: 'Machine Learning'},
  { name: 'Data Science' },
  { name: 'Data Analytics' },
  { name: 'Leadership & Team Management' },
  { name: 'Public Speaking' },
  { name: 'Critical Thinking & Problem Solving' },
 
];


const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    course: COURSE_LIST[0].name,
    startDate: '',
    assigned_mentor: '',
  });

  const fetchBatches = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/batches/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBatches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch batches:', err);
        setLoading(false);
      });
  };

  const fetchMentors = () => {
    fetch('http://127.0.0.1:8000/api/mentors/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMentors(data);
      })
      .catch(err => console.error('Failed to fetch mentors:', err));
  };

  useEffect(() => {
    fetchBatches();
    fetchMentors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      name: formData.name,
      course: formData.course,
      startDate: formData.startDate,
    };

    fetch('http://127.0.0.1:8000/api/batches/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async res => {
        if (res.ok) {
          const newBatch = await res.json();
          // Assign mentor if selected
          if (formData.assigned_mentor && newBatch.id) {
            await fetch(`http://127.0.0.1:8000/api/batches/${newBatch.id}/assign-mentor/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mentor_id: formData.assigned_mentor }),
            }).catch(() => {});
          }
          fetchBatches();
          setFormData({ name: '', course: selectedCourse || COURSE_LIST[0].name, startDate: '', assigned_mentor: '' });
          setShowForm(false);
        } else {
          alert('Failed to create batch.');
        }
      })
      .catch(err => console.error('Error creating batch:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this batch?')) return;
    fetch(`http://127.0.0.1:8000/api/batches/${id}/`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) fetchBatches();
        else alert('Failed to delete batch.');
      })
      .catch(err => console.error('Error deleting batch:', err));
  };

  // Batches filtered by selected course
  const courseBatches = selectedCourse
    ? batches.filter(b => b.course === selectedCourse)
    : [];

  // Counts per course for the course cards
  const batchCountByCourse = batches.reduce((acc, b) => {
    acc[b.course] = (acc[b.course] || 0) + 1;
    return acc;
  }, {});

  const getMentorName = (batch) => {
    if (batch.assigned_mentor_name) return batch.assigned_mentor_name;
    if (batch.assigned_mentor) {
      const m = mentors.find(m => m.id === batch.assigned_mentor);
      return m ? m.name : 'Unassigned';
    }
    return 'Unassigned';
  };
  




    const getCourseIcon = (name) => {
  if (name.includes("React")) return Code2;
  if (name.includes("Java")) return Coffee;
  if (name.includes("Python")) return Cpu;
  if (name.includes("MERN")) return Database;
  if (name.includes("Web")) return Globe;
  if (name.includes("Manual")) return Bug;
  if (name.includes("Advanced")) return ShieldCheck;
  if (name.includes("Postman")) return Terminal;
  if (name.includes("Mobile")) return Smartphone;
  if (name.includes("UI")) return PenTool;
  if (name.includes("AWS")) return Cloud;
  if (name.includes("Machine")) return Brain;
  if (name.includes("Data Science")) return BarChart3;
  if (name.includes("Analytics")) return PieChart;
  if (name.includes("Leadership")) return User;
  if (name.includes("Speaking")) return Mic;

  return Layers;
};


  // ── COURSE GRID VIEW ────────────────────────────────────────────────────
  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="text-blue-600" />
            Batch Management
          </h1>
        </div>

        <p className="text-sm text-slate-400 font-medium">Select a course to view and manage its batches.</p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {COURSE_LIST.map(({ name, color, light }) => {
              const count = batchCountByCourse[name] || 0;
               const Icon = getCourseIcon(name);
              return (


<button
  key={name}
  onClick={() => setSelectedCourse(name)}
  className="
    group
    bg-white
    rounded-2xl
    p-5
    border
    border-slate-200
    shadow-sm
    hover:shadow-lg
    hover:border-blue-200
    hover:-translate-y-1
    transition-all
    duration-300
    text-left
  "
>
  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">

    {/* Icon */}
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
      <Icon size={18} className="text-blue-600 sm:w-[22px] sm:h-[22px]" />
    </div>

    {/* Content */}
    <div className="flex-1">
     <h3 className="text-xs sm:text-base lg:text-lg font-semibold text-slate-800 leading-snug sm:break-words line-clamp-2 sm:line-clamp-none">
  {name}
</h3>

      

      <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
        <Layers size={14} />
        <span>
          {count} {count === 1 ? "Batch" : "Batches"}
        </span>
      </div>
    </div>
  </div>

  {/* Footer */}
  <div className="mt-3 pt-3 border-t border-slate-100">
    <div className="flex items-center justify-center sm:justify-between text-blue-600 font-medium text-xs sm:text-sm">
      <span>View Batches</span>

      <ArrowRight
        size={16}
        className="group-hover:translate-x-1 transition-all"
      />
    </div>
  </div>
</button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── BATCHES LIST FOR SELECTED COURSE ────────────────────────────────────
  const courseInfo = COURSE_LIST.find(c => c.name === selectedCourse) || COURSE_LIST[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedCourse(null); setShowForm(false); }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Course</p>
            <h1 className="text-xl font-bold text-slate-800">{selectedCourse}</h1>
          </div>
        </div>
        <button
          onClick={() => {
            setFormData(prev => ({ ...prev, course: selectedCourse }));
            setShowForm(!showForm);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 text-sm"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Create Batch</>}
        </button>
      </div>

      {/* Create Batch Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-lg space-y-4 animate-fadeIn"
        >
          <h2 className="font-bold text-lg text-slate-800">New Batch — {selectedCourse}</h2>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase">Batch Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter batch name (e.g. June 2026)"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase">Assign Mentor <span className="text-slate-300 normal-case font-semibold">(optional)</span></label>
            <select
              name="assigned_mentor"
              value={formData.assigned_mentor}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
            >
              <option value="">— Select Mentor —</option>
              {mentors.length === 0 && (
                <option disabled>No mentors available. Please add mentors first.</option>
              )}
              {mentors.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.assigned_course || 'All Courses'})</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95"
          >
            Create Batch
          </button>
        </form>
      )}

      {/* Batch Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : courseBatches.length === 0 ? (
        <div className="p-10 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          <Layers size={32} className="mx-auto mb-3 text-slate-200" />
          <p className="font-semibold">No batches for this course yet.</p>
          <p className="text-xs mt-1">Click <strong>Create Batch</strong> above to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courseBatches.map((batch) => {
            const mentorName = getMentorName(batch);
            return (
              <div
                key={batch.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${courseInfo.color}`} />

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base text-slate-800">{batch.name}</h3>
                    <button
                      onClick={() => handleDelete(batch.id)}
                      className="text-slate-300 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-xl transition-all duration-200 active:scale-90"
                      title="Delete Batch"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Mentor badge */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <User size={13} className="text-blue-400" />
                    <span className={mentorName === 'Unassigned' ? 'text-slate-400 italic' : 'text-blue-600 font-bold'}>
                      {mentorName}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    {batch.startDate
                      ? new Date(batch.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Start date TBD'}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                    <Clock size={10} /> Active
                  </span>
                </div>

                {batch.students && batch.students.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5">
                      Students ({batch.students.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {batch.students.slice(0, 5).map(s => (
                        <span
                          key={s.id}
                          title={s.email}
                          className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-bold"
                        >
                          {s.name}
                        </span>
                      ))}
                      {batch.students.length > 5 && (
                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-bold">
                          +{batch.students.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Batches;
