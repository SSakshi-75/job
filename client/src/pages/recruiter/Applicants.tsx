import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, User, Mail, Calendar, Clock } from "lucide-react";
import api from "../../services/api";

const Applicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState<any[]>([]);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Get job details
                const jobRes = await api.get(`/jobs/${jobId}`);
                setJobTitle(jobRes.data.data.title);

                // Get applicants for this job (will be implemented in Phase 5)
                // For now, show a placeholder
                try {
                    const appRes = await api.get(`/applications/job/${jobId}`);
                    setApplicants(appRes.data.data || []);
                } catch {
                    setApplicants([]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [jobId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Applicants</h1>
                <p className="text-[var(--text-secondary)] mt-1">For: {jobTitle}</p>
            </div>

            {applicants.length === 0 ? (
                <div className="glass-card text-center py-16">
                    <User className="w-16 h-16 text-[var(--text-secondary)]/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No applicants yet</h3>
                    <p className="text-[var(--text-secondary)]">Applications will appear here once candidates apply.</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-4 opacity-50">Application system will be fully functional after Phase 5</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {applicants.map((app: any) => (
                        <div key={app._id} className="glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20">
                                    <User className="w-6 h-6 text-[var(--accent)]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[var(--text-primary)]">{app.applicant?.name || "Unknown"}</h4>
                                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{app.applicant?.email}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                                    app.status === "accepted" ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : app.status === "rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                }`}>
                                    {app.status || "pending"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applicants;
