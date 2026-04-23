import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Briefcase, MapPin, ChevronDown } from "lucide-react";
import { getJobs } from "../../services/jobService";
import JobCard from "../../components/jobs/JobCard";
import { JobSkeleton } from "../../components/jobs/JobSkeleton";
import { useLocation } from "react-router-dom";

const JobListing = () => {
    const locationQuery = useLocation();
    const queryParams = new URLSearchParams(locationQuery.search);
    const exploreType = queryParams.get("explore");

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filters, setFilters] = useState({
        type: "",
        experience: "",
        location: "" });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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
            const params = {};
            if (debouncedSearch) params.keyword = debouncedSearch;
            if (filters.type) params.type = filters.type;
            if (filters.experience) params.experience = filters.experience;
            if (filters.location) params.location = filters.location;
            
            if (exploreType === "companies") params.sort = "company";

            const res = await getJobs(params);
            let data = res.data || [];
            if (exploreType === "companies" && !debouncedSearch) {
                data = [...data].sort((a, b) => a.company.localeCompare(b.company));
            }
            setJobs(data);
        } catch (err) {
            console.error("Failed to load jobs", err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, filters, exploreType]);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
            {/* Top Bar with Title and Search */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 md:mb-10">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                        {exploreType === "companies" ? "Browse Companies" : "Explore Careers"}
                    </h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        {jobs.length} Positions Available
                    </p>
                </div>

                <div className="relative w-full max-w-xl group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by role, company or industry..."
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200/40 focus:border-blue-500/30 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:border-blue-500/30 transition-all"
                >
                    <Filter className="w-4 h-4 text-blue-600" />
                    {showMobileFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                {/* Sidebar Filter */}
                <aside className={`w-full lg:w-72 flex-shrink-0 ${showMobileFilters ? "block" : "hidden"} lg:block`}>
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 lg:sticky lg:top-24 shadow-sm">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">Filters</span>
                            </div>
                            <button
                                onClick={() => setFilters({ type: "", experience: "", location: "" })}
                                className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="space-y-6 md:space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Type</label>
                                <div className="relative">
                                    <select 
                                        name="type" 
                                        value={filters.type} 
                                        onChange={handleFilterChange}
                                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 appearance-none outline-none focus:bg-white focus:border-blue-500/30 transition-all cursor-pointer"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="full-time">Full Time (40h+)</option>
                                        <option value="part-time">Part Time</option>
                                        <option value="remote">Remote Global</option>
                                        <option value="internship">Paid Internship</option>
                                        <option value="contract">Freelance/Contract</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seniority</label>
                                <div className="relative">
                                    <select 
                                        name="experience" 
                                        value={filters.experience} 
                                        onChange={handleFilterChange}
                                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 appearance-none outline-none focus:bg-white focus:border-blue-500/30 transition-all cursor-pointer"
                                    >
                                        <option value="">Any Experience</option>
                                        <option value="0-1 years">Fresher (0-1y)</option>
                                        <option value="1-3 years">Junior (1-3y)</option>
                                        <option value="3-5 years">Mid-Level (3-5y)</option>
                                        <option value="5+ years">Senior (5y+)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        name="location" 
                                        placeholder="City or Country" 
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500/30 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Job Content Grid */}
                <main className="flex-1 min-w-0">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                            {[...Array(6)].map((_, i) => <JobSkeleton key={i} />)}
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-100 rounded-[32px] text-center p-10 md:p-20 shadow-sm">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">No Matching Positions Found</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm md:text-base">Try widening your filters or clearing your search to find more opportunities.</p>
                            <button 
                                onClick={() => { setFilters({ type: "", experience: "", location: "" }); setSearchTerm(""); }}
                                className="mt-6 md:mt-8 px-8 md:px-10 py-3 md:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all"
                            >
                                Clear All Search
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );

};

export default JobListing;
