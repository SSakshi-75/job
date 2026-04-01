import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";
import { Loader2, Briefcase, Building, Clock, MapPin } from "lucide-react";

const AppliedJobs = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">My Applications</h1>
            <p className="text-[var(--text-secondary)] mb-8">Track the status of the jobs you've applied to.</p>

            {applications.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center p-16 text-center">
                    <Briefcase className="w-16 h-16 text-[var(--text-secondary)]/30 mb-4" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">No applications yet</h2>
                    <p className="text-[var(--text-secondary)] mb-6">You haven't applied to any jobs. Start exploring opportunities!</p>
                    <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[var(--accent)]/30 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl flex items-center justify-center border border-[var(--accent)]/20 shrink-0">
                                    <Building className="w-7 h-7" />
                                </div>
                                <div className="min-w-0">
                                    <Link to={`/jobs/${app.job?._id}`} className="text-xl font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors mb-1 line-clamp-1 block">
                                        {app.job?.title || "Job Unavailable"}
                                    </Link>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-[var(--text-secondary)] font-medium">
                                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {app.job?.company || "Unknown"}</span>
                                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {app.job?.location || "N/A"}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-start md:justify-end shrink-0">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-center w-32 ${
                                    app.status === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                    app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    app.status === 'reviewed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                }`}>
                                    {app.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppliedJobs;
