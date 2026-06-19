import React, { useState, useEffect } from 'react';
import {
  UserCheck, Calendar, Users, ChevronRight, Search,
  TrendingUp, X, RefreshCw, Filter
} from 'lucide-react';

const BASE = 'http://127.0.0.1:8000/api';

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${bg}`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [batches, setBatches] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Filters
  const [filterMentor, setFilterMentor] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterMentor) params.append('mentor_id', filterMentor);
      if (filterBatch) params.append('batch_id', filterBatch);
      if (filterDate) params.append('date', filterDate);
      const url = `${BASE}/attendance/${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorsBatches = async () => {
    try {
      const [mRes, bRes] = await Promise.allSettled([
        fetch(`${BASE}/mentors/`).then(r => r.json()),
        fetch(`${BASE}/batches/`).then(r => r.json()),
      ]);
      if (mRes.status === 'fulfilled') setMentors(Array.isArray(mRes.value) ? mRes.value : []);
      if (bRes.status === 'fulfilled') setBatches(Array.isArray(bRes.value) ? bRes.value : []);
    } catch (err) { /* ignore */ }
  };

  useEffect(() => {
    fetchMentorsBatches();
    fetchRecords();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchRecords();
  };

  const clearFilters = () => {
    setFilterMentor('');
    setFilterBatch('');
    setFilterDate('');
    setTimeout(fetchRecords, 0);
  };

  // Group records by date + batch
  const grouped = {};
  records.forEach(r => {
    const key = `${r.attendance_date}__${r.batch}`;
    if (!grouped[key]) {
      grouped[key] = {
        key,
        date: r.attendance_date,
        batch_id: r.batch,
        batch_name: r.batch_name || `Batch #${r.batch}`,
        mentor_name: r.mentor_name || '—',
        records: []
      };
    }
    grouped[key].records.push(r);
  });
  const groupedList = Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));

  // Summary stats
  const totalStudents = records.length;
  const totalPresent = records.filter(r => r.status === 'Present').length;
  const totalAbsent = records.filter(r => r.status === 'Absent').length;
  const attendancePct = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <UserCheck className="w-7 h-7 text-indigo-600" /> Attendance Management
        </h1>
        <p className="text-slate-500 mt-1 text-sm">View and filter attendance across all mentors and batches</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Mentor</label>
            <select value={filterMentor} onChange={e => setFilterMentor(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="">All Mentors</option>
              {mentors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Batch</label>
            <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="">All Batches</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Date</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
          </div>
          <div className="flex gap-2">
            <button type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
              <Filter className="w-4 h-4" /> Apply
            </button>
            <button type="button" onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
              <X className="w-4 h-4" /> Clear
            </button>
            <button type="button" onClick={fetchRecords}
              className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Attendance Records
            <span className="text-xs font-normal text-slate-400 ml-1">({groupedList.length} sessions)</span>
          </h3>
        </div>

        <div className="p-5">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3 text-indigo-600">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Loading records...
            </div>
          )}
          {!loading && groupedList.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <UserCheck className="w-14 h-14 mx-auto mb-3 opacity-20" />
              <p className="font-semibold text-sm">No attendance records found</p>
              <p className="text-xs mt-1">Try adjusting the filters or ask mentors to mark attendance</p>
            </div>
          )}
          {!loading && groupedList.length > 0 && (
            <div className="space-y-3">
              {groupedList.map(group => {
                const presentCount = group.records.filter(r => r.status === 'Present').length;
                const absentCount = group.records.filter(r => r.status === 'Absent').length;
                const pct = group.records.length > 0 ? Math.round((presentCount / group.records.length) * 100) : 0;
                const isExpanded = expandedGroup === group.key;

                return (
                  <div key={group.key} className="border border-slate-100 rounded-2xl overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50/80 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-xl">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{group.date}</p>
                          <p className="text-xs text-slate-500">{group.batch_name} · Mentor: {group.mentor_name}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex gap-2 text-xs font-bold">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg">{presentCount} Present</span>
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg">{absentCount} Absent</span>
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">{group.records.length} Total</span>
                          <span className={`px-2 py-1 rounded-lg ${pct >= 75 ? 'bg-emerald-100 text-emerald-700' : pct >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                            {pct}%
                          </span>
                        </div>
                        <button onClick={() => setExpandedGroup(prev => prev === group.key ? null : group.key)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
                          {isExpanded ? 'Hide' : 'View'}
                          <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                              <th className="pb-2 pr-4">#</th>
                              <th className="pb-2 pr-4">Student</th>
                              <th className="pb-2 pr-4">Email</th>
                              <th className="pb-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.records.map((r, i) => (
                              <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                <td className="py-2.5 pr-4 text-slate-400 text-xs">{i + 1}</td>
                                <td className="py-2.5 pr-4 font-semibold text-slate-700">{r.student_name || `Student #${r.student}`}</td>
                                <td className="py-2.5 pr-4 text-slate-400 text-xs">{r.student_email || '—'}</td>
                                <td className="py-2.5">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    {r.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
