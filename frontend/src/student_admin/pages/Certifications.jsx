import React, { useState, useEffect } from 'react';
import { Award, Upload, Trash2, CheckCircle } from 'lucide-react';
 
export default function Certifications() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
 
  useEffect(() => {
    fetchTemplates();
  }, []);
 
  const fetchTemplates = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/certificate-templates/');
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a template image file.");
      return;
    }
 
    setUploading(true);
    const formData = new FormData();
    formData.append('template_image', file);
 
    try {
      const res = await fetch('http://127.0.0.1:8000/api/certificate-templates/', {
        method: 'POST',
        body: formData,
      });
 
      if (res.ok) {
        alert("Template uploaded successfully! This template will be used for all courses.");
        setFile(null);
        e.target.reset();
        fetchTemplates();
      } else {
        const errorData = await res.json();
        alert(JSON.stringify(errorData));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading template.");
    } finally {
      setUploading(false);
    }
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/certificate-templates/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTemplates();
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      console.error(err);
    }
  };
 
  const activeTemplate = templates[templates.length - 1];
 
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <Award className="w-8 h-8 text-indigo-600" />
          Certifications
        </h1>
        <p className="text-slate-500 mt-2">
          Upload one global certificate template used for all courses.
        </p>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm col-span-1 h-fit">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Upload New Template</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">
                Template Image (PNG/JPG)
              </label>
              <p className="text-xs text-slate-400 mb-2">
                This single template will be applied to certificates for all courses. The student name, course name, and date will be printed on top.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50"
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : <><Upload size={18} /> Upload Template</>}
            </button>
          </form>
        </div>
 
        {/* Active Template + All Templates */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Active Template highlight */}
          {activeTemplate && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-center gap-4">
              <CheckCircle className="text-indigo-600 shrink-0" size={28} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  Currently Active Template
                </p>
                <a
                  href={activeTemplate.template_image}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-700 font-bold hover:underline truncate block"
                >
                  View Template Image →
                </a>
                <p className="text-xs text-slate-500 mt-1">
                  Uploaded: {new Date(activeTemplate.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
 
          {/* All templates list */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-700 mb-4">All Templates</h2>
 
            {loading ? (
              <p className="text-slate-500">Loading...</p>
            ) : templates.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl">
                <Award className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-slate-500">No templates uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...templates].reverse().map((t, idx) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${idx === 0 ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-slate-50'}`}
                  >
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full mr-2 ${idx === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                        {idx === 0 ? 'Active' : 'Old'}
                      </span>
                      <a
                        href={t.template_image}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        View Image
                      </a>
                      <span className="text-xs text-slate-400 ml-3">
                        {new Date(t.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="py-1.5 px-3 bg-rose-50 text-rose-600 rounded-lg font-bold hover:bg-rose-100 flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}