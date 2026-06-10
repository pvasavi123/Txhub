import React, { useState, useEffect, useContext } from 'react';
import { ClipboardList, Calendar, ExternalLink } from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [user]);

  return (
    <div className="space-y-6">
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
                ) : (
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors text-sm whitespace-nowrap">
                    Submit Now
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
