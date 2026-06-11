import React, { useState, useEffect, useContext } from 'react';
import { Notebook, Search, FileText, Eye } from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';

const Notes = () => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
  }, [user]);

  const filteredNotes = notes.filter(n => 
    n.title?.toLowerCase().includes(search.toLowerCase()) || 
    n.course?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Notebook className="text-indigo-600" />
          My Notes
        </h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 text-slate-500">
          No notes available for your course yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-yellow-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              <h3 className="font-bold text-lg text-slate-800">{note.title}</h3>
              <p className="text-slate-500 text-xs mt-1 font-semibold uppercase">{note.course}</p>
              <p className="text-slate-600 text-sm mt-3 line-clamp-4">
                {note.content || "No description provided."}
              </p>
              <div className="mt-4 pt-4 border-t border-yellow-200/50 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
                {note.fileLink && (
                  <a href={note.fileLink} target="_blank" rel="noopener noreferrer" 
                    className="text-indigo-600 font-semibold text-sm hover:underline flex items-center gap-1">
                    <Eye size={14} /> View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
