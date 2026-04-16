import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Briefcase, Plus, Trash2, Eye, MapPin, Users,
    Loader2, ToggleLeft, ToggleRight, Search,
    CalendarDays, IndianRupee, Building2
} from "lucide-react";
import { getMyJobs, updateJob, deleteJob } from "../../services/jobService";

const MyJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const data = await getMyJobs();
            setJobs(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (job: any) => {
        const newStatus = job.status === "active" ? "closed" : "active";
        try {
            const updated = await updateJob(job._id, { status: newStatus });
            setJobs(prev => prev.map(j => j._id === job._id ? updated : j));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job posting?")) return;
        setDeletingId(id);
        try {
            await deleteJob(id);
            setJobs(prev => prev.filter(j => j._id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = jobs.filter(j =>
        j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = jobs.filter(j => j.status === "active").length;
    const closedCount = jobs.filter(j => j.status === "closed").length;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
                    <Briefcase className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Jobs...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">

            {/* Header */}
            <div className="bg-white border-b border-slate-200/80 px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[3px] mb-1">My Postings</p>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Job Listings</h1>
                        </div>
                        <Link to="/post-job" className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all text-sm">
                            <Plus className="w-4 h-4" /> Post New Job
                        </Link>
                    </div>

                    {/* Stats + Search row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                <span className="text-sm font-bold text-indigo-700">{jobs.length} Total</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-sm font-bold text-emerald-700">{activeCount} Active</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-2xl">
                                <div className="w-2 h-2 bg-slate-400 rounded-full" />
                                <span className="text-sm font-bold text-slate-600">{closedCount} Closed</span>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-56 pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200/70 text-center py-20 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-700 mb-2">
                            {searchTerm ? "No jobs match your search" : "No jobs posted yet"}
                        </h3>
                        <p className="text-slate-400 font-medium mb-6 text-sm max-w-xs mx-auto">
                            {searchTerm ? "Try a different search term" : "Post your first job and start finding great candidates."}
                        </p>
                        {!searchTerm && (
                            <Link to="/post-job" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all text-sm">
                                <Plus className="w-4 h-4" /> Post Your First Job
                            </Link>
                        )}
                    </div>
                ) : (
                    filtered.map(job => (
                        <div
                            key={job._id}
                            className="bg-white rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-md hover:border-indigo-200/50 transition-all duration-300 overflow-hidden group"
                        >
                            {/* Top accent bar */}
                            <div className={`h-1 w-full ${job.status === "active" ? "bg-linear-to-r from-indigo-500 to-purple-500" : "bg-slate-200"}`} />

                            <div className="p-5 md:p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                                    {/* Left: Info */}
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                                            job.status === "active"
                                                ? "bg-indigo-600 shadow-indigo-500/20"
                                                : "bg-slate-200"
                                        }`}>
                                            <Briefcase className={`w-5 h-5 ${job.status === "active" ? "text-white" : "text-slate-400"}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                                                <h3 className="text-base font-black text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                                                    {job.title}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                                                    job.status === "active"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : "bg-slate-100 text-slate-500 border border-slate-200"
                                                }`}>
                                                    {job.status}
                                                </span>
                                                {job.type && (
                                                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        {job.type}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                                                </span>
                                                {job.salary && (
                                                    <span className="flex items-center gap-1">
                                                        <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> 
                                                        {job.salary.min?.toLocaleString('en-IN')} - {job.salary.max?.toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                                                    Posted {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Stats + Actions */}
                                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                                        {/* Applicants count */}
                                        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-sm font-black text-slate-700">{job.applicantsCount || 0}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">applicants</span>
                                        </div>

                                        {/* Toggle Active/Closed */}
                                        <button
                                            onClick={() => handleToggleStatus(job)}
                                            title={job.status === "active" ? "Close job" : "Reopen job"}
                                            className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                                        >
                                            {job.status === "active"
                                                ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                                                : <ToggleLeft className="w-5 h-5 text-slate-400" />
                                            }
                                        </button>

                                        {/* View Applicants */}
                                        <Link
                                            to={`/jobs/${job._id}/applicants`}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-bold transition-colors"
                                            title="View applicants"
                                        >
                                            <Users className="w-3.5 h-3.5" /> Applicants
                                        </Link>

                                        {/* View Job */}
                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                                            title="View job"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            disabled={deletingId === job._id}
                                            className="p-2.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-50"
                                            title="Delete job"
                                        >
                                            {deletingId === job._id
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <Trash2 className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyJobs;
