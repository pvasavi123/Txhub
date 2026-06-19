import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Activity, AlertCircle } from 'lucide-react';
import api from '../api/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/trainer/login/', { email, password });
      if (response.data.type === 'admin') {
        localStorage.setItem('user', JSON.stringify({ ...response.data.data, isAdmin: true, email }));
        navigate('/admin');
      } else if (response.data.access) {
        localStorage.setItem('trainer_access_token', response.data.access);
        localStorage.setItem('trainer_data', JSON.stringify(response.data.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Trainer Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to manage your students and courses
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100"
        >
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-slate-50 border"
                  placeholder="Trainer Mail ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-slate-50 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
