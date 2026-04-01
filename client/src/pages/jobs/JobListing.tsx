import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Loader2, Briefcase } from "lucide-react";
import { getJobs } from "../../services/jobService";
import JobCard from "../../components/jobs/JobCard";

const JobListing = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filters, setFilters] = useState({
        type: "",
        experience: "",
        location: "",
    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch jobs
    const loadJobs = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (debouncedSearch) params.search = debouncedSearch;
            if (filters.type) params.type = filters.type;
            if (filters.experience) params.experience = filters.experience;
            if (filters.location) params.location = filters.location;

            const res = await getJobs(params);
            setJobs(res.data || []);
        } catch (err) {
            console.error("Failed to load jobs", err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, filters]);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header section */}
            <div className="mb-8 p-6 glass-card bg-[var(--accent)]/5 border border-[var(--accent)]/10">
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Find Your Dream Job</h1>
                <p className="text-[var(--text-secondary)]">Search and filter through the latest job opportunities.</p>
                
                {/* Search Bar */}
                <div className="mt-6 relative max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-[var(--text-secondary)]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by job title, company, or skills..."
                        className="input-field pl-11 py-3.5 text-lg shadow-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-1/4">
                    <div className="glass-card sticky top-24">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--border)]">
                            <Filter className="w-5 h-5 text-[var(--accent)]" />
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">Filters</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Job Type</label>
                                <select 
                                    name="type" 
                                    value={filters.type} 
                                    onChange={handleFilterChange}
                                    className="input-field appearance-none cursor-pointer"
                                >
                                    <option value="">All Types</option>
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="remote">Remote</option>
                                    <option value="internship">Internship</option>
                                    <option value="contract">Contract</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Experience</label>
                                <select 
                                    name="experience" 
                                    value={filters.experience} 
                                    onChange={handleFilterChange}
                                    className="input-field appearance-none cursor-pointer"
                                >
                                    <option value="">Any Experience</option>
                                    <option value="0-1 years">0-1 years (Fresher)</option>
                                    <option value="1-3 years">1-3 years</option>
                                    <option value="3-5 years">3-5 years</option>
                                    <option value="5+ years">5+ years</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Location</label>
                                <input 
                                    type="text" 
                                    name="location" 
                                    placeholder="e.g. Bangalore" 
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    className="input-field"
                                />
                            </div>

                            <button
                                onClick={() => setFilters({ type: "", experience: "", location: "" })}
                                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-medium rounded-lg transition-colors mt-4 border border-[var(--border)]"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Job List */}
                <div className="w-full lg:w-3/4">
                    {loading ? (
                        <div className="flex items-center justify-center p-20 glass-card">
                            <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-[var(--text-secondary)]">Showing {jobs.length} results</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                                {jobs.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card text-center py-20">
                            <Briefcase className="w-16 h-16 text-[var(--text-secondary)]/30 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No jobs found</h3>
                            <p className="text-[var(--text-secondary)]">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilters({ type: "", experience: "", location: "" });
                                }}
                                className="mt-6 btn-primary inline-flex items-center"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobListing;
