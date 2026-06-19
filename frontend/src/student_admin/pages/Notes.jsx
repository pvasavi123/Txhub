import React, { useState, useEffect, useContext, useRef } from 'react';
import { Notebook, Search, FileText, Eye, Download, Calendar, Plus, X, Folder, MoreVertical, Trash2 } from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';

const Notes = () => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [previewFile, setPreviewFile] = useState(null); // { url, name }
  
  // Add Note Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Student course and batch info
  const [studentCourse, setStudentCourse] = useState('');
  const [studentBatch, setStudentBatch] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchNotes();
    fetchStudentInfo();
  }, [user]);

  const fetchNotes = () => {
    if (!user) return;
    
    const idParam = user.id ? `student_id=${user.id}` : '';
    const emailParam = user.email ? `email=${encodeURIComponent(user.email)}` : '';
    const queryParams = [idParam, emailParam].filter(Boolean).join('&');
    
    if (!queryParams) {
        setLoading(false);
        return;
    }

    fetch(`http://127.0.0.1:8000/api/student/notes/?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch notes:', err);
        setLoading(false);
      });
  };

  const fetchStudentInfo = () => {
    if (!user?.email && !user?.id) return;
    const idParam = user.id ? `student_id=${user.id}` : '';
    const emailParam = user.email ? `email=${encodeURIComponent(user.email)}` : '';
    const queryParams = [idParam, emailParam].filter(Boolean).join('&');

    fetch(`http://127.0.0.1:8000/api/student/notes/?${queryParams}`)
      .then(res => {
        // Just calling a student info fetch
        return fetch(`http://127.0.0.1:8000/api/students/?${emailParam}`);
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const student = data[0];
          setStudentCourse(student.courseSpecialization || '');
          setStudentBatch(student.batch_date || 'June Batch');
          setNewCourse(student.courseSpecialization || '');
        }
      })
      .catch(err => console.error("Error fetching student info:", err));
  };

  const handleDownloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename || url.split('/').pop() || 'document');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed, opening in new tab:', error);
      window.open(url, '_blank');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFile) {
      alert('Please provide a title and select a file.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', newTitle.trim());
    formData.append('course', newCourse || studentCourse || 'General');
    formData.append('batch_month', studentBatch || 'Not Specified');
    formData.append('fileLink', newFile);
    formData.append('content', `Uploaded by student ${user.email}`);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/notes/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Note uploaded successfully!');
        setShowAddModal(false);
        setNewTitle('');
        setNewFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchNotes();
      } else {
        alert('Failed to upload note.');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Error uploading note.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title?.toLowerCase().includes(search.toLowerCase()) || 
    n.course?.toLowerCase().includes(search.toLowerCase())
  );

  // Colors list to alternate card accents
  const borderColors = [
    'border-l-purple-500 shadow-purple-100/10',
    'border-l-orange-500 shadow-orange-100/10',
    'border-l-blue-500 shadow-blue-100/10',
    'border-l-emerald-500 shadow-emerald-100/10',
    'border-l-rose-500 shadow-rose-100/10'
  ];

  const badgeColors = [
    'bg-purple-50 text-purple-600 border-purple-100',
    'bg-orange-50 text-orange-600 border-orange-100',
    'bg-blue-50 text-blue-600 border-blue-100',
    'bg-emerald-50 text-emerald-600 border-emerald-100',
    'bg-rose-50 text-rose-600 border-rose-100'
  ];

  return (
    <div className="space-y-5 max-w-5xl mx-auto pt-0 pb-4 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-1">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <Notebook className="text-indigo-600 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
              My Notes
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">All your saved notes and important documents.</p>
          </div>
        </div>

        {/* Realistic 3D Clay Spiral Notebook Illustration */}
        <div className="hidden md:block">
          <svg width="170" height="150" viewBox="0 0 170 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0px 15px 30px rgba(139, 92, 246, 0.2))" }}>
            <defs>
              {/* Notebook cover gradient */}
              <linearGradient id="coverGrad" x1="40" y1="20" x2="115" y2="125" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              {/* Inner highlight for 3D cover */}
              <linearGradient id="coverHighlight" x1="40" y1="20" x2="40" y2="125" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              {/* Sticky Note Gradient */}
              <linearGradient id="stickyGrad" x1="58" y1="42" x2="98" y2="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFDF0" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
              {/* Pen Gradient */}
              <linearGradient id="penBodyGrad" x1="100" y1="65" x2="155" y2="115" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#5B21B6" />
              </linearGradient>
              {/* Shadow for sticky note */}
              <filter id="stickyShadow" x="52" y="38" width="52" height="52" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#4C1D95" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Backing pages/sheets visible underneath (rotated slightly) */}
            <g transform="rotate(-5 78 75)">
              <rect x="42" y="24" width="76" height="102" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              <rect x="44" y="26" width="76" height="102" rx="14" fill="#F1F5F9" />
            </g>

            {/* Main Notebook Cover (rotated slightly) */}
            <g transform="rotate(-5 78 75)">
              {/* Main cover rect */}
              <rect x="40" y="20" width="76" height="102" rx="14" fill="url(#coverGrad)" />
              {/* 3D highlight inner border */}
              <rect x="41" y="21" width="74" height="100" rx="13" stroke="url(#coverHighlight)" strokeWidth="1.5" fill="none" />

              {/* Sticky Note */}
              <g transform="rotate(3 78 65)" style={{ filter: "url(#stickyShadow)" }}>
                <rect x="56" y="40" width="44" height="42" rx="4" fill="url(#stickyGrad)" />
                {/* Lines on sticky note */}
                <line x1="64" y1="50" x2="92" y2="50" stroke="#DDD6FE" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="64" y1="59" x2="92" y2="59" stroke="#DDD6FE" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="64" y1="68" x2="84" y2="68" stroke="#DDD6FE" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Spiral rings on the left edge */}
              <rect x="35" y="32" width="10" height="4" rx="2" fill="#E2E8F0" />
              <rect x="35" y="46" width="10" height="4" rx="2" fill="#E2E8F0" />
              <rect x="35" y="60" width="10" height="4" rx="2" fill="#E2E8F0" />
              <rect x="35" y="74" width="10" height="4" rx="2" fill="#E2E8F0" />
              <rect x="35" y="88" width="10" height="4" rx="2" fill="#E2E8F0" />
              <rect x="35" y="102" width="10" height="4" rx="2" fill="#E2E8F0" />
            </g>

            {/* Pen lying on the right */}
            <g transform="rotate(28 120 95)" style={{ filter: "drop-shadow(0px 8px 16px rgba(124, 58, 237, 0.3))" }}>
              {/* Pen body */}
              <rect x="117" y="65" width="8" height="58" rx="4" fill="url(#penBodyGrad)" />
              {/* Silver tip */}
              <path d="M117 65 L121 56 L125 65 Z" fill="#E2E8F0" />
              {/* Silver tip point */}
              <path d="M120 56 L121 56 L121 59 Z" fill="#4C1D95" />
              {/* Clip */}
              <rect x="122" y="75" width="2" height="15" rx="1" fill="#E2E8F0" opacity="0.9" />
              {/* Pen cap joint highlight */}
              <line x1="117" y1="88" x2="125" y2="88" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />
            </g>

            {/* Background Floaty Spheres */}
            <circle cx="20" cy="85" r="7" fill="#C084FC" opacity="0.35" style={{ filter: "blur(0.5px)" }} />
            <circle cx="24" cy="115" r="4" fill="#E2E8F0" opacity="0.5" />
            <circle cx="148" cy="72" r="5" fill="#C084FC" opacity="0.25" />
            <circle cx="138" cy="40" r="8" fill="#E2E8F0" opacity="0.4" style={{ filter: "blur(0.5px)" }} />
          </svg>
        </div>
      </div>

      {/* Tabs and Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-4">
        <div className="flex gap-8">
          <button className="flex items-center gap-2 py-3 font-bold text-sm text-purple-700 relative">
            <span>All Notes</span>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-600 rounded-t-full" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-indigo-600">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6 bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <Notebook className="w-16 h-16 text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No Notes Available</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            No notes have been shared for your course specialization yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note, index) => {
            const ext = note.fileLink ? note.fileLink.split('.').pop().toLowerCase() : '';
            const isPdf = ext === 'pdf';
            const colorClass = borderColors[index % borderColors.length];
            const badgeClass = badgeColors[index % badgeColors.length];
            
            // Format file size
            const sizeLabel = isPdf ? 'Type: PDF  •  Size: 92.0 KB' : ext ? `Type: ${ext.toUpperCase()}` : 'Type: Document';

            return (
              <div 
                key={note.id} 
                className={`bg-white rounded-[20px] border border-slate-100 border-l-4 ${colorClass} hover:shadow-[0_8px_24px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col justify-between min-h-[160px]`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Container */}
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${isPdf ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                    <FileText className="w-6 h-6" />
                    {isPdf && <span className="text-[8px] font-black tracking-tighter -mt-1">PDF</span>}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${badgeClass}`}>
                        {note.course}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 tracking-tight truncate pr-2">{note.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{sizeLabel}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Calendar size={13} className="text-slate-400" />
                    {new Date(note.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>

                  <div className="flex items-center gap-2">
                    {note.fileLink && (
                      <>
                        <a
                          href={note.fileLink.startsWith('http') ? note.fileLink : `http://127.0.0.1:8000${note.fileLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-all"
                        >
                          <Eye size={13} /> View
                        </a>
                        <button
                          onClick={() => handleDownloadFile(note.fileLink.startsWith('http') ? note.fileLink : `http://127.0.0.1:8000${note.fileLink}`, note.title + '.' + ext)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
                          title="Download Note"
                        >
                          <Download size={14} />
                        </button>
                      </>
                    )}
                    <button className="p-1.5 text-slate-300 hover:text-slate-500 rounded-lg transition-all">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notes;
