import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, Info, Briefcase, Calendar } from "lucide-react";
import { fetchNotifications, markAsRead, clearAllNotifications } from "../redux/slices/notificationSlice";

const NotificationBell = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, unreadCount } = useSelector((state: any) => state.notifications);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all notifications?")) {
            dispatch(clearAllNotifications() as any);
        }
    };

    useEffect(() => {
        dispatch(fetchNotifications() as any);
        // Refresh every 60 seconds
        const interval = setInterval(() => {
            dispatch(fetchNotifications() as any);
        }, 5000);
        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkRead = (id: string) => {
        dispatch(markAsRead(id) as any);
    };

    const handleNotificationClick = (n: any) => {
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
                className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-300"
            >
                <Bell className="w-5.5 h-5.5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden z-[1100] animate-in slide-in-from-top-4 duration-300">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Alert Center</h3>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{unreadCount} Unread</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-xs font-bold text-slate-400">All caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((n: any) => (
                                    <div 
                                        key={n._id} 
                                        onClick={() => handleNotificationClick(n)}
                                        className={`p-5 flex gap-4 cursor-pointer transition-colors ${!n.read ? "bg-blue-50/30 hover:bg-blue-50/60" : "hover:bg-slate-50"}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                            n.type === 'application' ? 'bg-emerald-50 text-emerald-600' :
                                            n.type === 'status_change' ? 'bg-blue-50 text-blue-600' :
                                            n.type === 'interview' ? 'bg-indigo-50 text-indigo-600' :
                                            'bg-slate-50 text-slate-600'
                                        }`}>
                                            {n.type === 'application' ? <Briefcase className="w-5 h-5" /> :
                                             n.type === 'status_change' ? <CheckCircle className="w-5 h-5" /> :
                                             n.type === 'interview' ? <Calendar className="w-5 h-5" /> :
                                             <Info className="w-5 h-5" /> }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-relaxed ${!n.read ? "font-black text-slate-900" : "font-medium text-slate-600"}`}>
                                                {n.content}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
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
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <button 
                                onClick={handleClearAll}
                                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors"
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
