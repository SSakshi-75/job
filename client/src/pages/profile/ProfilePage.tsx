import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    User, Briefcase, MapPin, BookOpen, Wrench, Mail,
    Phone, Upload, FileText, Edit3, Loader2, ExternalLink, CheckCircle
} from "lucide-react";
import { setUser } from "../../redux/slices/authSlice";
import { fetchProfile, uploadProfilePicture, uploadResume } from "../../services/profileService";
import EditProfile from "./EditProfile";

const ProfilePage = () => {
    const { user } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [uploading, setUploading] = useState({ pic: false, resume: false });
    const [uploadSuccess, setUploadSuccess] = useState({ pic: false, resume: false });

    const picInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProfile();
                setProfile(data);
            } catch (err) {
                console.error("Failed to load profile:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(prev => ({ ...prev, pic: true }));
        try {
            const data = await uploadProfilePicture(file);
            setProfile((prev: any) => ({ ...prev, profilePicture: data.filePath }));
            dispatch(setUser({ ...user, profilePicture: data.filePath }));
            setUploadSuccess(prev => ({ ...prev, pic: true }));
            setTimeout(() => setUploadSuccess(prev => ({ ...prev, pic: false })), 3000);
        } catch (err) { console.error(err); }
        finally { setUploading(prev => ({ ...prev, pic: false })); }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(prev => ({ ...prev, resume: true }));
        try {
            const data = await uploadResume(file);
            setProfile((prev: any) => ({ ...prev, resume: data.filePath }));
            setUploadSuccess(prev => ({ ...prev, resume: true }));
            setTimeout(() => setUploadSuccess(prev => ({ ...prev, resume: false })), 3000);
        } catch (err) { console.error(err); }
        finally { setUploading(prev => ({ ...prev, resume: false })); }
    };

    const handleProfileSave = (updatedUser: any) => {
        setProfile(updatedUser);
        dispatch(setUser({ ...user, name: updatedUser.name }));
        setShowEditModal(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    const isSeeker = profile?.role === "job-seeker";
    const isRecruiter = profile?.role === "recruiter";
    const avatarUrl = profile?.profilePicture
        ? `http://localhost:5000${profile.profilePicture}`
        : null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Hidden file inputs */}
            <input ref={picInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
            <input ref={resumeInputRef} type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Left Card: Avatar + Quick Info ── */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="glass-card text-center space-y-4">
                        {/* Avatar */}
                        <div className="relative inline-block">
                            <div className="w-28 h-28 rounded-full mx-auto overflow-hidden bg-[var(--accent)]/10 border-2 border-[var(--accent)]/30 flex items-center justify-center">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-14 h-14 text-[var(--accent)]/50" />
                                )}
                            </div>
                            <button
                                onClick={() => picInputRef.current?.click()}
                                disabled={uploading.pic}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            >
                                {uploading.pic ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Upload className="w-4 h-4 text-white" />}
                            </button>
                        </div>
                        {uploadSuccess.pic && (
                            <div className="flex items-center justify-center gap-1 text-green-400 text-xs font-medium">
                                <CheckCircle className="w-4 h-4" /> Photo updated!
                            </div>
                        )}

                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">{profile?.name}</h2>
                            <span className="inline-block mt-1 px-3 py-0.5 text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full capitalize">
                                {profile?.role?.replace("-", " ")}
                            </span>
                        </div>

                        {/* Quick info */}
                        <div className="space-y-2 text-sm text-left">
                            {profile?.email && (
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Mail className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                                    <span className="truncate">{profile.email}</span>
                                </div>
                            )}
                            {profile?.phone && (
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Phone className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                                    {profile.phone}
                                </div>
                            )}
                            {profile?.location && (
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <MapPin className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                                    {profile.location}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowEditModal(true)}
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>

                {/* ── Right Column ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Bio */}
                    <div className="glass-card space-y-2">
                        <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2"><User className="w-4 h-4 text-[var(--accent)]" /> About</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            {profile?.bio || <span className="italic opacity-50">No bio added yet. Click Edit Profile to add one.</span>}
                        </p>
                    </div>

                    {/* Seeker-specific sections */}
                    {isSeeker && (
                        <>
                            {/* Skills */}
                            <div className="glass-card space-y-3">
                                <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2"><Wrench className="w-4 h-4 text-[var(--accent)]" /> Skills</h3>
                                {profile?.skills?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1 text-sm font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : <p className="text-[var(--text-secondary)] text-sm italic opacity-50">No skills added yet.</p>}
                            </div>

                            {/* Experience & Education */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="glass-card space-y-2">
                                    <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2"><Briefcase className="w-4 h-4 text-[var(--accent)]" /> Experience</h3>
                                    <p className="text-[var(--text-secondary)] text-sm">{profile?.experience || <span className="italic opacity-50">Not added</span>}</p>
                                </div>
                                <div className="glass-card space-y-2">
                                    <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2"><BookOpen className="w-4 h-4 text-[var(--accent)]" /> Education</h3>
                                    <p className="text-[var(--text-secondary)] text-sm">{profile?.education || <span className="italic opacity-50">Not added</span>}</p>
                                </div>
                            </div>

                            {/* Resume */}
                            <div className="glass-card space-y-3">
                                <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2"><FileText className="w-4 h-4 text-[var(--accent)]" /> Resume</h3>
                                {profile?.resume ? (
                                    <div className="flex items-center justify-between bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-8 h-8 text-[var(--accent)]" />
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--text-primary)]">Resume.pdf</p>
                                                <p className="text-xs text-[var(--text-secondary)]">Uploaded successfully</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`http://localhost:5000${profile.resume}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-sm text-[var(--accent)] hover:underline font-medium"
                                        >
                                            <ExternalLink className="w-4 h-4" /> View
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-[var(--text-secondary)] text-sm italic opacity-50">No resume uploaded yet.</p>
                                )}
                                {uploadSuccess.resume && (
                                    <div className="flex items-center gap-1 text-green-400 text-xs font-medium">
                                        <CheckCircle className="w-4 h-4" /> Resume updated!
                                    </div>
                                )}
                                <button
                                    onClick={() => resumeInputRef.current?.click()}
                                    disabled={uploading.resume}
                                    className="btn-primary flex items-center gap-2 py-2 text-sm"
                                >
                                    {uploading.resume ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    {profile?.resume ? "Update Resume" : "Upload Resume"}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Recruiter-specific */}
                    {isRecruiter && (
                        <div className="glass-card space-y-3">
                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2"><Briefcase className="w-4 h-4 text-[var(--accent)]" /> Company</h3>
                            <div className="space-y-2">
                                {profile?.company && (
                                    <p className="text-[var(--text-primary)] font-semibold text-lg">{profile.company}</p>
                                )}
                                {profile?.companyWebsite && (
                                    <a
                                        href={profile.companyWebsite}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-[var(--accent)] hover:underline text-sm font-medium"
                                    >
                                        <ExternalLink className="w-4 h-4" /> {profile.companyWebsite}
                                    </a>
                                )}
                                {!profile?.company && <p className="text-[var(--text-secondary)] text-sm italic opacity-50">No company details added yet.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showEditModal && (
                <EditProfile
                    user={profile}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleProfileSave}
                />
            )}
        </div>
    );
};

export default ProfilePage;
