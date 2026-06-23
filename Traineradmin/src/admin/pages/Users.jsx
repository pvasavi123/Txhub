import React, { useState, useEffect } from 'react';
import {
  Download, IndianRupee, ShieldCheck, Users as UsersIcon,
  Wallet, Activity, Cpu, Globe, Eye, Edit2, Check, X, Layers, User
} from 'lucide-react';

import { useAdmin } from '../context/AdminContext';

const getAssignmentStatus = (courses) => {
  if (!courses || courses.length === 0) {
    return {
      status: 'Not Assigned',
      text: 'No Courses Enrolled',
      style: 'bg-rose-50 text-rose-600 border-rose-100'
    };
  }

  let fullyAssignedCount = 0;
  let hasAnyAssignment = false;

  courses.forEach(c => {
    const hasBatch = !!c.assigned_batch;
    const hasMentor = !!c.assigned_mentor;
    if (hasBatch && hasMentor) {
      fullyAssignedCount++;
    }
    if (hasBatch || hasMentor) {
      hasAnyAssignment = true;
    }
  });

  const total = courses.length;

  if (fullyAssignedCount === total) {
    return {
      status: 'Assigned',
      text: `✓ ${total} Course Assignment${total > 1 ? 's' : ''}`,
      style: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
  } else if (fullyAssignedCount > 0 || hasAnyAssignment) {
    return {
      status: 'Partially Assigned',
      text: `⚠ ${fullyAssignedCount}/${total} Courses Assigned`,
      style: 'bg-amber-50 text-amber-600 border-amber-100'
    };
  } else {
    return {
      status: 'Not Assigned',
      text: `⚠ 0/${total} Courses Assigned`,
      style: 'bg-rose-50 text-rose-600 border-rose-100'
    };
  }
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAssignmentUser, setActiveAssignmentUser] = useState(null);
  
  // Redesigned panel states
  const [activeCourseEnrollmentId, setActiveCourseEnrollmentId] = useState(null);
  const [localCourses, setLocalCourses] = useState([]);
  const [batchSearch, setBatchSearch] = useState('');
  const [mentorSearch, setMentorSearch] = useState('');
  const [savingAssignment, setSavingAssignment] = useState(false);

  const { markAsSeen } = useAdmin();

  useEffect(() => {
    if (activeAssignmentUser) {
      setLocalCourses(activeAssignmentUser.courses || []);
      setActiveCourseEnrollmentId(activeAssignmentUser.courses?.[0]?.enrollmentId || null);
      setBatchSearch('');
      setMentorSearch('');
    } else {
      setLocalCourses([]);
      setActiveCourseEnrollmentId(null);
    }
  }, [activeAssignmentUser]);

  useEffect(() => {
    markAsSeen();
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/enrollments/');
        const result = await response.json();
        const dataArray = Array.isArray(result) ? result : result.data;

        const grouped = {};

        (dataArray || []).forEach(u => {
          const emailKey = (u.email || '').toLowerCase().trim() || `no-email-${u.id}`;
          
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

          const courseDetail = {
            enrollmentId: u.id,
            title: u.title || (itemsArray[0]?.title) || "Unknown Course",
            assigned_batch: u.assigned_batch || "",
            assigned_mentor: u.assigned_mentor || "",
          };

          if (!grouped[emailKey]) {
            grouped[emailKey] = {
              id: u.user || u.id, // UserRegister ID, fallback to enrollment ID
              enrollmentIds: [u.id],
              name: u.full_name || "New Student",
              email: u.email || "",
              courses: [courseDetail],
              type: u.enrollment_type || "Course",
              mode: u.mode || "Offline",
              totalFee,
              paidAmount,
            };
          } else {
            grouped[emailKey].totalFee += totalFee;
            grouped[emailKey].paidAmount += paidAmount;
            grouped[emailKey].enrollmentIds.push(u.id);
            
            // Avoid duplicate courses on the same student record
            const exists = grouped[emailKey].courses.some(c => c.title.toLowerCase().trim() === courseDetail.title.toLowerCase().trim());
            if (!exists) {
              grouped[emailKey].courses.push(courseDetail);
            }
          }
        });

        setUsers(Object.values(grouped));
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

  const handleSaveAssignment = async () => {
    if (!activeCourseEnrollmentId) return;
    const activeCourse = localCourses.find(c => c.enrollmentId === activeCourseEnrollmentId);
    if (!activeCourse) return;

    setSavingAssignment(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/enrollments/${activeCourseEnrollmentId}/assign/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batch_id: activeCourse.assigned_batch || "",
          mentor_id: activeCourse.assigned_mentor || "",
        }),
      });
      if (response.ok) {
        // Sync with the parent users list state
        setUsers(prev => prev.map(u => {
          if (u.id === activeAssignmentUser.id) {
            const updatedCourses = u.courses.map(c => {
              if (c.enrollmentId === activeCourseEnrollmentId) {
                return {
                  ...c,
                  assigned_batch: activeCourse.assigned_batch,
                  assigned_mentor: activeCourse.assigned_mentor,
                };
              }
              return c;
            });
            return { ...u, courses: updatedCourses };
          }
          return u;
        }));
        alert("Assignment saved successfully! ✅");
      } else {
        alert("Failed to save assignment.");
      }
    } catch (err) {
      console.error("Error assigning:", err);
      alert("Failed to save assignment.");
    } finally {
      setSavingAssignment(false);
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

  <td className="px-6 py-5">
    {(() => {
      const assignment = getAssignmentStatus(u.courses);
      return (
        <div className="flex flex-col gap-2">
          <div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${assignment.style}`}>
              {assignment.status}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
            {assignment.text}
          </span>

          <button
            onClick={() => setActiveAssignmentUser(u)}
            className="mt-2 w-max flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 transition-all active:scale-95 shadow-sm"
          >
            <Edit2 size={12} />
            Manage Assignment
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
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100/50 col-span-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Assignment</p>
                    {(() => {
                      const assignment = getAssignmentStatus(u.courses);
                      return (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${assignment.style}`}>
                              {assignment.status}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 leading-tight">
                              {assignment.text}
                            </span>
                          </div>

                          <button
                            onClick={() => setActiveAssignmentUser(u)}
                            className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 transition-all active:scale-95 shadow-sm"
                          >
                            <Edit2 size={12} />
                            Manage Assignment
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
      {activeAssignmentUser && activeCourseEnrollmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300 flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {activeAssignmentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Student Assignment Panel
                  </p>
                  <h3 className="text-xl font-bold text-slate-800">
                    {activeAssignmentUser.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID: {activeAssignmentUser.id} &bull; {activeAssignmentUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveAssignmentUser(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              {/* 1. COURSE SELECTION SECTION */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Enrolled Courses (Select one to manage)</span>
                <div className="flex flex-wrap gap-2.5">
                  {localCourses.map((c) => {
                    const isActive = c.enrollmentId === activeCourseEnrollmentId;
                    return (
                      <button
                        key={c.enrollmentId}
                        onClick={() => {
                          setActiveCourseEnrollmentId(c.enrollmentId);
                          setBatchSearch('');
                          setMentorSearch('');
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-2 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 border border-transparent translate-y-[-1px]"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Cpu size={14} className={isActive ? "text-white" : "text-slate-400"} />
                        {c.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. SELECTED COURSE DETAILS */}
              {(() => {
                const activeCourse = localCourses.find(c => c.enrollmentId === activeCourseEnrollmentId) || {};
                const activeBatchObj = batches.find(b => String(b.id) === String(activeCourse.assigned_batch));
                const activeMentorObj = mentors.find(m => String(m.id) === String(activeCourse.assigned_mentor));

                const handleLocalBatchChange = (newBatchId) => {
                  setLocalCourses(prev => prev.map(c => {
                    if (c.enrollmentId === activeCourseEnrollmentId) {
                      return { ...c, assigned_batch: newBatchId };
                    }
                    return c;
                  }));
                };

                const handleLocalMentorChange = (newMentorId) => {
                  setLocalCourses(prev => prev.map(c => {
                    if (c.enrollmentId === activeCourseEnrollmentId) {
                      return { ...c, assigned_mentor: newMentorId };
                    }
                    return c;
                  }));
                };

                return (
                  <>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Selected Course</span>
                        <h4 className="text-base font-bold text-slate-800 mt-0.5">{activeCourse.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold">
                          <span className="text-slate-400">Batch:</span>
                          {activeCourse.assigned_batch ? (
                            <span className="text-blue-600 font-bold">Assigned</span>
                          ) : (
                            <span className="text-slate-400 italic">Not Assigned</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold">
                          <span className="text-slate-400">Mentor:</span>
                          {activeCourse.assigned_mentor ? (
                            <span className="text-emerald-600 font-bold">Assigned</span>
                          ) : (
                            <span className="text-slate-400 italic">Not Assigned</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 3. ASSIGNMENT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* LEFT CARD: BATCH */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span>
                            Batch Assignment
                          </h4>
                          
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Search batches..."
                              value={batchSearch}
                              onChange={(e) => setBatchSearch(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium transition-all"
                            />
                            <select
                              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium bg-white"
                              value={activeCourse.assigned_batch || ""}
                              onChange={(e) => handleLocalBatchChange(e.target.value)}
                            >
                              <option value="">Select Batch...</option>
                              {batches
                                .filter(b => b.name.toLowerCase().includes(batchSearch.toLowerCase()) || (b.course && b.course.toLowerCase().includes(batchSearch.toLowerCase())))
                                .map(b => (
                                  <option key={b.id} value={b.id}>
                                    {b.name} ({b.course || 'No Course'})
                                  </option>
                                ))
                              }
                            </select>
                          </div>
                        </div>

                        {activeBatchObj ? (
                          <div className="space-y-4 pt-3 border-t border-slate-100 flex-1 flex flex-col">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Start Date</span>
                                <span className="text-xs font-bold text-slate-800 block mt-1">
                                  {activeBatchObj.startDate 
                                    ? new Date(activeBatchObj.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'TBD'}
                                </span>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                                <span className="inline-block text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-100">Active</span>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Batch Mentor</span>
                              <span className="text-xs font-bold text-blue-600 block mt-1">
                                {getMentorName(activeBatchObj)}
                              </span>
                            </div>

                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Enrolled Students ({activeBatchObj.students?.length || 0})</span>
                              {activeBatchObj.students && activeBatchObj.students.length > 0 ? (
                                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                  {activeBatchObj.students.map(student => (
                                    <div key={student.id} className="flex justify-between items-center bg-slate-50 hover:bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-100/50 text-[11px] transition-colors">
                                      <span className="font-bold text-slate-800 truncate max-w-[120px]">{student.name}</span>
                                      <span className="text-[9px] text-slate-400 truncate max-w-[120px]">{student.email}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 text-center">No students enrolled in this batch.</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200/50 rounded-2xl flex-1 flex flex-col justify-center items-center">
                            <Layers size={32} className="text-slate-300 mb-2" />
                            <p className="text-xs font-semibold text-slate-500">No Batch Selected</p>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">Choose a batch from the dropdown above to assign.</p>
                          </div>
                        )}
                      </div>

                      {/* RIGHT CARD: MENTOR */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-3.5 bg-emerald-600 rounded-full"></span>
                            Mentor Assignment
                          </h4>
                          
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Search mentors..."
                              value={mentorSearch}
                              onChange={(e) => setMentorSearch(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium transition-all"
                            />
                            <select
                              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium bg-white"
                              value={activeCourse.assigned_mentor || ""}
                              onChange={(e) => handleLocalMentorChange(e.target.value)}
                            >
                              <option value="">Select Mentor...</option>
                              {mentors
                                .filter(m => m.is_active && (m.name.toLowerCase().includes(mentorSearch.toLowerCase()) || (m.assigned_course && m.assigned_course.toLowerCase().includes(mentorSearch.toLowerCase()))))
                                .map(m => (
                                  <option key={m.id} value={m.id}>
                                    {m.name} ({m.assigned_course || 'All Courses'})
                                  </option>
                                ))
                              }
                            </select>
                          </div>
                        </div>

                        {activeMentorObj ? (
                          <div className="space-y-4 pt-3 border-t border-slate-100 flex-1 flex flex-col">
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">
                                {activeMentorObj.name.charAt(0)}
                              </div>
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans">Assigned Mentor Profile</span>
                                <span className="text-xs font-bold text-slate-800 block mt-0.5">{activeMentorObj.name}</span>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Email Contact</span>
                              <span className="text-xs font-bold text-slate-800 block mt-1 break-all">{activeMentorObj.email || 'N/A'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Course Scope</span>
                                <span className="text-xs font-bold text-slate-800 block mt-1 truncate" title={activeMentorObj.assigned_course || 'All Courses'}>{activeMentorObj.assigned_course || 'All Courses'}</span>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans">Active Students</span>
                                <span className="text-xs font-bold text-slate-800 block mt-1">{activeMentorObj.students?.length || 0} Assigned</span>
                              </div>
                            </div>

                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-sans">Assigned Students ({activeMentorObj.students?.length || 0})</span>
                              {activeMentorObj.students && activeMentorObj.students.length > 0 ? (
                                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                  {activeMentorObj.students.map(student => (
                                    <div key={student.id} className="flex justify-between items-center bg-slate-50 hover:bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-100/50 text-[11px] transition-colors">
                                      <span className="font-bold text-slate-800 truncate max-w-[120px]">{student.name}</span>
                                      <span className="text-[9px] text-slate-400 truncate max-w-[120px]">{student.email}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 text-center">No students assigned to this mentor.</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200/50 rounded-2xl flex-1 flex flex-col justify-center items-center">
                            <User size={32} className="text-slate-300 mb-2" />
                            <p className="text-xs font-semibold text-slate-500">No Mentor Selected</p>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">Choose a mentor from the dropdown above to assign.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </>
                );
              })()}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-between items-center shrink-0 border-t border-slate-100">
              <button
                onClick={() => setActiveAssignmentUser(null)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Cancel
              </button>
              
              <div className="flex gap-2.5">
                <button
                  onClick={handleSaveAssignment}
                  disabled={savingAssignment}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-indigo-500/10 disabled:opacity-50"
                >
                  {savingAssignment ? "Saving..." : "Save Assignment"}
                </button>
                <button
                  onClick={() => setActiveAssignmentUser(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-500/10"
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
