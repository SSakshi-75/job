import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader2, Building, MapPin, Clock, DollarSign, Briefcase, ArrowLeft, Send, Users } from "lucide-react";
import { getJobById } from "../../services/jobService";
import { useSelector } from "react-redux";

const JobDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useSelector((state: any) => state.auth);

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
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="glass-card p-12">
                    <Briefcase className="w-16 h-16 text-[var(--text-secondary)]/30 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Job Not Found</h2>
                    <p className="text-[var(--text-secondary)] mb-6">{error || "This job may have been removed."}</p>
                    <button onClick={() => navigate(-1)} className="btn-primary flex items-center gap-2 mx-auto">
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to listings
            </button>

            {/* Header Section */}
            <div className="glass-card p-8 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -z-10 group-hover:bg-[var(--accent)]/10 transition-colors duration-500"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center border border-[var(--accent)]/30 flex-shrink-0">
                            <Building className="w-10 h-10 text-[var(--accent)]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 leading-tight">
                                {job.title}
                            </h1>
                            <div className="flex items-center gap-2 text-lg text-[var(--text-secondary)] font-medium">
                                <span>{job.company}</span>
                                <span className="w-1 h-1 bg-[var(--text-secondary)]/50 rounded-full" />
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        {user?.role === "job-seeker" ? (
                            <button className="btn-primary py-3 px-8 text-lg font-bold shadow-lg shadow-[var(--accent)]/20 flex items-center gap-2 w-full md:w-auto justify-center">
                                <Send className="w-5 h-5" /> Apply Now
                            </button>
                        ) : user?.role === "recruiter" && user._id === job.postedBy ? (
                            <Link to={`/jobs/${job._id}/applicants`} className="btn-primary py-3 px-8 text-lg font-bold flex items-center gap-2 w-full md:w-auto justify-center bg-transparent border border-[var(--accent)] text-[var(--text-primary)] hover:bg-[var(--accent)]/10">
                                <Users className="w-5 h-5" /> View Applicants
                            </Link>
                        ) : null}
                        <p className="text-xs text-[var(--text-secondary)] font-medium">
                            Posted on {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[var(--border)]">
                     <div className="bg-[var(--bg-main)]/50 p-4 rounded-xl border border-[var(--border)]">
                        <div className="text-[var(--text-secondary)] text-sm mb-1 flex items-center gap-1.5 font-semibold"><Briefcase className="w-4 h-4" /> Job Type</div>
                        <div className="font-bold text-[var(--text-primary)] capitalize">{job.type}</div>
                    </div>
                    <div className="bg-[var(--bg-main)]/50 p-4 rounded-xl border border-[var(--border)]">
                        <div className="text-[var(--text-secondary)] text-sm mb-1 flex items-center gap-1.5 font-semibold"><Clock className="w-4 h-4" /> Experience</div>
                        <div className="font-bold text-[var(--text-primary)] capitalize">{job.experience}</div>
                    </div>
                    <div className="bg-[var(--bg-main)]/50 p-4 rounded-xl border border-[var(--border)]">
                        <div className="text-[var(--text-secondary)] text-sm mb-1 flex items-center gap-1.5 font-semibold"><DollarSign className="w-4 h-4" /> Salary</div>
                        <div className="font-bold text-[var(--text-primary)]">₹ {job.salary?.min?.toLocaleString("en-IN") || 0} - {job.salary?.max?.toLocaleString("en-IN") || 0}</div>
                    </div>
                    <div className="bg-[var(--bg-main)]/50 p-4 rounded-xl border border-[var(--border)]">
                        <div className="text-[var(--text-secondary)] text-sm mb-1 flex items-center gap-1.5 font-semibold"><Users className="w-4 h-4" /> Openings</div>
                        <div className="font-bold text-[var(--text-primary)]">{job.openings || 1} Positions</div>
                    </div>
                </div>
            </div>

            {/* Description and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-[var(--accent)] rounded-full"></span>
                            Job Description
                        </h3>
                        <div className="text-[var(--text-secondary)] leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                            {job.description}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.skills?.map((skill: string, index: number) => (
                                <span key={index} className="px-3 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-lg text-sm font-semibold">
                                    {skill}
                                </span>
                            ))}
                            {(!job.skills || job.skills.length === 0) && (
                                <span className="text-[var(--text-secondary)] italic text-sm">Skills not specified by recruiter</span>
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-main)] border border-[var(--border)]">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">About {job.company}</h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                            {job.company} is actively looking for high-impact talent. Join them and scale your career to the next level.
                        </p>
                        <div className="w-full justify-center flex p-4 bg-white/5 border border-[var(--border)] rounded-xl">
                            <Building className="w-12 h-12 text-[var(--text-secondary)]/30" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
