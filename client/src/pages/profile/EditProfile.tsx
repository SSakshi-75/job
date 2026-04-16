import { useState } from "react";
import { X, Save, Loader2, User, Briefcase, MapPin, BookOpen, Wrench, Phone } from "lucide-react";
import { updateProfile } from "../../services/profileService";

interface EditProfileProps {
    user: any;
    onClose: () => void;
    onSave: (updatedUser: any) => void;
}

const EditProfile = ({ user, onClose, onSave }: EditProfileProps) => {
    // Guard: agar profile load nahi hui toh crash se bachao
    if (!user) return null;
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
        if (e.target.name === "phone") {
            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
            setForm({ ...form, phone: val });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 animate-in zoom-in duration-300">
                
                {/* Header: More compact padding */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-black text-slate-900 leading-none">Edit Profile</h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Profile Details</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
                    <div className="p-6 space-y-6 flex-1">
                        {/* Section: Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[2px]">Core Identity</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="name" required value={form.name} onChange={handleChange} placeholder="Your Name" className="input-field pl-11" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="phone" type="tel" maxLength={10} value={form.phone} onChange={handleChange} placeholder="Phone" className="input-field pl-11" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input name="location" value={form.location} onChange={handleChange} placeholder="City, Country" className="input-field pl-11" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Professional Bio</label>
                                <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={3} className="input-field min-h-[100px] resize-none" />
                            </div>
                        </div>

                        {/* Section: Professional details */}
                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[2px]">Professional Background</h3>
                            {user.role === "job-seeker" ? (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Skills (Comma separated)</label>
                                        <div className="relative">
                                            <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Tailwind, Node..." className="input-field pl-11" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 ml-1">Experience</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 2 Years" className="input-field pl-11" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 ml-1">Education</label>
                                            <div className="relative">
                                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input name="education" value={form.education} onChange={handleChange} placeholder="e.g. B.Tech CS" className="input-field pl-11" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Company Name</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input name="company" value={form.company} onChange={handleChange} placeholder="Current Company" className="input-field pl-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Company Website</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input name="companyWebsite" value={form.companyWebsite} onChange={handleChange} placeholder="https://company.com" className="input-field pl-11" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
                        <div className="flex gap-4">
                            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 border border-slate-200 rounded-2xl text-slate-600 bg-white hover:bg-slate-50 font-black text-xs uppercase tracking-widest transition-all">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {loading ? "Updating..." : "Save Profile"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
