import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Plus, Trash2, Eye, MapPin, Users, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { getMyJobs, updateJob, deleteJob } from "../../services/jobService";

const MyJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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
        if (!confirm("Are you sure you want to delete this job?")) return;
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Job Postings</h1>
                    <p className="text-[var(--text-secondary)] mt-1">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
                </div>
                <Link to="/post-job" className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Post New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="glass-card text-center py-16">
                    <Briefcase className="w-16 h-16 text-[var(--text-secondary)]/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No jobs posted yet</h3>
                    <p className="text-[var(--text-secondary)] mb-6">Start attracting candidates by posting your first job.</p>
                    <Link to="/post-job" className="btn-primary inline-flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Post Your First Job
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job._id} className="glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[var(--accent)]/20 transition-all duration-200">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] truncate">{job.title}</h3>
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${
                                        job.status === "active"
                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--text-secondary)]">
                                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.company}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {job.applicantsCount || 0} applicants</span>
                                    <span className="capitalize px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-xs font-medium">{job.type}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Toggle status */}
                                <button
                                    onClick={() => handleToggleStatus(job)}
                                    title={job.status === "active" ? "Close job" : "Reopen job"}
                                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                >
                                    {job.status === "active"
                                        ? <ToggleRight className="w-5 h-5 text-green-400" />
                                        : <ToggleLeft className="w-5 h-5 text-red-400" />
                                    }
                                </button>

                                {/* Applicants */}
                                <Link
                                    to={`/jobs/${job._id}/applicants`}
                                    className="p-2 rounded-lg hover:bg-[var(--accent)]/10 transition-colors text-[var(--text-secondary)] hover:text-[var(--accent)]"
                                    title="View applicants"
                                >
                                    <Users className="w-5 h-5" />
                                </Link>

                                {/* View */}
                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    title="View job"
                                >
                                    <Eye className="w-5 h-5" />
                                </Link>

                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(job._id)}
                                    disabled={deletingId === job._id}
                                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-[var(--text-secondary)] hover:text-red-500"
                                    title="Delete job"
                                >
                                    {deletingId === job._id
                                        ? <Loader2 className="w-5 h-5 animate-spin" />
                                        : <Trash2 className="w-5 h-5" />
                                    }
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyJobs;
