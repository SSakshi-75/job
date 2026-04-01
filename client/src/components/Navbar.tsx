import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase, LogOut, User, Menu, X, PlusCircle, MessageSquare } from "lucide-react";
import { logout } from "../redux/slices/authSlice";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-[1000] bg-[var(--bg-main)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-[var(--accent)] p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-[var(--text-primary)]">Job Board</span>
                        </Link>
                        
                        <div className="hidden md:flex ml-8 space-x-6">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/jobs" className="nav-link">Find Jobs</Link>
                            <Link to="/about" className="nav-link">About</Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeSwitcher />
                        
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === "recruiter" && (
                                    <div className="flex items-center gap-4">
                                        <Link to="/my-jobs" className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                                            My Jobs
                                        </Link>
                                        <Link to="/post-job" className="btn-primary flex items-center gap-2 py-1.5 px-4 text-sm font-medium">
                                            <PlusCircle className="w-4 h-4" /> Post a Job
                                        </Link>
                                    </div>
                                )}
                                {user.role === "job-seeker" && (
                                    <div className="flex items-center gap-4">
                                        <Link to="/applications" className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                                            Applied Jobs
                                        </Link>
                                    </div>
                                )}
                                {user.role === "admin" && (
                                    <div className="flex items-center gap-4">
                                        <Link to="/admin" className="text-sm font-bold text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
                                            Admin Panel
                                        </Link>
                                    </div>
                                )}
                                
                                <div className="h-4 w-px bg-[var(--border)] mx-1" />
                                
                                <div className="flex items-center gap-3">
                                    <Link to="/messages" className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-all duration-200" title="Messages">
                                        <MessageSquare className="w-5 h-5" />
                                    </Link>
                                    
                                    <Link to="/profile" className="flex items-center gap-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/30">
                                            <User className="w-4 h-4 text-[var(--accent)]" />
                                        </div>
                                        <span className="text-sm font-semibold max-w-[100px] truncate">{user.name}</span>
                                    </Link>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary">Sign In</Link>
                        )}
                    </div>

                    <div className="flex items-center md:hidden gap-3">
                        <ThemeSwitcher />
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[var(--bg-main)] border-b border-[var(--border)] animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-3">
                        <Link to="/" className="block nav-link py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to="/jobs" className="block nav-link py-2" onClick={() => setIsMenuOpen(false)}>Find Jobs</Link>
                        <Link to="/about" className="block nav-link py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
                        
                        <div className="pt-4 border-t border-[var(--border)]">
                            {user ? (
                                <div className="space-y-3">
                                    <Link to="/profile" className="flex items-center gap-3 py-2 text-[var(--text-primary)] font-semibold" onClick={() => setIsMenuOpen(false)}>
                                        <User className="w-5 h-5 text-[var(--accent)]" />
                                        {user.name}
                                    </Link>
                                    {user.role === "recruiter" && (
                                        <>
                                            <Link to="/my-jobs" className="block text-center text-[var(--text-primary)] font-semibold pb-2" onClick={() => setIsMenuOpen(false)}>
                                                My Jobs
                                            </Link>
                                            <Link to="/post-job" className="btn-primary block text-center mt-2" onClick={() => setIsMenuOpen(false)}>
                                                Post a Job
                                            </Link>
                                        </>
                                    )}
                                    {user.role === "job-seeker" && (
                                        <Link to="/applications" className="block text-center text-[var(--text-primary)] font-semibold pb-2" onClick={() => setIsMenuOpen(false)}>
                                            Applied Jobs
                                        </Link>
                                    )}
                                    {user.role === "admin" && (
                                        <Link to="/admin" className="block text-center text-[var(--accent)] font-bold pb-2" onClick={() => setIsMenuOpen(false)}>
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link to="/messages" className="flex items-center gap-3 py-2 text-[var(--text-primary)] font-semibold" onClick={() => setIsMenuOpen(false)}>
                                        <MessageSquare className="w-5 h-5 text-[var(--accent)]" />
                                        Messages
                                    </Link>
                                    <button 
                                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 py-2 text-red-500 font-semibold"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn-primary block text-center" onClick={() => setIsMenuOpen(false)}>
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
