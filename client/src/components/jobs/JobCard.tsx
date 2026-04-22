import { MapPin, Clock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SERVER_URL } from "../../services/api";

interface JobCardProps {
    job: any;
}

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
    "full-time":  { bg: "bg-emerald-50",  text: "text-emerald-700",  border: "border-emerald-200" },
    "part-time":  { bg: "bg-violet-50",   text: "text-violet-700",   border: "border-violet-200"  },
    "remote":     { bg: "bg-sky-50",      text: "text-sky-700",      border: "border-sky-200"     },
    "internship": { bg: "bg-amber-50",    text: "text-amber-700",    border: "border-amber-200"   },
    "contract":   { bg: "bg-rose-50",     text: "text-rose-700",     border: "border-rose-200"    },
};

function getTimeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1d ago";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
}

function formatSalary(val: number) {
    if (!val) return "0";
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
}

const JobCard = ({ job }: JobCardProps) => {
    const topBrandLogos: any = {
        "Google":         "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png",
        "Microsoft":      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        "Tesla":          "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
        "Netflix":        "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        "Spotify":        "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg",
        "Sportify":       "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg",
        "SpaceX":         "https://upload.wikimedia.org/wikipedia/commons/3/36/SpaceX-Logo.svg",
        "Amazon":         "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "Apple":          "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        "Cloud Solutions":"https://cdn-icons-png.flaticon.com/512/5968/5968267.png",
        "Creative Studio":"https://cdn-icons-png.flaticon.com/512/3659/3659030.png",
        "StartUp Inc":    "https://cdn-icons-png.flaticon.com/512/261/261768.png",
    };

    let logoUrl = job.companyLogo || topBrandLogos[job.company] || null;
    if (logoUrl && logoUrl.startsWith("/uploads")) {
        logoUrl = `${SERVER_URL}${logoUrl}`;
    }
    const typeKey = (job.type || "").toLowerCase();
    const typeStyle = typeColors[typeKey] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
    const skills: string[] = job.skills?.slice(0, 4) || [];

    return (
        <div className="group relative bg-white rounded-3xl border border-slate-200/70 overflow-hidden flex flex-col hover:shadow-[0_8px_40px_rgba(99,102,241,0.13)] hover:border-indigo-300/60 transition-all duration-400 cursor-default">

            {/* Top gradient accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-5 flex flex-col flex-1 gap-4">

                {/* Header: Logo + Title + Verified */}
                <div className="flex items-start gap-3.5">
                    {/* Logo */}
                    <div className="w-12 h-12 flex-shrink-0 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-indigo-200 transition-colors duration-300">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={job.company}
                                className="w-full h-full object-contain p-1.5"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                            />
                        ) : (
                            <span className="text-lg font-black text-indigo-400">
                                {job.company?.[0]?.toUpperCase() || "?"}
                            </span>
                        )}
                    </div>

                    {/* Title + Company */}
                    <div className="flex-1 min-w-0">
                        <h3
                            className="text-[15px] font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors duration-300 leading-snug line-clamp-2 tracking-tight"
                            title={job.title}
                        >
                            {job.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate uppercase tracking-wider">
                            {job.company}
                        </p>
                    </div>

                    {/* Verified badge */}
                    <div className="flex-shrink-0 flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Verified</span>
                    </div>
                </div>

                {/* Salary + Work Mode chips */}
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-[11px] font-bold">
                        💰 {formatSalary(job.salary?.min)} – {formatSalary(job.salary?.max)}
                    </span>
                    <span className={`px-3 py-1.5 ${typeStyle.bg} ${typeStyle.text} border ${typeStyle.border} rounded-xl text-[11px] font-bold capitalize`}>
                        {job.type || "Full-time"}
                    </span>
                    {job.experience && (
                        <span className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-xl text-[11px] font-bold">
                            🎯 {job.experience}
                        </span>
                    )}
                </div>

                {/* Description */}
                {job.description && (
                    <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2 font-medium">
                        {job.description}
                    </p>
                )}

                {/* Skill Tags */}
                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors duration-200 cursor-default"
                            >
                                {skill}
                            </span>
                        ))}
                        {(job.skills?.length || 0) > 4 && (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold">
                                +{job.skills.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Footer: Location + Time + Button */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-1 min-w-0">
                        {job.location && (
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide truncate">
                                <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                                <span className="truncate">{job.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                            <Clock className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                            {getTimeAgo(job.createdAt)}
                        </div>
                    </div>

                    <Link
                        to={`/jobs/${job._id}`}
                        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95"
                    >
                        View Details
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
