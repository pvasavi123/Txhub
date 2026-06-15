import React, { useState, useEffect, useContext, useRef } from 'react';
import { ClipboardList, Calendar, ExternalLink, Upload, CheckCircle, Eye } from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const fetchAssignments = () => {
    if (!user) return;
    
    // Always pass what we have so the backend can resolve the student
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
        // Refresh assignments to show updated status (if backend returns it)
        // Or we just fetch again
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

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="text-indigo-600" />
          Assignments
        </h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-800">Pending Tasks</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No pending tasks for your course.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                <div>
                  <h3 className="font-bold text-slate-800">{assignment.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
                    <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{assignment.course}</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{assignment.description}</p>
                </div>
                {assignment.link ? (
                  <a href={assignment.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors text-sm whitespace-nowrap flex items-center gap-2">
                    <ExternalLink size={16} /> Open Task
                  </a>
                ) : assignment.is_submitted ? (
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-green-50 text-green-600 font-semibold rounded-lg text-sm whitespace-nowrap flex items-center gap-2 border border-green-100">
                      <CheckCircle size={16} /> Submitted
                    </div>
                    {assignment.submission_file && (
                      <a href={assignment.submission_file} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors text-sm flex items-center gap-2">
                        <Eye size={16} /> View
                      </a>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => onUploadClick(assignment.id)}
                    disabled={submitting === assignment.id}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap flex items-center gap-2 shadow-sm"
                  >
                    {submitting === assignment.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={16} />
                    )}
                    Upload Submission
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
