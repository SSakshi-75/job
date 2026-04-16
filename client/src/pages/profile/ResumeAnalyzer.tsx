import { useState } from "react";
import { useSelector } from "react-redux";
import { FileText, Upload, Zap, CheckCircle2, AlertCircle, Star, TrendingUp, BookOpen, ArrowRight, Loader2, Target, Award } from "lucide-react";
import api from "../../services/api";

const ResumeAnalyzer = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!user?.resume) {
            setError("Please upload your resume first from your Profile page.");
            return;
        }
        setAnalyzing(true);
        setError("");
        setResult(null);
        try {
            const res = await api.post("/user/analyze-resume");
            setResult(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Analysis failed. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    const scoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600";
        if (score >= 60) return "text-blue-600";
        if (score >= 40) return "text-amber-600";
        return "text-rose-500";
    };

    const scoreBg = (score: number) => {
        if (score >= 80) return "from-emerald-500 to-teal-400";
        if (score >= 60) return "from-blue-500 to-cyan-400";
        if (score >= 40) return "from-amber-400 to-orange-400";
        return "from-rose-500 to-pink-400";
    };

    return (
        <div className="min-h-screen bg-[#F8F7F2] pb-20">
            {/* Header */}
            <div className="bg-[#0F172A] border-b border-slate-800 mb-10">
                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-6">
                        <Zap className="w-3.5 h-3.5" /> AI-Powered Feature
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
                        Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Analyzer</span>
                    </h1>
                    <p className="text-slate-400 font-medium max-w-xl">
                        Let our AI scan your resume and give you actionable feedback to land more interviews.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4">
                {/* Resume Status Card */}
                <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${user?.resume ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
                                <FileText className={`w-8 h-8 ${user?.resume ? 'text-emerald-600' : 'text-slate-300'}`} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 mb-1">
                                    {user?.resume ? "Resume Uploaded ✅" : "No Resume Found"}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium">
                                    {user?.resume 
                                        ? "Your resume is ready to be analyzed by AI."
                                        : "Upload your resume from Profile → Resume section first."
                                    }
                                </p>
                            </div>
                        </div>
                        {!user?.resume && (
                            <a href="/profile" className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white text-sm font-black rounded-2xl transition-all shadow-lg">
                                <Upload className="w-4 h-4" /> Upload Resume
                            </a>
                        )}
                    </div>
                </div>

                {/* Analyze Button */}
                <div className="text-center mb-10">
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing || !user?.resume}
                        className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-none disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none text-white font-black text-lg rounded-[20px] transition-all shadow-2xl shadow-blue-500/30 hover:-translate-y-1 active:translate-y-0"
                    >
                        {analyzing ? (
                            <><Loader2 className="w-6 h-6 animate-spin" /> {user?.resume ? "Processing Resume Content..." : "Analyzing Profile..."}</>
                        ) : (
                            <><Zap className="w-6 h-6" /> Run AI Analysis</>
                        )}
                    </button>
                    {!user?.resume && (
                        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                             Analysis is locked until you upload a resume
                        </p>
                    )}
                    {error && (
                        <p className="mt-4 text-rose-500 text-sm font-bold flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </p>
                    )}
                </div>

                {/* Results */}
                {result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Results Summary & Detected Skills */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Score Card (Full Width) */}
                            <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200/60 p-8 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 right-0 px-4 py-2 bg-slate-50 border-l border-b border-slate-100 rounded-bl-2xl">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Mode: {result.analysisType === "resume" ? "Full PDF Scan" : "Profile Analysis"}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="relative w-36 h-36 shrink-0">
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${scoreBg(result.overallScore ?? 0)} opacity-10`}></div>
                                        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-inner">
                                            <div className="text-center">
                                                <div className={`text-4xl font-black ${scoreColor(result.overallScore ?? 0)}`}>{result.overallScore ?? 0}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">/100</div>
                                            </div>
                                        </div>
                                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                                                strokeDasharray={`${(result.overallScore ?? 0) * 2.83} ${283 - (result.overallScore ?? 0) * 2.83}`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                            <defs>
                                                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#3b82f6"/>
                                                    <stop offset="100%" stopColor="#06b6d4"/>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">Resume Score</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed">{result.summary}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detected Skills Hub (New Section) */}
                            <div className="bg-[#0F172A] rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Zap className="w-20 h-20 text-white" />
                                </div>
                                <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                     Skills Detected
                                </h3>
                                <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                                    {result.matched?.length > 0 ? (
                                        result.matched.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl text-[10px] font-bold transition-all">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="text-slate-400 text-xs italic space-y-2">
                                            <p>No technical skills detected yet.</p>
                                            <p className="text-[10px] opacity-70">Tip: Ensure your resume is not just a scanned image.</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence Score</span>
                                        <span className="text-xs font-black text-white">High AI Confidence</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-white rounded-[32px] border border-emerald-100 p-8 shadow-sm">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-emerald-500" /> Key Strengths
                                </h3>
                                <div className="space-y-4">
                                    {result.strengths?.map((s: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-2xl">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-bold text-slate-700">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Areas to Improve */}
                            <div className="bg-white rounded-[32px] border border-amber-100 p-8 shadow-sm">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-amber-500" /> Improvement Tips
                                </h3>
                                <div className="space-y-4">
                                    {result.improvements?.map((s: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-2xl">
                                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-bold text-slate-700">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommended Skills */}
                            <div className="bg-white rounded-[32px] border border-blue-100 p-8 shadow-sm">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-500" /> Missing High-Demand Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.recommendedSkills?.map((skill: string, i: number) => (
                                        <span key={i} className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-black">
                                            + {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Matching Jobs */}
                            <div className="bg-white rounded-[32px] border border-purple-100 p-8 shadow-sm">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-purple-500" /> Best Career Path
                                </h3>
                                <div className="space-y-3">
                                    {result.bestMatches?.map((role: string, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                                            <span className="text-sm font-bold text-slate-700">{role}</span>
                                            <Award className="w-4 h-4 text-purple-500" />
                                        </div>
                                    ))}
                                </div>
                                <a href="/jobs" className="mt-6 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:gap-3 transition-all">
                                    Browse Matching Jobs <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeAnalyzer;
