import React, { useState, useEffect, useContext } from 'react';
import { Award, Download, Eye, Calendar, BookOpen, FileText } from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';

const SampleCertificates = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/certificates/?email=${user.email}`);
        const data = await response.json();
        if (response.ok) {
          setCertificates(data.data || []);
        } else {
          setError(data.error || 'Failed to load certificates');
        }
      } catch (err) {
        console.error('Fetch certificates error:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  const handleDownload = (pdfUrl, filename) => {
    const link = document.createElement('a');
    link.href = `http://127.0.0.1:8000${pdfUrl}`;
    link.download = filename || 'certificate.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Award className="text-blue-600" />
          My Achievements
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl flex items-center gap-3 text-sm">
          <Award size={20} />
          <p>{error}</p>
        </div>
      ) : certificates.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100 max-w-xl mx-auto mt-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No Certificates Earned</h3>
          <p className="text-slate-500 mt-2 mb-6">
            Complete your enrolled courses to 100% progress to generate and unlock your achievements!
          </p>
        </div>
      ) : (
        /* Grid of Certificates */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Icon & ID */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Award size={22} />
                  </div>
                  <span className="text-[10px] font-mono bg-slate-50 border border-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                    ID: {cert.certificate_id}
                  </span>
                </div>

                {/* Course Name */}
                <h3 className="font-bold text-slate-850 text-base leading-snug mb-3">
                  {cert.course}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-6">
                  <Calendar size={14} />
                  <span>Issued: {new Date(cert.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-4 border-t border-slate-50">
                <a
                  href={`http://127.0.0.1:8000${cert.pdf_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-slate-50 border border-slate-100 text-slate-650 hover:bg-slate-100 hover:text-slate-800 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                >
                  <Eye size={14} /> View
                </a>
                <button
                  onClick={() => handleDownload(cert.pdf_file, `certificate_${cert.certificate_id}.pdf`)}
                  className="flex-1 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-xs"
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SampleCertificates;
