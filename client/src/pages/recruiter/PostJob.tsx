import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Loader2, MapPin, DollarSign, Briefcase, Users, Clock, Wrench } from "lucide-react";
import { createJob } from "../../services/jobService";

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        description: "",
        company: "",
        location: "",
        type: "full-time",
        skills: "",
        experience: "0-1 years",
        openings: 1,
        salaryMin: "",
        salaryMax: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const jobData = {
                title: form.title,
                description: form.description,
                company: form.company,
                location: form.location,
                type: form.type,
                skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
                experience: form.experience,
                openings: Number(form.openings),
                salary: {
                    min: Number(form.salaryMin) || 0,
                    max: Number(form.salaryMax) || 0,
                    currency: "INR",
                },
            };
            await createJob(jobData);
            navigate("/my-jobs");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
            <div className="glass-card">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-[var(--accent)]/10 p-2.5 rounded-xl">
                        <PlusCircle className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Post a New Job</h1>
                        <p className="text-sm text-[var(--text-secondary)]">Fill in the details to attract top talent</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Job Title *</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Frontend Developer" className="input-field pl-9" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Company *</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="company" value={form.company} onChange={handleChange} required placeholder="e.g. Google" className="input-field pl-9" />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Job Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} required rows={5} placeholder="Describe the role, responsibilities..." className="input-field resize-none" />
                    </div>

                    {/* Location & Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Location *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Bangalore, India" className="input-field pl-9" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Job Type *</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <select name="type" value={form.type} onChange={handleChange} className="input-field pl-9 appearance-none">
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="remote">Remote</option>
                                    <option value="internship">Internship</option>
                                    <option value="contract">Contract</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Salary Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Min Salary (₹)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} placeholder="e.g. 500000" className="input-field pl-9" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Max Salary (₹)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} placeholder="e.g. 1500000" className="input-field pl-9" />
                            </div>
                        </div>
                    </div>

                    {/* Skills & Experience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Skills</label>
                            <div className="relative">
                                <Wrench className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node, MongoDB" className="input-field pl-9" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Experience Required</label>
                            <select name="experience" value={form.experience} onChange={handleChange} className="input-field appearance-none">
                                <option value="0-1 years">0–1 years (Fresher)</option>
                                <option value="1-3 years">1–3 years</option>
                                <option value="3-5 years">3–5 years</option>
                                <option value="5+ years">5+ years</option>
                            </select>
                        </div>
                    </div>

                    {/* Openings */}
                    <div className="w-full sm:w-1/2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">No. of Openings</label>
                        <input name="openings" type="number" min="1" value={form.openings} onChange={handleChange} className="input-field" />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><PlusCircle className="w-5 h-5" /> Publish Job</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
