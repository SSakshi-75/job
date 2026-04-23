import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, Globe, ChevronRight, Loader2, Star, ShieldCheck } from "lucide-react";
import api from "../../services/api";

const CompanyListing = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get("/companies");
                setCompanies(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch companies:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(c => 
        (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.location && (c.location || "").toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#FDFCF8] transition-colors">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] pb-20 font-['Outfit'] transition-colors">
            {/* Elegant Header with Dark Slate Gradient */}
            <div className="bg-[#0F172A] border-b border-slate-800 mb-8 md:mb-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-0"></div>
                <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-5 md:mb-8">
                        <ShieldCheck className="w-4 h-4" /> Global Tech Alliances
                    </div>
                    <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight mb-4 md:mb-6">
                        Explore <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">Elite Workspaces</span>
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        Connect with the industry's most ambitious companies building the future of technology.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group mt-8 md:mt-12">
                        <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 md:w-6 h-5 md:h-6 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Target a specific company..." 
                            className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-4 md:py-5 bg-slate-900 border border-slate-700/50 rounded-2xl text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all shadow-2xl text-sm md:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
                    {filteredCompanies.map((company) => (
                        <div key={company.name} className="group bg-white rounded-[40px] border border-slate-200/60 p-8 flex flex-col hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.08)] transition-all duration-700 relative">
                            
                            {/* Logo Section - Clean, No Box, Full View */}
                            <div className="flex items-start justify-between mb-10">
                                <div className="w-16 h-16 flex items-center justify-center transition-transform duration-700 group-hover:scale-110 relative bg-white/50 rounded-2xl overflow-hidden p-1 shadow-sm border border-slate-50">
                                    <img 
                                        src={company.logo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
                                        alt={company.name} 
                                        className="w-full h-full object-contain filter drop-shadow-md transition-all duration-500"
                                        onError={(e) => {
                                            (e.target).src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <div className="flex gap-0.5">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Verified Hub</span>
                                </div>
                            </div>

                            {/* Info Section - Ultra Readable Typography */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-black text-slate-900 mb-2 truncate uppercase tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                                    {company.name}
                                </h3>
                                <div className="flex flex-col gap-2.5 mt-4">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MapPin className="w-4 h-4 shrink-0 text-blue-500/60" />
                                        <span className="text-xs font-black uppercase tracking-widest truncate">{company.location || "Global"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Globe className="w-4 h-4 shrink-0 text-indigo-500/60" />
                                        <span className="text-xs font-black uppercase tracking-widest truncate">{company.industry || "Software"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Area - Integrated Elegance */}
                            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-xl shadow-emerald-500/20"></div>
                                    <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                                        {company.jobCount} <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest ml-0.5">Slots</span>
                                    </span>
                                </div>
                                <Link 
                                    to={`/jobs?company=${company.name}`}
                                    className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 group-hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyListing;
