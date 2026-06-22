import React, { useEffect, useState } from "react";
import { MessageSquare, Mail, Phone, Calendar, User, Search, RefreshCw, BookOpen } from "lucide-react";

const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/contact/");
      const data = await response.json();

      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) =>
    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <MessageSquare className="text-blue-600" size={28} />
            Message Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage and respond to student inquiries and contact requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full md:w-64 transition-all"
            />
          </div>
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      {loading && messages.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <MessageSquare size={32} className="text-blue-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No messages found</h3>
          <p className="text-slate-500">
            {searchTerm ? "No messages match your search criteria." : "You don't have any contact messages yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col group relative overflow-hidden"
            >
              {/* Top Banner Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* User Info Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-black text-lg shadow-inner">
                    {msg.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">{msg.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-0.5">
                      <Calendar size={12} />
                      {new Date(msg.created_at).toLocaleDateString(undefined, { 
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-2.5 mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <a href={`mailto:${msg.email}`} className="hover:text-blue-600 transition-colors truncate">
                    {msg.email}
                  </a>
                </div>
                {msg.phone && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <a href={`tel:${msg.phone}`} className="hover:text-blue-600 transition-colors">
                      {msg.phone}
                    </a>
                  </div>
                )}
                {msg.course && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <BookOpen size={16} className="text-blue-400" />
                    <span className="font-semibold text-blue-700 bg-blue-100/50 px-2 py-0.5 rounded-lg truncate">
                      {msg.course}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="flex-1">
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                  {msg.message}
                </p>
              </div>
              
              {/* Bottom fade for clamped text */}
              <div className="absolute bottom-6 left-6 right-6 h-8 bg-gradient-to-t from-white to-transparent group-hover:opacity-0 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagePage;