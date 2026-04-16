import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Loader2, Building2, MapPin, Clock, DollarSign, Briefcase,
    ArrowLeft, Send, Users, CheckCircle2, Calendar, Star
} from "lucide-react";
import { getJobById } from "../../services/jobService";
import { applyForJob } from "../../services/applicationService";
import { useSelector } from "react-redux";
import AIJobMatchCard from "../../components/AIJobMatchCard";

const topBrandLogos: any = {
    "Google":         "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png",
    "Microsoft":      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    "Tesla":          "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    "Netflix":        "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    "Spotify":        "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg",
    "Sportify":       "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg",
    "SpaceX":         "https://upload.wikimedia.org/wikipedia/commons/3/36/SpaceX-Logo.svg",
    "Amazon":         "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    "Cloud Solutions":"https://cdn-icons-png.flaticon.com/512/5968/5968267.png",
    "Creative Studio":"https://cdn-icons-png.flaticon.com/512/3659/3659030.png",
    "StartUp Inc":    "https://cdn-icons-png.flaticon.com/512/261/261768.png",
};

function formatSalary(val: number) {
    if (!val) return "0";
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
}

const typeColorMap: Record<string, string> = {
    "full-time":  "bg-emerald-100 text-emerald-700",
    "part-time":  "bg-violet-100 text-violet-700",
    "remote":     "bg-sky-100 text-sky-700",
    "internship": "bg-amber-100 text-amber-700",
    "contract":   "bg-rose-100 text-rose-700",
};

const JobDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applying, setApplying] = useState(false);
    const [applyMessage, setApplyMessage] = useState({ type: "", text: "" });
    const { user } = useSelector((state: any) => state.auth);

    const handleApply = async () => {
        setApplying(true);
        setApplyMessage({ type: "", text: "" });
        try {
            const res = await applyForJob(id as string);
            setApplyMessage({ type: "success", text: res.message || "Successfully applied!" });
        } catch (err: any) {
            setApplyMessage({ type: "error", text: err.response?.data?.message || "Failed to apply." });
        } finally {
            setApplying(false);
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                if (id) {
                    const data = await getJobById(id);
                    setJob(data);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "Job not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] gap-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Loading Job...</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <div className="bg-white rounded-3xl border border-slate-100 p-12 shadow-sm">
                    <Briefcase className="w-14 h-14 text-slate-200 mx-auto mb-5" />
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Job Not Found</h2>
                    <p className="text-slate-400 mb-8 font-medium">{error || "This job may have been removed."}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mx-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const logoUrl = job.companyLogo || topBrandLogos[job.company] || null;
    const typeKey = (job.type || "").toLowerCase();
    const typeColor = typeColorMap[typeKey] || "bg-slate-100 text-slate-700";

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-6 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Listings
            </button>

            {/* ── Hero Card ── */}
            <div className="bg-white rounded-3xl border border-slate-200/70 p-6 md:p-10 mb-6 shadow-sm relative overflow-hidden">
                {/* Gradient blob */}
                <div className="absolute -top-16 -right-16 w-72 h-72 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-start gap-6 justify-between">
                    {/* Left: Logo + Title */}
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={job.company}
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; }}
                                />
                            ) : (
                                <span className="text-2xl font-black text-indigo-300">
                                    {job.company?.[0]?.toUpperCase() || "?"}
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${typeColor}`}>
                                    {job.type || "Full-time"}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" /> Top Tier
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-1">
                                {job.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-semibold">
                                <span className="font-bold text-slate-700">{job.company}</span>
                                {job.location && (
                                    <>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {job.location}
                                        </span>
                                    </>
                                )}
                                {job.createdAt && (
                                    <>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Apply / View Applicants */}
                    <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
                        {user?.role === "job-seeker" ? (
                            <>
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                                >
                                    {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    Apply for Role
                                </button>
                                {applyMessage.text && (
                                    <span className={`text-xs font-bold ${applyMessage.type === "success" ? "text-emerald-600" : "text-rose-500"}`}>
                                        {applyMessage.text}
                                    </span>
                                )}
                            </>
                        ) : user?.role === "recruiter" && user._id === job.recruiter ? (
                            <Link
                                to={`/jobs/${job._id}/applicants`}
                                className="flex items-center gap-2.5 px-8 py-3.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold rounded-2xl transition-all"
                            >
                                <Users className="w-5 h-5" /> View Applicants
                            </Link>
                        ) : null}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-8 border-t border-slate-100">
                    {[
                        { icon: DollarSign, label: "Salary Range", value: `${formatSalary(job.salary?.min)} – ${formatSalary(job.salary?.max)}`, color: "text-indigo-600" },
                        { icon: Briefcase,  label: "Job Type",     value: job.type || "—",           color: "text-emerald-600" },
                        { icon: Clock,      label: "Experience",   value: job.experience || "Open",  color: "text-amber-600" },
                        { icon: Users,      label: "Openings",     value: `${job.openings || 1} Position${(job.openings || 1) > 1 ? "s" : ""}`, color: "text-violet-600" },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                <Icon className={`w-3.5 h-3.5 ${color}`} /> {label}
                            </div>
                            <div className="text-sm font-black text-slate-900 capitalize">{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Body: Two Columns ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Description */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200/70 p-6 md:p-10 shadow-sm">
                        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                            <span className="w-1 h-6 bg-indigo-600 rounded-full" />
                            Role Overview
                        </h2>
                        <div className="text-slate-600 leading-[1.9] font-medium text-[15px] whitespace-pre-wrap">
                            {job.description || "No description provided."}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-5">

                    {/* AI Match Card */}
                    {user?.role === "job-seeker" && <AIJobMatchCard jobId={job._id} />}

                    {/* Required Skills */}
                    <div className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[3px] mb-4 flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5" /> Prerequisites
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {job.skills?.length > 0 ? job.skills.map((skill: string, i: number) => (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-[11px] font-bold uppercase tracking-wide hover:bg-indigo-100 transition-colors"
                                >
                                    {skill}
                                </span>
                            )) : (
                                <span className="text-slate-400 italic text-sm font-medium">Standard credentials required</span>
                            )}
                        </div>
                    </div>

                    {/* Company Card */}
                    <div className="bg-slate-900 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10">
                            {/* Company Logo */}
                            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden mb-4">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={job.company}
                                        className="w-full h-full object-contain p-1.5"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; }}
                                    />
                                ) : (
                                    <Building2 className="w-6 h-6 text-white/30" />
                                )}
                            </div>
                            <h3 className="text-base font-black text-white mb-1">{job.company}</h3>
                            <p className="text-slate-400 text-[13px] leading-relaxed font-medium">
                                {job.company} is building the future of industry solutions — a workplace designed for those who dare to innovate and scale.
                            </p>
                            <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Employer</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobDetails;
