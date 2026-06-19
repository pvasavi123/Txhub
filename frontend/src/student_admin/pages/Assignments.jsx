import React, { useState, useEffect, useContext, useRef } from 'react';
import { ClipboardList, Calendar, ExternalLink, Upload, CheckCircle, Eye, Download, Hourglass, Star, FileText, X } from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'submitted' | 'graded'
  const fileInputRef = useRef(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [previewFile, setPreviewFile] = useState(null); // { url, name }

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const fetchAssignments = () => {
    if (!user) return;
    
    const idParam = user.id ? `student_id=${user.id}` : '';
    const emailParam = user.email ? `email=${encodeURIComponent(user.email)}` : '';
    const queryParams = [idParam, emailParam].filter(Boolean).join('&');
    
    if (!queryParams) {
        setLoading(false);
        return;
    }

    fetch(`http://127.0.0.1:8000/api/student/assignments/?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAssignments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch assignments:', err);
        setLoading(false);
      });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedAssignment || !user?.id) return;
    
    setSubmitting(selectedAssignment);
    const formData = new FormData();
    formData.append('assignment_id', selectedAssignment);
    if (user.id) formData.append('student_id', user.id);
    if (user.email) formData.append('email', user.email);
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/student/assignments/submit/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Assignment submitted successfully!');
        fetchAssignments();
      } else {
        alert('Failed to submit assignment.');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error submitting assignment.');
    } finally {
      setSubmitting(null);
      setSelectedAssignment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onUploadClick = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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

  // Counts for each tab
  const pendingCount = assignments.filter(a => !a.is_submitted).length;
  const submittedCount = assignments.filter(a => a.is_submitted).length;

  // Filter assignments based on activeTab
  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'pending') {
      return !assignment.is_submitted;
    } else if (activeTab === 'submitted') {
      return assignment.is_submitted;
    }
    return false;
  });

  return (
    <div className="space-y-5 max-w-5xl mx-auto pt-0 pb-4 font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-1">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <ClipboardList className="text-indigo-600 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
              Assignments
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Stay on top of your tasks and submit on time.</p>
          </div>
        </div>

        {/* Realistic 3D Clay Clipboard Vector Illustration */}
        <div className="hidden md:block">
          <svg width="160" height="150" viewBox="0 0 160 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0px 15px 30px rgba(124, 58, 237, 0.2))" }}>
            <defs>
              {/* Clipboard body gradient - purple clay look */}
              <linearGradient id="boardGrad" x1="30" y1="20" x2="110" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              {/* Inner paper sheet gradient */}
              <linearGradient id="paperGrad" x1="38" y1="35" x2="102" y2="115" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F8FAFC" />
              </linearGradient>
              {/* Clip gradient */}
              <linearGradient id="clipGrad" x1="56" y1="12" x2="88" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
              {/* Blue floating upload circle gradient */}
              <linearGradient id="uploadCircleGrad" x1="95" y1="80" x2="145" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              {/* Highlights for 3D effect */}
              <linearGradient id="highlightGrad" x1="30" y1="20" x2="30" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Clipboard Board */}
            <rect x="25" y="20" width="90" height="110" rx="22" fill="url(#boardGrad)" />
            {/* 3D Highlight Inner Border */}
            <rect x="26" y="21" width="88" height="108" rx="21" stroke="url(#highlightGrad)" strokeWidth="1.5" fill="none" />

            {/* Paper Sheet */}
            <rect x="36" y="38" width="68" height="82" rx="12" fill="url(#paperGrad)" />

            {/* Clip at top */}
            <rect x="52" y="14" width="36" height="18" rx="6" fill="url(#clipGrad)" />
            <circle cx="70" cy="23" r="3" fill="#64748B" />

            {/* Checklist Items */}
            {/* Checked Item 1 */}
            <path d="M48 54 L52 58 L60 50" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="66" y="50" width="28" height="5" rx="2.5" fill="#E9D5FF" />
            <rect x="66" y="58" width="18" height="3" rx="1.5" fill="#F3E8FF" />

            {/* Checked Item 2 */}
            <path d="M48 74 L52 78 L60 70" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="66" y="70" width="28" height="5" rx="2.5" fill="#E9D5FF" />
            <rect x="66" y="78" width="18" height="3" rx="1.5" fill="#F3E8FF" />

            {/* Unchecked Item 3 */}
            <circle cx="54" cy="94" r="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2.5" />
            <rect x="66" y="92" width="24" height="5" rx="2.5" fill="#E2E8F0" />

            {/* Floating 3D Upload Circle at Bottom Right */}
            <g style={{ filter: "drop-shadow(0px 10px 20px rgba(29, 78, 216, 0.4))" }}>
              <circle cx="120" cy="105" r="24" fill="url(#uploadCircleGrad)" />
              {/* Highlight */}
              <circle cx="120" cy="105" r="23" stroke="#93C5FD" strokeWidth="1" strokeOpacity="0.4" fill="none" />
              {/* White Upload Arrow */}
              <path d="M120 94 V116 M111 103 L120 94 L129 103" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
      </div>

      {/* Tab Controls Bar */}
      <div className="flex bg-white rounded-[20px] px-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] gap-8 max-w-[340px] w-full relative overflow-hidden">
        {[
          { id: 'pending', label: 'Pending', icon: Hourglass, count: pendingCount, iconColor: 'text-purple-600', activeBg: 'bg-purple-50 text-purple-600' },
          { id: 'submitted', label: 'Submitted', icon: CheckCircle, count: submittedCount, iconColor: 'text-emerald-500', activeBg: 'bg-emerald-50 text-emerald-600' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 py-5 font-bold text-sm transition-all duration-200 relative ${
                isActive 
                  ? 'text-purple-700' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <IconComponent size={16} className={`${tab.iconColor} stroke-[2.5]`} />
              <span>{tab.label}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black transition-all ${
                isActive 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Card Container */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-800">
            {activeTab === 'pending' ? 'Pending Tasks' : 'Submitted Tasks'}
          </h2>
          <span className="bg-indigo-50 text-indigo-600 text-xs font-black px-2.5 py-0.5 rounded-full">
            {filteredAssignments.length}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-indigo-600">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <ClipboardList className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No Assignments Found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              {activeTab === 'pending' 
                ? "Excellent! You don't have any pending assignments right now." 
                : activeTab === 'submitted' 
                ? "You haven't submitted any assignments yet." 
                : "No graded assignments available."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="bg-white rounded-[20px] border border-slate-100 border-l-4 border-l-indigo-600 hover:shadow-[0_8px_24px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex flex-col md:flex-row items-start gap-4 flex-1">
                  {/* File Icon Container */}
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-wider">
                        {assignment.course}
                      </span>
                      {assignment.dueDate && (
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/50">
                          <Calendar size={13} className="text-slate-400" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug">{assignment.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{assignment.description}</p>
                    
                    {assignment.fileLink && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => setPreviewFile({ url: assignment.fileLink, name: assignment.title })}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors border border-indigo-100/50"
                        >
                          <Eye size={13} /> View Document
                        </button>
                        <button
                          onClick={() => handleDownloadFile(assignment.fileLink, assignment.title + '.' + assignment.fileLink.split('.').pop())}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors border border-slate-200"
                        >
                          <Download size={13} /> Download
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
                  {assignment.link ? (
                    <a href={assignment.link} target="_blank" rel="noopener noreferrer" className="px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0">
                      <ExternalLink size={14} /> Open Task
                    </a>
                  ) : assignment.is_submitted ? (
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2.5 bg-green-50 text-green-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 border border-green-100">
                        <CheckCircle size={14} /> Submitted
                      </div>
                      {assignment.submission_file && (
                        <button
                          onClick={() => setPreviewFile({ url: assignment.submission_file, name: assignment.title + ' (Submission)' })}
                          className="p-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="View Submission"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => onUploadClick(assignment.id)}
                      disabled={submitting === assignment.id}
                      className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {submitting === assignment.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      Upload Submission
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewFile && (() => {
        const extension = previewFile.url.split('.').pop().toLowerCase();
        const isPdf = extension === 'pdf';
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-4xl overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-800 truncate max-w-[80%]">
                  {previewFile.name}
                </h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-slate-50 flex-1 overflow-auto min-h-[400px] flex items-center justify-center">
                {isPdf ? (
                  <iframe
                    src={previewFile.url}
                    className="w-full h-[65vh] rounded-xl border border-slate-200/60"
                    title={previewFile.name}
                  />
                ) : isImage ? (
                  <img
                    src={previewFile.url}
                    alt={previewFile.name}
                    className="max-w-full max-h-[65vh] rounded-xl object-contain shadow-sm border border-slate-200/50"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-slate-800">Preview Not Available</h4>
                    <p className="text-sm text-slate-400 mt-2">
                      This format (.{extension}) cannot be previewed directly in the browser. Please download the file to view it.
                    </p>
                    <button
                      onClick={() => {
                        handleDownloadFile(previewFile.url, previewFile.name + '.' + extension);
                        setPreviewFile(null);
                      }}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Download size={15} /> Download Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Assignments;