import { Link } from "react-router-dom";
import { MapPin, Clock, DollarSign, Building, ChevronRight } from "lucide-react";

interface JobCardProps {
    job: any;
}

const JobCard = ({ job }: JobCardProps) => {
    return (
        <div className="glass-card !p-4 sm:!p-5 group hover:-translate-y-1 hover:border-[var(--accent)]/50 transition-all duration-300 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center border border-[var(--accent)]/20 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-300 text-[var(--accent)]">
                        <Building className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-1" title={job.title}>{job.title}</h3>
                        <p className="text-[var(--text-secondary)] font-medium text-sm flex items-center gap-2 mt-1">
                            {job.company}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-shrink-0">
                    <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-xs font-bold capitalize whitespace-nowrap">
                        {job.type}
                    </span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold capitalize whitespace-nowrap">
                        {job.experience}
                    </span>
                </div>
            </div>

            <p className="text-[var(--text-secondary)] text-xs mb-4 line-clamp-2 pr-4 flex-grow">
                {job.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--text-secondary)] font-medium mb-4">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[var(--accent)]" /> 
                    <span className="truncate max-w-[120px]" title={job.location}>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-green-400" /> ₹ {job.salary?.min?.toLocaleString("en-IN") || 0} - {job.salary?.max?.toLocaleString("en-IN") || 0}</div>
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-orange-400" /> {new Date(job.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-auto">
                <div className="flex flex-wrap gap-2 overflow-hidden h-6">
                    {job.skills?.slice(0, 3).map((skill: string, index: number) => (
                        <span key={index} className="px-2.5 py-0.5 bg-white/5 border border-[var(--border)] rounded text-xs text-[var(--text-secondary)] whitespace-nowrap">
                            {skill}
                        </span>
                    ))}
                    {job.skills?.length > 3 && (
                        <span className="px-2.5 py-0.5 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded text-xs text-[var(--accent)] font-medium">
                            +{job.skills.length - 3}
                        </span>
                    )}
                </div>
                <Link to={`/jobs/${job._id}`} className="flex items-center gap-1 text-[var(--accent)] font-bold hover:gap-2 transition-all group-hover:pr-2 whitespace-nowrap">
                    View <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
