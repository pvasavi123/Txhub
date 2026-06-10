import React, { useContext } from 'react';
import { User } from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <User className="text-indigo-600" />
          My Profile
        </h1>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.name || 'Student Name'}</h2>
            <p className="text-slate-500">{user?.email || 'student@example.com'}</p>
            <div className="mt-4 flex gap-3">
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider">Active Student</span>
            </div>
          </div>
        </div>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Personal Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Full Name</label>
                <div className="p-3 bg-slate-50 rounded-lg text-slate-800 font-medium">{user?.name || 'Student Name'}</div>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Email Address</label>
                <div className="p-3 bg-slate-50 rounded-lg text-slate-800 font-medium">{user?.email || 'student@example.com'}</div>
              </div>
              {user?.college && (
                <div>
                  <label className="block text-sm text-slate-500 mb-1">College / University</label>
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-800 font-medium">{user.college}</div>
                </div>
              )}
              {user?.branch && (
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Branch</label>
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-800 font-medium">{user.branch}</div>
                </div>
              )}
              {user?.degree && (
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Degree</label>
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-800 font-medium">{user.degree}</div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Account Settings</h3>
            <button className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 transition-colors w-full text-left">
              Change Password
            </button>
            <button className="mt-3 px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 transition-colors w-full text-left">
              Notification Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
