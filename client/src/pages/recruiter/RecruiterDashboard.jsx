import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    Briefcase, Users, Calendar,
    PlusCircle, ArrowRight, CheckCircle2, Clock,
    TrendingUp, Eye, Loader2, BarChart3, Zap,
    MapPin, AlertCircle
} from "lucide-react";
import api from "../../services/api";

const RecruiterDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [jobs, setJobs] = useState([]);
    const [recentApps, setRecentApps] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [jobsRes, appsRes, intRes] = await Promise.all([
                    api.get("/jobs/my-jobs"),
                    api.get("/applications/recruiter"),
                    api.get("/interviews/my-scheduled"),
                ]);
                setJobs(jobsRes.data.data || []);
                setRecentApps((appsRes.data.data || []).slice(0, 5));
                setInterviews((intRes.data.data || []).slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantsCount || 0), 0);
    const activeJobs = jobs.filter((j) => j.status === "active").length;
    const pendingApps = recentApps.filter((a) => a.status === "pending").length;
    const upcomingInterviews = interviews.filter((i) => new Date(i.scheduledAt) > new Date()).length;

    const statusColor = {
        pending:     "bg-amber-50 text-amber-700 border-amber-200",
        reviewed:    "bg-blue-50 text-blue-700 border-blue-200",
        accepted:    "bg-emerald-50 text-emerald-700 border-emerald-200",
        rejected:    "bg-rose-50 text-rose-700 border-rose-200",
        shortlisted: "bg-violet-50 text-violet-700 border-violet-200" };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] gap-3 bg-slate-50/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 transition-colors">

            {/* ── Hero Header ── */}
            <div className="bg-white border-b border-slate-200/80 px-4 py-8 md:py-10 transition-colors">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-3">
                            <Zap className="w-3 h-3" /> Recruiter Hub
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                            Welcome back, {user?.name?.split(" ")[0]} 👋
                        </h1>
                        <p className="text-slate-400 font-medium mt-1 text-sm">
                            Here's your hiring activity overview for today.
                        </p>
                    </div>
                    <Link
                        to="/post-job"
                        className="self-start sm:self-auto flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all text-sm"
                    >
                        <PlusCircle className="w-4 h-4" /> Post New Job
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 space-y-8">

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Active Jobs", value: activeJobs,
                            sub: `of ${jobs.length} total`,
                            icon: Briefcase, iconBg: "bg-indigo-100", iconColor: "text-indigo-600",
                            accent: "from-indigo-500/10 to-transparent", link: "/my-jobs" },
                        {
                            label: "Total Applicants", value: totalApplicants,
                            sub: "across all jobs",
                            icon: Users, iconBg: "bg-emerald-100", iconColor: "text-emerald-600",
                            accent: "from-emerald-500/10 to-transparent", link: "/my-jobs" },
                        {
                            label: "Pending Reviews", value: pendingApps,
                            sub: "need attention",
                            icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600",
                            accent: "from-amber-500/10 to-transparent", link: "/my-jobs" },
                        {
                            label: "Upcoming Interviews", value: upcomingInterviews,
                            sub: "scheduled",
                            icon: Calendar, iconBg: "bg-violet-100", iconColor: "text-violet-600",
                            accent: "from-violet-500/10 to-transparent", link: "/interviews" },
                    ].map(({ label, value, sub, icon: Icon, iconBg, iconColor, accent, link }) => (
                        <Link
                            key={label}
                            to={link}
                            className="group relative bg-white rounded-3xl border border-slate-200/70 p-5 md:p-6 overflow-hidden hover:shadow-lg hover:border-indigo-200/60 transition-all duration-300"
                        >
                            <div className={`absolute inset-0 bg-linear-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <div className="relative z-10">
                                <div className={`w-11 h-11 ${iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <div className="text-3xl font-black text-slate-900 mb-0.5">{value}</div>
                                <div className="text-xs font-black text-slate-700 uppercase tracking-wide">{label}</div>
                                <div className="text-[11px] text-slate-400 font-medium mt-0.5">{sub}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── Main Body ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Recent Applications */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden transition-colors">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight transition-colors">
                                <BarChart3 className="w-4 h-4 text-indigo-500" /> Recent Applications
                            </h2>
                            <Link to="/my-jobs" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                                View All <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {recentApps.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                                        <Users className="w-7 h-7 text-slate-300" />
                                    </div>
                                    <p className="font-bold text-slate-700 mb-1 transition-colors">No applications yet</p>
                                    <p className="text-slate-400 text-sm font-medium mb-4 transition-colors">Post a job to start receiving candidates</p>
                                    <Link
                                        to="/post-job"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20"
                                    >
                                        <PlusCircle className="w-3.5 h-3.5" /> Post Job
                                    </Link>
                                </div>
                            ) : (
                                recentApps.map((app) => (
                                    <div key={app._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors group">
                                        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm shadow-indigo-500/20">
                                            {app.applicant?.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-slate-900 text-sm truncate transition-colors">{app.applicant?.name || "Unknown"}</p>
                                            <p className="text-[11px] text-slate-400 font-medium truncate transition-colors">{app.job?.title || "Position"}</p>
                                        </div>
                                        <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-xl text-[10px] font-bold capitalize border ${statusColor[app.status] || statusColor.pending}`}>
                                            {app.status || "pending"}
                                        </span>
                                        <Link
                                            to={`/jobs/${app.job?._id || app.job}/applicants`}
                                            title="View Applicants"
                                            className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group-hover:text-slate-400 shrink-0"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-5">

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm transition-colors">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4 transition-colors">Quick Actions</h2>
                            <div className="space-y-2">
                                {[
                                    { label: "Post New Job",       to: "/post-job",   icon: PlusCircle,    bg: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20" },
                                    { label: "View My Jobs",       to: "/my-jobs",    icon: Briefcase,     bg: "bg-slate-100 text-slate-700 hover:bg-slate-200" },
                                    { label: "Schedule Interview", to: "/interviews", icon: Calendar,      bg: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100" },
                                ].map(({ label, to, icon: Icon, bg }) => (
                                    <Link key={to} to={to} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${bg}`}>
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {label}
                                        <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Interviews */}
                        <div className="bg-slate-900 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-tight">
                                        <Calendar className="w-4 h-4 text-indigo-400" /> Interviews
                                    </h2>
                                    <Link to="/interviews" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">
                                        All →
                                    </Link>
                                </div>

                                {interviews.length === 0 ? (
                                    <div className="text-center py-4">
                                        <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                        <p className="text-slate-400 text-sm font-medium">No interviews yet</p>
                                        <Link to="/interviews" className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-400 font-bold hover:underline">
                                            <PlusCircle className="w-3 h-3" /> Schedule one
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {interviews.map((iv) => (
                                            <div key={iv._id} className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-white truncate">{iv.job?.title || "Interview"}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                        <Clock className="w-2.5 h-2.5 inline mr-1" />
                                                        {new Date(iv.scheduledAt).toLocaleString("en-IN", {
                                                            day: "numeric", month: "short",
                                                            hour: "2-digit", minute: "2-digit"
                                                        })}
                                                    </p>
                                                    <p className="text-[10px] text-indigo-400 font-bold capitalize mt-0.5 flex items-center gap-1">
                                                        <TrendingUp className="w-2.5 h-2.5" /> {iv.mode}
                                                        {iv.applicant?.name && <span className="text-slate-500"> · {iv.applicant.name}</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* My Active Jobs mini-list */}
                        {jobs.length > 0 && (
                            <div className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight transition-colors">Active Listings</h2>
                                    <Link to="/my-jobs" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline transition-colors">All →</Link>
                                </div>
                                <div className="space-y-2.5">
                                    {jobs.filter((j) => j.status === "active").slice(0, 3).map((job) => (
                                        <Link key={job._id} to={`/jobs/${job._id}/applicants`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                                            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                                <Briefcase className="w-4 h-4 text-indigo-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{job.title}</p>
                                                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 transition-colors">
                                                    <MapPin className="w-2.5 h-2.5" />{job.location}
                                                    <span className="ml-1 text-slate-300">·</span>
                                                    <Users className="w-2.5 h-2.5 text-emerald-500" />
                                                    <span className="text-emerald-600 font-bold">{job.applicantsCount || 0}</span>
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
