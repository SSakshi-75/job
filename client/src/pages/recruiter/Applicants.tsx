import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Loader2, User, Mail, Calendar, ArrowLeft, CheckCircle2,
    XCircle, FileText, ExternalLink, Clock,
    Briefcase, CalendarClock, Users, ChevronDown
} from "lucide-react";
import api from "../../services/api";

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    pending:   { label: "Pending",   bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
    reviewed:  { label: "Reviewed",  bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"  },
    accepted:  { label: "Accepted",  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200"},
    rejected:  { label: "Rejected",  bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200"  },
    shortlisted:{ label: "Shortlisted",bg:"bg-violet-50", text: "text-violet-700",  border: "border-violet-200"},
};

const Applicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState<any[]>([]);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [jobRes, appRes] = await Promise.all([
                    api.get(`/jobs/${jobId}`),
                    api.get(`/applications/job/${jobId}`)
                ]);
                setJobTitle(jobRes.data.data?.title || "Job");
                setApplicants(appRes.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [jobId]);

    const handleStatusChange = async (appId: string, status: string) => {
        setUpdatingId(appId);
        try {
            await api.put(`/applications/${appId}/status`, { status });
            setApplicants(prev =>
                prev.map(a => a._id === appId ? { ...a, status } : a)
            );
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = filterStatus === "all"
        ? applicants
        : applicants.filter(a => a.status === filterStatus);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Loading Applicants...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Back */}
            <button
                onClick={() => navigate("/my-jobs")}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-6 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to My Jobs
            </button>

            {/* Header */}
            <div className="bg-white rounded-3xl border border-slate-200/70 p-6 md:p-8 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[3px] mb-1 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" /> Job Posting
                        </p>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{jobTitle}</h1>
                        <p className="text-slate-400 font-medium mt-1 text-sm">
                            {applicants.length} total applicant{applicants.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3">
                        {["pending", "accepted", "rejected"].map(s => {
                            const count = applicants.filter(a => a.status === s).length;
                            const cfg = statusConfig[s];
                            return (
                                <div key={s} className={`px-4 py-2.5 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                                    <div className={`text-lg font-black ${cfg.text}`}>{count}</div>
                                    <div className={`text-[10px] font-bold uppercase tracking-wider ${cfg.text} opacity-70`}>{cfg.label}</div>
                                </div>
                            );
                        })}
                        <div className="px-4 py-2.5 rounded-2xl border bg-slate-50 border-slate-200">
                            <div className="text-lg font-black text-slate-700">{applicants.length}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</div>
                        </div>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100">
                    {["all", "pending", "reviewed", "shortlisted", "accepted", "rejected"].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                                filterStatus === s
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {s === "all" ? `All (${applicants.length})` : `${s} (${applicants.filter(a => a.status === s).length})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applicant List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
                    <Users className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-slate-900 mb-2">No Applicants Found</h3>
                    <p className="text-slate-400 font-medium">
                        {filterStatus === "all" ? "No one has applied to this job yet." : `No ${filterStatus} applications.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((app: any) => {
                        const cfg = statusConfig[app.status] || statusConfig.pending;
                        const isExpanded = expandedId === app._id;
                        const isUpdating = updatingId === app._id;
                        const profile = app.applicant || {};

                        return (
                            <div
                                key={app._id}
                                className="bg-white rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-md hover:border-indigo-200/60 transition-all duration-300"
                            >
                                {/* Main Row */}
                                <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md shadow-indigo-500/20 overflow-hidden">
                                            {profile.profilePicture ? (
                                                <img src={`http://localhost:5000${profile.profilePicture}`} alt={profile.name} className="w-full h-full object-cover" />
                                            ) : (
                                                profile.name?.[0]?.toUpperCase() || "?"
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-base">
                                                {app.applicant?.name || "Unknown Applicant"}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-3 mt-0.5">
                                                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {app.applicant?.email}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Status + Actions */}
                                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                                        {/* Status Badge */}
                                        <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                            {cfg.label}
                                        </span>

                                        {/* View Resume */}
                                        {profile.resume && (
                                            <a
                                                href={`http://localhost:5000${profile.resume}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-xl text-[11px] font-bold transition-colors"
                                            >
                                                <FileText className="w-3.5 h-3.5" /> Resume
                                            </a>
                                        )}


                                        {/* Schedule Interview */}
                                        <Link
                                            to={`/interviews`}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold transition-colors border border-indigo-100"
                                        >
                                            <CalendarClock className="w-3.5 h-3.5" /> Interview
                                        </Link>

                                        {/* Expand/Collapse */}
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[11px] font-bold transition-colors"
                                        >
                                            {isExpanded ? "Less" : "More"}
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded: Profile Details + Status Action Buttons */}
                                {isExpanded && (
                                    <div className="px-5 md:px-6 pb-6 border-t border-slate-100">
                                        <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Profile Info */}
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant Profile</p>
                                                {profile.bio && (
                                                    <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl">
                                                        "{profile.bio}"
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.skills?.length > 0 && profile.skills.map((skill: string, i: number) => (
                                                        <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {(!profile.skills || profile.skills.length === 0) && (
                                                        <span className="text-xs text-slate-400 italic">No skills listed</span>
                                                    )}
                                                </div>
                                                {profile.experience && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                                        Experience: {profile.experience}
                                                    </div>
                                                )}
                                                {profile.portfolio && (
                                                    <a
                                                        href={profile.portfolio}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:underline"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" /> View Portfolio
                                                    </a>
                                                )}
                                                {!profile.bio && !profile.experience && !profile.portfolio && (
                                                    <p className="text-xs text-slate-400 italic">Applicant has not filled profile details yet.</p>
                                                )}
                                            </div>

                                            {/* Status Actions */}
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Status</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(app._id, "shortlisted")}
                                                        disabled={isUpdating || app.status === "shortlisted"}
                                                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold rounded-xl hover:bg-violet-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <User className="w-3.5 h-3.5" />}
                                                        Shortlist
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app._id, "reviewed")}
                                                        disabled={isUpdating || app.status === "reviewed"}
                                                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                                                        Mark Reviewed
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app._id, "accepted")}
                                                        disabled={isUpdating || app.status === "accepted"}
                                                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app._id, "rejected")}
                                                        disabled={isUpdating || app.status === "rejected"}
                                                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                                        Reject
                                                    </button>
                                                </div>
                                                <Link
                                                    to={`/interviews`}
                                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20"
                                                >
                                                    <CalendarClock className="w-3.5 h-3.5" />
                                                    Schedule Interview
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Applicants;
