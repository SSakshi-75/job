import { useState } from "react";
import { X, Save, Loader2, User, Briefcase, MapPin, BookOpen, Wrench } from "lucide-react";
import { updateProfile } from "../../services/profileService";

interface EditProfileProps {
    user: any;
    onClose: () => void;
    onSave: (updatedUser: any) => void;
}

const EditProfile = ({ user, onClose, onSave }: EditProfileProps) => {
    const [form, setForm] = useState({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
        location: user.location || "",
        experience: user.experience || "",
        education: user.education || "",
        company: user.company || "",
        companyWebsite: user.companyWebsite || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const updated = await updateProfile(form);
            onSave(updated);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Basic Info */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Basic Info</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="input-field pl-9" />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="input-field pl-9" />
                            </div>
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                            <input name="location" value={form.location} onChange={handleChange} placeholder="Location (e.g. Bangalore, India)" className="input-field pl-9" />
                        </div>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Write a short bio..."
                            rows={3}
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Job Seeker Fields */}
                    {user.role === "job-seeker" && (
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Career Details</p>
                            <div className="relative">
                                <Wrench className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated: React, Node, etc.)" className="input-field pl-9" />
                            </div>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="experience" value={form.experience} onChange={handleChange} placeholder="Years of Experience (e.g. 3 years)" className="input-field pl-9" />
                            </div>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="education" value={form.education} onChange={handleChange} placeholder="Education (e.g. B.Tech CSE, IIT Delhi)" className="input-field pl-9" />
                            </div>
                        </div>
                    )}

                    {/* Recruiter Fields */}
                    {user.role === "recruiter" && (
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Company Details</p>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="company" value={form.company} onChange={handleChange} placeholder="Company Name" className="input-field pl-9" />
                            </div>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                                <input name="companyWebsite" value={form.companyWebsite} onChange={handleChange} placeholder="Company Website (https://...)" className="input-field pl-9" />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-white/5 transition-all font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
