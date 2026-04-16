import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";
import { Loader2, Briefcase, MapPin, Clock, CheckCircle2, XCircle, Eye, AlertCircle, ArrowRight, Search } from "lucide-react";

const topBrandLogos: any = {
    "Google": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png",
    "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    "Tesla": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    "Netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    "Spotify": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg",
    "Sportify": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg",
    "SpaceX": "https://upload.wikimedia.org/wikipedia/commons/3/36/SpaceX-Logo.svg",
    "Cloud Solutions": "https://cdn-icons-png.flaticon.com/512/5968/5968267.png",
    "Creative Studio": "https://cdn-icons-png.flaticon.com/512/3659/3659030.png",
    "StartUp Inc": "https://cdn-icons-png.flaticon.com/512/261/261768.png"
};

const statusConfig: any = {
    pending:  { label: "Pending Review",  icon: AlertCircle,    bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100" },
    reviewed: { label: "Under Review",    icon: Eye,            bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100"  },
    accepted: { label: "Accepted! 🎉",    icon: CheckCircle2,   bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100"},
    rejected: { label: "Not Selected",    icon: XCircle,        bg: "bg-rose-50",    text: "text-rose-500",    border: "border-rose-100"  },
};

const AppliedJobs = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await getMyApplications();
                setApplications(res.data || []);
            } catch (error) {
                console.error("Failed to load applications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === "pending").length,
        reviewed: applications.filter(a => a.status === "reviewed").length,
        accepted: applications.filter(a => a.status === "accepted").length,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F7F2] pb-20">
            {/* Header */}
            <div className="bg-[#0F172A] border-b border-slate-800 mb-6 md:mb-10">
                <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-4 md:mb-6">
                        <Briefcase className="w-3.5 h-3.5" /> Application Tracker
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Applications</span>
                    </h1>
                    <p className="text-slate-400 font-medium text-sm md:text-base">Track every application and know exactly where you stand.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total Applied", count: stats.total, color: "text-slate-900", bg: "bg-white" },
                        { label: "Pending", count: stats.pending, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Under Review", count: stats.reviewed, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Offers", count: stats.accepted, color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map(s => (
                        <div key={s.label} className={`${s.bg} rounded-3xl p-6 border border-slate-100 shadow-sm`}>
                            <div className={`text-3xl font-black ${s.color} mb-1`}>{s.count}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {["all", "pending", "reviewed", "accepted", "rejected"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === f 
                                ? "bg-slate-900 text-white shadow-lg" 
                                : "bg-white text-slate-500 border border-slate-100 hover:border-blue-300"
                            }`}
                        >
                            {f === "all" ? `All (${stats.total})` : f}
                        </button>
                    ))}
                </div>

                {/* Application Cards */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-[32px] border border-slate-100 p-20 text-center shadow-sm">
                        <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No Applications Found</h2>
                        <p className="text-slate-500 font-medium mb-8">Start applying to great opportunities that match your skills.</p>
                        <Link to="/jobs" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20">
                            <Search className="w-4 h-4" /> Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((app) => {
                            const status = statusConfig[app.status] || statusConfig.pending;
                            const StatusIcon = status.icon;
                            const logoUrl = app.job?.companyLogo || topBrandLogos[app.job?.company] || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

                            return (
                                <div key={app._id} className="bg-white rounded-[28px] border border-slate-200/60 p-4 md:p-6 flex flex-col gap-4 hover:border-blue-500/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shrink-0 overflow-hidden p-2 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                            <img
                                                src={logoUrl}
                                                alt={app.job?.company}
                                                className="w-full h-full object-contain"
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Link to={`/jobs/${app.job?._id}`} className="text-base md:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors mb-1 line-clamp-1 block">
                                                {app.job?.title || "Job Unavailable"}
                                            </Link>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400 font-bold uppercase tracking-wide">
                                                <span className="flex items-center gap-1.5">
                                                    <Briefcase className="w-3.5 h-3.5" /> {app.job?.company || "Unknown"}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5" /> {app.job?.location || "N/A"}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" /> {new Date(app.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className={`flex items-center gap-2 px-3 md:px-4 py-2 ${status.bg} ${status.border} border rounded-2xl`}>
                                            <StatusIcon className={`w-4 h-4 ${status.text}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${status.text}`}>{status.label}</span>
                                        </div>
                                        <Link to={`/jobs/${app.job?._id}`} className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg">
                                            View <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppliedJobs;
