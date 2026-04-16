import { Link } from "react-router-dom";
import { Shield, Target, Users, Zap, CheckCircle2 } from "lucide-react";

const About = () => {
    return (
        <div className="relative min-h-[calc(100vh-72px)] flex flex-col items-center py-16 md:py-24 px-4 overflow-hidden bg-(--bg-main)">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none opacity-10">
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-300 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-blue-200 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-5xl w-full space-y-16 animate-in fade-in slide-in-from-bottom duration-1000">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-black uppercase tracking-widest text-blue-700">Driven by Purpose</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
                        Our Mission is to <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 text-6xl md:text-8xl">Empower Careers.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600 font-medium leading-relaxed">
                        We are building a smarter, faster, and more beautiful way to hire and get hired.
                        Our platform connects world-class talent with thriving companies through technology that feels human.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    <div className="glass-card p-8! space-y-4 hover:border-blue-500/30 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                            <Zap className="w-6 h-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Innovation Fast</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                            We ship features that solve real problems, faster than the industry standard.
                        </p>
                    </div>

                    <div className="glass-card p-8! space-y-4 hover:border-blue-500/30 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                            <Users className="w-6 h-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">People First</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                            Every connection on our platform represents a life-changing opportunity.
                        </p>
                    </div>

                    <div className="glass-card p-8! space-y-4 hover:border-blue-500/30 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                            <Shield className="w-6 h-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Trust & Privacy</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                            Your data and your career journey are protected with industry-leading security.
                        </p>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="pt-20 text-center">
                    <div className="max-w-3xl mx-auto p-10 bg-slate-50 rounded-[40px] border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
                        <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Ready to join the movement?</h2>
                        <p className="text-slate-500 font-medium mb-8">Thousands of professionals are already growing their careers with our platform. Join them today.</p>
                        <div className="flex justify-center">
                            <Link to="/register" className="btn-primary !px-12 !py-4 shadow-xl shadow-blue-500/20">Get Started Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
