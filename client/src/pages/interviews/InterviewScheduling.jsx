import { useState, useEffect } from "react";
import { Calendar, Video, Phone, MapPin, Clock, Loader2, Link, FileText } from "lucide-react";
import api from "../../services/api";
import { useSelector } from "react-redux";

const modeIcon = {
    video: <Video className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
    "in-person": <MapPin className="w-4 h-4" />
};

const statusConfig = {
    scheduled:    { label: "Scheduled",    color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100" },
    completed:    { label: "Completed",    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    cancelled:    { label: "Cancelled",    color: "text-rose-500",    bg: "bg-rose-50",    border: "border-rose-100"   },
    rescheduled:  { label: "Rescheduled", color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100"  } };

const InterviewScheduling = () => {
    const { user } = useSelector((state) => state.auth);
    const isRecruiter = user?.role === "recruiter";

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Schedule form state (recruiters only)
    const [showForm, setShowForm] = useState(false);
    const [applications, setApplications] = useState([]);
    const [form, setForm] = useState({ applicationId: "", scheduledAt: "", mode: "video", meetingLink: "", notes: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchInterviews();
        if (isRecruiter) fetchApplications();
    }, []);

    const fetchInterviews = async () => {
        try {
            const endpoint = isRecruiter ? "/interviews/my-scheduled" : "/interviews/my-interviews";
            const res = await api.get(endpoint);
            setInterviews(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await api.get("/applications/recruiter");
            setApplications(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitMsg({ type: "", text: "" });
        try {
            await api.post("/interviews", form);
            setSubmitMsg({ type: "success", text: "Interview scheduled! The applicant has been notified." });
            setShowForm(false);
            setForm({ applicationId: "", scheduledAt: "", mode: "video", meetingLink: "", notes: "" });
            fetchInterviews();
        } catch (err) {
            setSubmitMsg({ type: "error", text: err.response?.data?.message || "Failed to schedule." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/interviews/${id}`, { status });
            setInterviews(prev => prev.map(i => i._id === id ? { ...i, status } : i));
        } catch (err) { console.error(err); }
    };

    const topBrandLogos = {
        "Google": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png",
        "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        "Spotify": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg",
        "SpaceX": "https://upload.wikimedia.org/wikipedia/commons/3/36/SpaceX-Logo.svg" };

    return (
        <div className="min-h-screen bg-[#F8F7F2] pb-20">
            {/* Header */}
            <div className="bg-[#0F172A] border-b border-slate-800 mb-6 md:mb-10">
                <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-4 md:mb-6">
                                <Calendar className="w-3.5 h-3.5" /> Interview Hub
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                                {isRecruiter ? "Scheduled Interviews" : "My Interviews"}
                            </h1>
                            <p className="text-slate-400 font-medium text-sm md:text-base">
                                {isRecruiter ? "Manage all your interview sessions with applicants." : "Track your upcoming and past interview invitations."}
                            </p>
                        </div>
                        {isRecruiter && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="flex items-center gap-2 px-5 md:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/30 text-sm shrink-0"
                            >
                                <Calendar className="w-4 h-4" />
                                {showForm ? "Cancel" : "Schedule Interview"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {/* Schedule Form */}
                {showForm && isRecruiter && (
                    <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 mb-10 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" /> Schedule New Interview
                        </h2>
                        <form onSubmit={handleSchedule} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Applicant</label>
                                <select
                                    required
                                    value={form.applicationId}
                                    onChange={e => setForm({ ...form, applicationId: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500/30 transition-all"
                                >
                                    <option value="">Choose an application...</option>
                                    {applications.map((a) => (
                                        <option key={a._id} value={a._id}>
                                            {a.applicant?.name || "Applicant"} — {a.job?.title || "Position"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={form.scheduledAt}
                                    onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Interview Mode</label>
                                <select
                                    value={form.mode}
                                    onChange={e => setForm({ ...form, mode: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500/30"
                                >
                                    <option value="video">Video Call</option>
                                    <option value="phone">Phone Call</option>
                                    <option value="in-person">In-Person</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Meeting Link (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://meet.google.com/..."
                                    value={form.meetingLink}
                                    onChange={e => setForm({ ...form, meetingLink: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500/30"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notes for Applicant</label>
                                <textarea
                                    rows={3}
                                    placeholder="Topics to cover, what to prepare, dress code..."
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500/30 resize-none"
                                />
                            </div>
                            <div className="md:col-span-2 flex items-center gap-4">
                                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-lg">
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                                    Confirm & Notify Applicant
                                </button>
                                {submitMsg.text && (
                                    <span className={`text-sm font-bold ${submitMsg.type === "success" ? "text-emerald-600" : "text-rose-500"}`}>
                                        {submitMsg.text}
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* Interview List */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
                ) : interviews.length === 0 ? (
                    <div className="bg-white rounded-[32px] border border-slate-100 p-20 text-center shadow-sm">
                        <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No Interviews Yet</h2>
                        <p className="text-slate-500 font-medium">
                            {isRecruiter ? "Schedule your first interview by clicking the button above." : "You haven't been invited to any interviews yet. Keep applying!"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {interviews.map((interview) => {
                            const status = statusConfig[interview.status] || statusConfig.scheduled;
                            const logoUrl = topBrandLogos[interview.job?.company] || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

                            return (
                                <div key={interview._id} className="bg-white rounded-[28px] border border-slate-200/60 p-6 hover:border-blue-500/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shrink-0 overflow-hidden p-2 shadow-sm group-hover:scale-105 transition-transform">
                                                <img src={logoUrl} alt={interview.job?.company} className="w-full h-full object-contain"
                                                    onError={(e) => { (e.target).src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 mb-1">{interview.job?.title || "Position"}</h3>
                                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-2">{interview.job?.company}</p>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                        {new Date(interview.scheduledAt).toLocaleString()}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {modeIcon[interview.mode]} {interview.mode}
                                                    </span>
                                                    {isRecruiter && (
                                                        <span className="text-[10px] font-bold text-slate-500">
                                                            👤 {interview.applicant?.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={`px-3 py-1.5 ${status.bg} ${status.border} border rounded-xl text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                                                {status.label}
                                            </span>
                                            {interview.meetingLink && (
                                                <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                                    <Link className="w-3.5 h-3.5" /> Join
                                                </a>
                                            )}
                                            {isRecruiter && interview.status === "scheduled" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(interview._id, "completed")}
                                                    className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all"
                                                >
                                                    Mark Done
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {interview.notes && (
                                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-start gap-2">
                                            <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-xs font-medium text-slate-500 italic">{interview.notes}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewScheduling;
