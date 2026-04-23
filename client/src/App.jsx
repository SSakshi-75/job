import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase } from "lucide-react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/profile/ProfilePage";
import PostJob from "./pages/recruiter/PostJob";
import MyJobs from "./pages/recruiter/MyJobs";
import Applicants from "./pages/recruiter/Applicants";
import JobListing from "./pages/jobs/JobListing";
import JobDetails from "./pages/jobs/JobDetails";
import AppliedJobs from "./pages/jobs/AppliedJobs";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import RecruiterLogin from "./pages/recruiter/RecruiterLogin";
import RecruiterRegister from "./pages/recruiter/RecruiterRegister";
import About from "./pages/About";
import CompanyListing from "./pages/companies/CompanyListing";
import ResumeAnalyzer from "./pages/profile/ResumeAnalyzer";
import InterviewScheduling from "./pages/interviews/InterviewScheduling";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";

const Home = () => {
    return (
        <div className="bg-(--bg-main)">
            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-400 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-blue-300 rounded-full blur-[70px] md:blur-[100px]"></div>
                </div>

                <div className="max-w-6xl w-full px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-10 md:py-16">
                    {/* Text Content */}
                    <div className="space-y-5 md:space-y-6 text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none md:leading-[0.95]">
                            Build your <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">dream career</span> <br className="hidden sm:block" /> with ease.
                        </h1>

                        <p className="max-w-md lg:mx-0 mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                            Connect with top-tier companies and talented recruiters. AI-powered matching that actually works for you.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 pt-2 md:pt-4 lg:justify-start justify-center">
                            <Link to="/jobs" className="w-full sm:w-auto btn-primary !px-8 md:!px-10 !py-3.5 md:!py-4.5 !text-base md:!text-lg !rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center gap-3 justify-center">
                                 <Briefcase className="w-5 h-5" /> Explore Jobs
                            </Link>
                            <Link to="/companies" className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4.5 text-base md:text-lg font-bold text-slate-900 border-2 border-slate-200 hover:border-blue-500/30 rounded-2xl bg-white hover:bg-slate-50 transition-all text-center flex items-center justify-center">
                                Browse Companies
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 pt-8 md:pt-12">
                            <div className="text-center lg:text-left">
                                <div className="text-2xl md:text-3xl font-black text-slate-900">500k+</div>
                                <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">Active Jobs</div>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                            <div className="text-center lg:text-left">
                                <div className="text-2xl md:text-3xl font-black text-slate-900">1.2M</div>
                                <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">Hired Pros</div>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                            <div className="text-center lg:text-left">
                                <div className="text-2xl md:text-3xl font-black text-slate-900">10k+</div>
                                <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">Top Companies</div>
                            </div>
                        </div>
                    </div>

                    {/* Visual / Image Side */}
                    <div className="relative group hidden lg:block">
                        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent rounded-[40px] -rotate-3 group-hover:rotate-0 transition-all duration-700"></div>
                        <div className="relative overflow-hidden rounded-[40px] border-12 border-white shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700">
                            <img 
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop" 
                                alt="Professional Networking" 
                                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-blue-900/40 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="py-16 md:py-24 bg-white transition-colors">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-4">Why Choose Us</span>
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Everything you need to <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">land your dream job</span></h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { icon: "🎯", title: "AI-Powered Matching", desc: "Our smart algorithm matches your skills with the perfect opportunities automatically.", link: "/jobs" },
                            { icon: "📊", title: "Resume Analyzer", desc: "Get instant feedback on your resume with AI-driven insights and improvement tips.", link: "/resume-analyzer" },
                            { icon: "🔔", title: "Real-time Alerts", desc: "Never miss an opportunity with instant notifications for new matching jobs.", link: "/jobs" },
                            { icon: "🏢", title: "Top Companies", desc: "Access exclusive listings from 10,000+ verified companies across industries.", link: "/companies" },
                        { icon: "📅", title: "Interview Scheduling", desc: "Seamless interview booking and management with calendar integration.", link: "/interviews" },
                        ].map((feature, i) => (
                            <Link to={feature.link} key={i} className="group block p-6 md:p-8 bg-slate-50 hover:bg-white rounded-3xl border border-slate-100 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                                <div className="text-3xl md:text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{feature.icon}</div>
                                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS SECTION ===== */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-4">How It Works</span>
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Get hired in <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">3 simple steps</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {[
                            { step: "01", title: "Create Profile", desc: "Sign up and build your professional profile with skills, experience, and resume." },
                            { step: "02", title: "Discover Jobs", desc: "Browse AI-curated job listings that match your skills and career goals." },
                            { step: "03", title: "Get Hired", desc: "Apply with one click, schedule interviews, and land your dream role." },
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                    {item.step}
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-sm md:text-base text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="relative bg-[#0F172A] rounded-[32px] md:rounded-[40px] p-8 md:p-16 text-center overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px]"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-4">Ready to start your journey?</h2>
                            <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto text-sm md:text-base">Join thousands of professionals who found their dream careers through CareerConnect.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register" className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-all text-base md:text-lg text-center">
                                    Get Started Free
                                </Link>
                                <Link to="/jobs" className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 border-2 border-slate-600 hover:border-blue-500 text-white font-bold rounded-2xl transition-all text-base md:text-lg text-center">
                                    Browse Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-slate-200 py-8 md:py-12 bg-white transition-colors">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm font-bold text-slate-500">© 2026 CareerConnect. All rights reserved.</div>
                        <div className="flex items-center gap-6">
                            <Link to="/about" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">About</Link>
                            <Link to="/jobs" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Jobs</Link>
                            <Link to="/companies" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Companies</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Renders different home page based on role
const RoleHome = () => {
    const { user } = useSelector((state) => state.auth);
    if (user?.role === "recruiter") return <RecruiterDashboard />;
    return <Home />;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
                <Navbar />
                <div className="flex-1 mx-auto w-full">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <RoleHome />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/jobs" element={
                            <ProtectedRoute>
                                <JobListing />
                            </ProtectedRoute>
                        } />
                        <Route path="/companies" element={
                            <ProtectedRoute>
                                <CompanyListing />
                            </ProtectedRoute>
                        } />
                        <Route path="/jobs/:id" element={
                            <ProtectedRoute>
                                <JobDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/applications" element={
                            <ProtectedRoute allowedRoles={['job-seeker']}>
                                <AppliedJobs />
                            </ProtectedRoute>
                        } />
                        <Route path="/resume-analyzer" element={
                            <ProtectedRoute allowedRoles={['job-seeker']}>
                                <ResumeAnalyzer />
                            </ProtectedRoute>
                        } />
                        <Route path="/interviews" element={
                            <ProtectedRoute>
                                <InterviewScheduling />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/recruiter/login" element={<RecruiterLogin />} />
                        <Route path="/recruiter/register" element={<RecruiterRegister />} />
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/post-job" element={
                            <ProtectedRoute allowedRoles={['recruiter']}>
                                <PostJob />
                            </ProtectedRoute>
                        } />
                        <Route path="/my-jobs" element={
                            <ProtectedRoute allowedRoles={['recruiter']}>
                                <MyJobs />
                            </ProtectedRoute>
                        } />
                        <Route path="/jobs/:jobId/applicants" element={
                            <ProtectedRoute allowedRoles={['recruiter']}>
                                <Applicants />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
