import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, Info, Briefcase, Calendar } from "lucide-react";
import { fetchNotifications, markAsRead, clearAllNotifications } from "../redux/slices/notificationSlice";

const NotificationBell = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all notifications?")) {
            dispatch(clearAllNotifications() );
        }
    };

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) return; // Only fetch if user is logged in
        
        dispatch(fetchNotifications());
        // Refresh every 60 seconds
        const interval = setInterval(() => {
            dispatch(fetchNotifications());
        }, 60000);
        return () => clearInterval(interval);
    }, [dispatch, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkRead = (id) => {
        dispatch(markAsRead(id) );
    };

    const handleNotificationClick = (n) => {
        if (!n.read) handleMarkRead(n._id);
        setIsOpen(false);
        // Navigate based on notification type
        if (n.type === 'application' && n.job) {
            const jobId = typeof n.job === 'object' ? n.job._id : n.job;
            navigate(`/jobs/${jobId}/applicants`);
        } else if (n.type === 'interview') {
            navigate('/interviews');
        } else if (n.type === 'status_change' && n.job) {
            const jobId = typeof n.job === 'object' ? n.job._id : n.job;
            navigate(`/jobs/${jobId}`);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-2xl transition-all duration-300"
            >
                <Bell className="w-5.5 h-5.5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-rose-500 dark:bg-rose-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-in zoom-in duration-300">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[1100] animate-in slide-in-from-top-4 duration-300 transition-colors">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest transition-colors">Alert Center</h3>
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full transition-colors">{unreadCount} Unread</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <Bell className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-3 transition-colors" />
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-600 transition-colors">All caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
                                {notifications.map((n) => (
                                    <div 
                                        key={n._id} 
                                        onClick={() => handleNotificationClick(n)}
                                        className={`p-5 flex gap-4 cursor-pointer transition-colors ${!n.read ? "bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50/60 dark:hover:bg-blue-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                            n.type === 'application' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                                            n.type === 'status_change' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                                            n.type === 'interview' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' :
                                            'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}>
                                            {n.type === 'application' ? <Briefcase className="w-5 h-5" /> :
                                             n.type === 'status_change' ? <CheckCircle className="w-5 h-5" /> :
                                             n.type === 'interview' ? <Calendar className="w-5 h-5" /> :
                                             <Info className="w-5 h-5" /> }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-relaxed transition-colors ${!n.read ? "font-black text-slate-900 dark:text-white" : "font-medium text-slate-600 dark:text-slate-400"}`}>
                                                {n.content}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-tighter transition-colors">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </p>
                                            {(n.type === 'application' || n.type === 'interview') && (
                                                <span className="text-[10px] text-indigo-500 font-bold mt-0.5 block">
                                                    {n.type === 'application' ? '→ View Applicants' : '→ View Interviews'}
                                                </span>
                                            )}
                                        </div>
                                        {!n.read && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center transition-colors">
                            <button 
                                onClick={handleClearAll}
                                className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                Clear All Notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
