import React, { useState, useEffect } from 'react';
import {
  Download, IndianRupee, ShieldCheck, Users as UsersIcon,
  Wallet, Activity, Cpu, Globe, Eye, Edit2, Check, X
} from 'lucide-react';

import { useAdmin } from '../context/AdminContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAssignmentUser, setActiveAssignmentUser] = useState(null);
  const { markAsSeen } = useAdmin();

  useEffect(() => {
    markAsSeen();
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/enrollments/');
        const result = await response.json();
        const dataArray = Array.isArray(result) ? result : result.data;

        const formatted = (dataArray || []).map(u => {
          let itemsArray = [];

          if (Array.isArray(u.items)) {
            itemsArray = u.items;
          } else if (typeof u.items === "string") {
            try {
              const parsed = JSON.parse(u.items);
              itemsArray = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              itemsArray = [];
            }
          } else if (u.items && typeof u.items === "object") {
            itemsArray = [u.items];
          }

          if (!Array.isArray(itemsArray)) itemsArray = [];

          const totalFee = Number(u.total_fee) || 0;
          const paidAmount = Number(u.amount_paid) || 0;

          return {
            id: u.id,
            name: u.full_name || "New Student", // Assuming full_name exists, fallback to firstItem title
            courses: itemsArray,
            type: u.enrollment_type || "Course",
            mode: u.mode || "Offline",
            totalFee,
            paidAmount,
            assigned_batch: u.assigned_batch || "",
            assigned_mentor: u.assigned_mentor || "",
          };
        });

        setUsers(formatted);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBatchesAndMentors = async () => {
      try {
        const [batchesRes, mentorsRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/batches/'),
          fetch('http://127.0.0.1:8000/api/mentors/')
        ]);
        if (batchesRes.ok) setBatches(await batchesRes.json());
        if (mentorsRes.ok) setMentors(await mentorsRes.json());
      } catch (err) {
        console.error("Fetch Error for batches/mentors:", err);
      }
    };

    fetchUsers();
    fetchBatchesAndMentors();
  }, []);

  const handleAssign = async (userId, batchId, mentorId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/enrollments/${userId}/assign/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ batch_id: batchId, mentor_id: mentorId }),
      });
      if (response.ok) {
        setUsers(prev => prev.map(u => {
          if (u.id === userId) {
            const updatedUser = { ...u, assigned_batch: batchId, assigned_mentor: mentorId };
            if (activeAssignmentUser && activeAssignmentUser.id === userId) {
              setActiveAssignmentUser(updatedUser);
            }
            return updatedUser;
          }
          return u;
        }));
      } else {
        alert("Failed to assign batch/mentor.");
      }
    } catch (err) {
      console.error("Error assigning:", err);
      alert("Failed to assign batch/mentor.");
    }
  };

  const getMentorName = (batch) => {
    if (!batch) return 'Unassigned';
    if (batch.assigned_mentor_name) return batch.assigned_mentor_name;
    if (batch.assigned_mentor) {
      const m = mentors.find(m => String(m.id) === String(batch.assigned_mentor));
      return m ? m.name : 'Unassigned';
    }
    return 'Unassigned';
  };

  const totalReceived = users.reduce((a, b) => a + b.paidAmount, 0);
  const totalPending = users.reduce((a, b) => a + (b.totalFee - b.paidAmount), 0);

  const downloadReport = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7FE]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans text-slate-900 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print { 
          .print-hidden { display: none !important; } 
          .print-area { border: none !important; box-shadow: none !important; width: 100% !important; }
          body { background: white !important; }
        }
      `}} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-10 mt-10">

        {/* HEADER SECTION */}
<div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-6 print-hidden">
  <div className="flex items-center gap-4 w-full sm:w-auto">
    <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shrink-0">
      <ShieldCheck className="text-white" size={28} />
    </div>

    <div>
      <h1 className="text-3xl font-bold text-slate-800">
        TX <span className="text-blue-600">Hub</span>
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Student Management Dashboard
      </p>
    </div>
  </div>


</div>

        {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 print-hidden">
  {[
    {
      label: "Total Students",
      val: users.length,
      icon: <UsersIcon />,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Revenue",
      val: `₹${totalReceived.toLocaleString()}`,
      icon: <Wallet />,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    // {
    //   label: "Outstanding Balance",
    //   val: `₹${totalPending.toLocaleString()}`,
    //   icon: <Activity />,
    //   bg: "bg-amber-50",
    //   text: "text-amber-600",
    // },
  ].map((stat, i) => (
    <div
      key={i}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5"
    >
      <div
        className={`${stat.bg} p-4 rounded-2xl ${stat.text} shrink-0`}
      >
        {React.cloneElement(stat.icon, { size: 24 })}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500">
          {stat.label}
        </p>

        <h3 className="text-3xl font-bold text-slate-800 mt-1">
          {stat.val}
        </h3>
      </div>
    </div>
  ))}
</div>

        {/* DATA TABLE (DESKTOP) */}
        <div className="hidden lg:block bg-white rounded-[2.5rem] border border-blue-100 shadow-2xl shadow-blue-900/5 overflow-hidden print-area">
          <table className="w-full text-left">
<thead>
  <tr className="bg-slate-50 border-b border-slate-100">
    <th className="px-6 py-5 text-sm font-semibold text-slate-500">
      Student
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-slate-500">
      Enrolled Course
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-slate-500">
      Mentor & Batch
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-slate-500 text-center">
      Payment Status
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-slate-500 text-right">
      Payments
    </th>
  </tr>
</thead>
            <tbody className="divide-y divide-blue-50/50">
              {users.map((u) => {
                const balance = u.totalFee - u.paidAmount;
                const progress = u.totalFee > 0 ? (u.paidAmount / u.totalFee) * 100 : 0;

                return (
               <tr key={u.id} className="hover:bg-slate-50 transition-colors">
  {/* Student */}
  <td className="px-6 py-5">
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-base border border-blue-100">
        {u.name.charAt(0)}
      </div>

      <div>
        <p className="font-semibold text-slate-800 text-sm">
          {u.name}
        </p>

        <p className="text-xs text-slate-500">
          Student ID: {u.id}
        </p>
      </div>
    </div>
  </td>

  {/* Course */}
  <td className="px-6 py-5">
    <div className="flex flex-wrap gap-2">
      {u.courses.map((course, i) => (
        <div
          key={i}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100"
        >
          <Cpu size={12} />
          {course.title}
        </div>
      ))}
    </div>
  </td>

  {/* Mentor & Batch */}
  <td className="px-6 py-5">
    {(() => {
      const batchObj = batches.find(
        (b) => String(b.id) === String(u.assigned_batch)
      );

      const mentorObj = mentors.find(
        (m) => String(m.id) === String(u.assigned_mentor)
      );

      const hasAssignment =
        u.assigned_batch || u.assigned_mentor;

      return (
        <div className="flex flex-col gap-2 text-sm">
          <div>
            <span className="text-slate-500">
              Batch:
            </span>{" "}
            <span
              className={
                u.assigned_batch
                  ? "font-semibold text-blue-600"
                  : "text-slate-400 italic"
              }
            >
              {batchObj?.name || "Unassigned"}
            </span>
          </div>

          <div>
            <span className="text-slate-500">
              Mentor:
            </span>{" "}
            <span
              className={
                u.assigned_mentor
                  ? "font-semibold text-emerald-600"
                  : "text-slate-400 italic"
              }
            >
              {mentorObj?.name || "Unassigned"}
            </span>
          </div>

          <button
            onClick={() => setActiveAssignmentUser(u)}
            className={`mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
              hasAssignment
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600"
            }`}
          >
            {hasAssignment ? (
              <>
                <Eye size={14} />
                Manage Assignment
              </>
            ) : (
              <>
                <Edit2 size={14} />
                Assign Mentor
              </>
            )}
          </button>
        </div>
      );
    })()}
  </td>

  {/* Payment Status */}
  <td className="px-6 py-5">
    <div className="flex justify-center">
      <div className="relative w-11 h-11">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 36 36"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-slate-100"
            strokeWidth="4"
          />

          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className={
              balance <= 0
                ? "stroke-emerald-400"
                : "stroke-blue-500"
            }
            strokeWidth="4"
            strokeDasharray={`${progress}, 100`}
            strokeLinecap="round"
          />
        </svg>

        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-700">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  </td>

  {/* Payments */}
  <td className="px-6 py-5 text-right">
    <div className="flex items-center justify-end font-semibold text-slate-800 text-sm">
      <IndianRupee size={12} />
      {u.paidAmount.toLocaleString()}
    </div>

    <div
      className={`text-xs font-medium mt-1 ${
        balance > 0
          ? "text-amber-500"
          : "text-emerald-500"
      }`}
    >
      {balance > 0
        ? `Due: ₹${balance.toLocaleString()}`
        : "Paid in Full"}
    </div>
  </td>
</tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW (CARDS) */}
        <div className="grid grid-cols-1 gap-5 lg:hidden px-1 pb-10">
          {users.map((u) => {
            const balance = u.totalFee - u.paidAmount;
            const progress = u.totalFee > 0 ? (u.paidAmount / u.totalFee) * 100 : 0;
            return (
              <div key={u.id} className="bg-white rounded-[2.5rem] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-blue-50">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border border-blue-100">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-base leading-tight">{u.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {u.id}</p>
                    </div>
                  </div>
                  <div className="relative w-11 h-11">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4" />
                      <circle cx="18" cy="18" r="16" fill="none" className={balance <= 0 ? "stroke-emerald-400" : "stroke-blue-500"} strokeWidth="4" strokeDasharray={`${progress}, 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-700">{Math.round(progress)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Specialization</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                      <Cpu size={14} className="text-blue-400 shrink-0" />
                      <span className="truncate">{u.courses[0]?.title || "N/A"}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Assignment</p>
                    {(() => {
                      const batchObj = batches.find(b => String(b.id) === String(u.assigned_batch));
                      const mentorObj = mentors.find(m => String(m.id) === String(u.assigned_mentor));
                      const hasAssignment = u.assigned_batch || u.assigned_mentor;

                      return (
                        <div className="flex flex-col gap-1.5 text-xs text-slate-700">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-400">Batch:</span>
                            <span className={u.assigned_batch ? "font-black text-blue-600 truncate max-w-[120px]" : "font-medium text-slate-400 italic"}>
                              {batchObj?.name || 'Unassigned'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-400">Mentor:</span>
                            <span className={u.assigned_mentor ? "font-black text-emerald-600 truncate max-w-[120px]" : "font-medium text-slate-400 italic"}>
                              {mentorObj?.name || 'Unassigned'}
                            </span>
                          </div>
                          <button
                            onClick={() => setActiveAssignmentUser(u)}
                            className={`mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm ${
                              hasAssignment 
                                ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                                : 'bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-600'
                            }`}
                          >
                            {hasAssignment ? (
                              <>
                                <Eye size={12} /> View & Manage
                              </>
                            ) : (
                              <>
                                <Edit2 size={12} /> Assign Now
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-5 border-t border-dashed border-slate-100">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Paid Amount</p>
                    <div className="flex items-center font-black text-slate-800 text-lg">
                      <IndianRupee size={14} /> {u.paidAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border ${balance > 0 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {balance > 0 ? `Due: ₹${balance.toLocaleString()}` : 'Fully Paid'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL & EDIT MODAL */}
      {activeAssignmentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#F4F7FE] w-full max-w-3xl rounded-[2.5rem] shadow-2xl border border-blue-100 overflow-hidden transform scale-100 transition-all duration-300 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-600 p-6 text-white shrink-0">
              <button
                onClick={() => setActiveAssignmentUser(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl border border-white/20">
                  {activeAssignmentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">
                    Student Assignment Panel
                  </p>
                  <h3 className="text-xl font-black mt-0.5">
                    {activeAssignmentUser.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              {/* Student Course Specs */}
              <div className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm flex flex-col gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrolled Course / Specialization</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {activeAssignmentUser.courses.map((course, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-100"
                    >
                      <Cpu size={12} /> {course.title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Two-Column Form and details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* COLUMN 1: BATCH */}
                {(() => {
                  const batchObj = batches.find(b => String(b.id) === String(activeAssignmentUser.assigned_batch));
                  return (
                    <div className="bg-white p-5 rounded-3xl border border-blue-50 shadow-sm flex flex-col gap-4">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-3 bg-blue-600 rounded-full"></span>
                          Batch Assignment
                        </h4>
                        
                        <select
                          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                          value={activeAssignmentUser.assigned_batch}
                          onChange={(e) => handleAssign(activeAssignmentUser.id, e.target.value, activeAssignmentUser.assigned_mentor)}
                        >
                          <option value="">Select Batch...</option>
                          {batches.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.course || 'No Course'})
                            </option>
                          ))}
                        </select>
                      </div>

                      {batchObj ? (
                        <div className="space-y-4 pt-2 border-t border-slate-100 flex-1 flex flex-col">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Start Date</span>
                              <span className="text-xs font-bold text-slate-800 block mt-1">
                                {batchObj.startDate 
                                  ? new Date(batchObj.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                  : 'TBD'}
                              </span>
                            </div>
                            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                              <span className="inline-block text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-100">Active</span>
                            </div>
                          </div>

                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Assigned Mentor</span>
                            <span className="text-xs font-bold text-blue-600 block mt-1">
                              {getMentorName(batchObj)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Enrolled Students ({batchObj.students?.length || 0})</span>
                            {batchObj.students && batchObj.students.length > 0 ? (
                              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                {batchObj.students.map(student => (
                                  <div key={student.id} className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100/50 text-[11px] transition-colors">
                                    <span className="font-bold text-slate-800 truncate max-w-[100px]">{student.name}</span>
                                    <span className="text-[9px] text-slate-400 truncate max-w-[110px]">{student.email}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-400 italic bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 text-center">No students enrolled in this batch.</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200/50 rounded-2xl">
                          Select a batch from the dropdown above to view details.
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* COLUMN 2: MENTOR */}
                {(() => {
                  const mentorObj = mentors.find(m => String(m.id) === String(activeAssignmentUser.assigned_mentor));
                  return (
                    <div className="bg-white p-5 rounded-3xl border border-blue-50 shadow-sm flex flex-col gap-4">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-3 bg-emerald-600 rounded-full"></span>
                          Mentor Assignment
                        </h4>
                        
                        <select
                          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                          value={activeAssignmentUser.assigned_mentor}
                          onChange={(e) => handleAssign(activeAssignmentUser.id, activeAssignmentUser.assigned_batch, e.target.value)}
                        >
                          <option value="">Select Mentor...</option>
                          {mentors
                            .filter(m => m.is_active)
                            .map(m => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.assigned_course || 'All Courses'})
                              </option>
                            ))
                          }
                        </select>
                      </div>

                      {mentorObj ? (
                        <div className="space-y-4 pt-2 border-t border-slate-100 flex-1 flex flex-col">
                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Email Contact</span>
                            <span className="text-xs font-bold text-slate-800 block mt-1 break-all">{mentorObj.email || 'N/A'}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Course Scope</span>
                              <span className="text-xs font-bold text-slate-800 block mt-1 truncate" title={mentorObj.assigned_course || 'All Courses'}>{mentorObj.assigned_course || 'All Courses'}</span>
                            </div>
                            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                              <div>
                                <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded mt-1 border ${
                                  mentorObj.is_active 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                  {mentorObj.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Assigned Students ({mentorObj.students?.length || 0})</span>
                            {mentorObj.students && mentorObj.students.length > 0 ? (
                              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                {mentorObj.students.map(student => (
                                  <div key={student.id} className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100/50 text-[11px] transition-colors">
                                    <span className="font-bold text-slate-800 truncate max-w-[100px]">{student.name}</span>
                                    <span className="text-[9px] text-slate-400 truncate max-w-[110px]">{student.email}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-400 italic bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 text-center">No students assigned to this mentor.</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200/50 rounded-2xl">
                          Select a mentor from the dropdown above to view details.
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end shrink-0 border-t border-slate-100">
              <button
                onClick={() => setActiveAssignmentUser(null)}
                className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md"
              >
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
