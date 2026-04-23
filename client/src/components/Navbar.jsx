import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Briefcase, LogOut, User, Menu, X,
    PlusCircle, Search, Shield,
    LayoutDashboard, Calendar, FileText,
    Sun, Moon
} from "lucide-react";
import { logout } from "../redux/slices/authSlice";
import { SERVER_URL } from "../services/api";
import NotificationBell from "./NotificationBell";

// ── Nav config per role ────────────────────────────────────────────
const NAV_LINKS = {
    "job-seeker": [
        { label: "Home", to: "/", icon: LayoutDashboard },
        { label: "Find Jobs", to: "/jobs", icon: Search },
        { label: "Applications", to: "/applications", icon: FileText },
        { label: "Interviews", to: "/interviews", icon: Calendar },
    ],
    "recruiter": [
        { label: "Dashboard", to: "/", icon: LayoutDashboard },
        { label: "My Jobs", to: "/my-jobs", icon: Briefcase },
        { label: "Post Job", to: "/post-job", icon: PlusCircle },
        { label: "Interviews", to: "/interviews", icon: Calendar },
    ],
    "admin": [
        { label: "Dashboard", to: "/admin", icon: Shield },
    ] };

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const role = user?.role || "job-seeker";

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };



    const navLinks = NAV_LINKS[role] || [
        { label: "Home", to: "/", icon: LayoutDashboard },
        { label: "Find Jobs", to: "/jobs", icon: Search },
        { label: "About", to: "/about", icon: null },
    ];

    const isActive = (to) =>
        to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

    return (
        <nav className="sticky top-0 z-[1000] bg-white border-b border-slate-200 shadow-sm h-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 h-full">
                <div className="flex items-center justify-between h-full gap-4">

                    {/* Logo */}
                    <div className="shrink-0">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-105 transition-all duration-300">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900 hidden sm:block">
                                Career<span className="text-indigo-600">Nexus</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav Links — role aware */}
                    {user && (
                        <div className="hidden lg:flex items-center gap-1 flex-1 px-6">
                            {navLinks.map(({ label, to, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${isActive(to)
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                        }`}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right section */}
                    <div className="flex items-center gap-2 shrink-0">


                        {user ? (
                            <div className="flex items-center gap-2">
                                {/* Notifications */}
                                <NotificationBell />

                                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

                                {/* Profile */}
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 text-slate-900 hover:bg-slate-100 p-1.5 rounded-2xl transition-all border border-transparent hover:border-slate-200"
                                >
                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden shadow-sm">
                                        {user.profilePicture ? (
                                            <img
                                                src={`${SERVER_URL}${user.profilePicture}`}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target).style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <User className="w-4.5 h-4.5 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="hidden sm:flex flex-col text-left overflow-hidden pr-1">
                                        <span className="text-sm font-black truncate max-w-[90px] text-slate-900 leading-none mb-0.5">
                                            {user.name?.split(" ")[0]}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-tight">
                                            {role.replace("-", " ")}
                                        </span>
                                    </div>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="hidden sm:block p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 px-3 py-2 transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="text-sm font-bold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md shadow-indigo-500/20">
                                    Join Now
                                </Link>
                            </div>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 z-[999] shadow-xl max-h-[calc(100vh-64px)] overflow-y-auto animate-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-5 space-y-4">



                        {/* User info */}
                        {user && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 text-indigo-600 font-black text-sm shrink-0">
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-900">{user.name}</div>
                                    <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">{role.replace("-", " ")}</div>
                                </div>
                            </div>
                        )}

                        {/* Nav links */}
                        {user && (
                            <div className="grid grid-cols-2 gap-2">
                                {navLinks.map(({ label, to, icon: Icon }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive(to)
                                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                            : "bg-slate-50 text-slate-700 border border-slate-100 hover:bg-slate-100"
                                            }`}
                                    >
                                        {Icon && <Icon className="w-4 h-4 shrink-0" />}
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Extra links for non-logged-in */}
                        {!user && (
                            <div className="grid grid-cols-2 gap-3">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center py-3 bg-slate-100 rounded-xl font-bold text-sm text-slate-700">Sign In</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center py-3 bg-indigo-600 rounded-xl font-bold text-sm text-white">Join Now</Link>
                            </div>
                        )}

                        {/* Profile + Logout */}
                        {user && (
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-700 border border-slate-100 rounded-xl text-sm font-bold"
                                >
                                    <User className="w-4 h-4" /> Profile
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
