import { useState, useEffect } from "react";
import { Sparkles, AlertCircle, Loader2, Target, TrendingUp } from "lucide-react";
import { getJobAIAnalysis } from "../services/jobService";

interface AIAnalysis {
    score: number;
    missingSkills: string[];
    feedback: string;
    isRecommended: boolean;
}

const AIJobMatchCard = ({ jobId }: { jobId: string }) => {
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const data = await getJobAIAnalysis(jobId);
                setAnalysis(data);
            } catch (err) {
                console.error("AI Analysis failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [jobId]);

    if (loading) {
        return (
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[200px] shadow-sm">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Calculating Skill Match...</p>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="relative group overflow-hidden bg-slate-900 rounded-[40px] p-8 shadow-2xl transition-all duration-500 hover:translate-y-[-4px]">
            {/* Animated Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px] group-hover:bg-blue-600/30 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-[60px]"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-black text-white tracking-tight">Smart Match AI</h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-3xl font-black text-white">{analysis.score}%</div>
                        <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Compatibility</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-8 border border-white/5">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${analysis.score >= 80 ? 'bg-emerald-500' : analysis.score >= 50 ? 'bg-blue-500' : 'bg-rose-500'}`}
                        style={{ width: `${analysis.score}%` }}
                    />
                </div>

                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="mt-1">
                            <Target className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-300 leading-relaxed">
                            {analysis.feedback}
                        </p>
                    </div>

                    {analysis.missingSkills.length > 0 && (
                        <div className="pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-4 h-4 text-rose-400" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missing Requirements</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.missingSkills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-[11px] font-black uppercase tracking-tight">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-6 mt-4 border-t border-white/5 flex items-center gap-3 text-emerald-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Growth Recommendation Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIJobMatchCard;
