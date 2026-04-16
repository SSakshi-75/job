import { useState, useEffect } from "react";
import {
    getAdminStats, getAllUsers, getAllJobs,
    toggleBanUser, deleteJobAdmin, deleteUserAdmin,
    changeUserRole, toggleJobStatus,
    getAllApplicationsAdmin, deleteApplicationAdmin,
    getAllInterviewsAdmin, deleteInterviewAdmin,
} from "../../services/adminService";
import {
    Loader2, Users, Briefcase, FileText, Ban, Trash2,
    Shield, Building, Search, Globe, ChevronDown, ToggleLeft, ToggleRight,
    Video, Calendar, UserCheck, ClipboardList
} from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_COLORS: Record<string, string> = {
    pending:  "bg-amber-50 text-amber-600 border-amber-100",
    reviewed: "bg-blue-50 text-blue-600 border-blue-100",
    accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
};

const AdminDashboard = () => {
    const [stats, setStats]         = useState<any>(null);
    const [users, setUsers]         = useState<any[]>([]);
    const [jobs, setJobs]           = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [interviews, setInterviews]     = useState<any[]>([]);
    const [loading, setLoading]     = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [error, setError]         = useState<string | null>(null);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [jobSearchQuery, setJobSearchQuery]   = useState("");
    const [appSearchQuery, setAppSearchQuery]   = useState("");
    const [showSuspiciousOnly, setShowSuspiciousOnly] = useState(false);
    const [roleDropdown, setRoleDropdown] = useState<string | null>(null);

    const dispatch  = useDispatch();
    const navigate  = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsRes, usersRes, jobsRes, appsRes, intRes] = await Promise.all([
                getAdminStats(),
                getAllUsers(),
                getAllJobs(),
                getAllApplicationsAdmin(),
                getAllInterviewsAdmin(),
            ]);

            const formattedStats = { ...statsRes.data };
            if (formattedStats.charts) {
                formattedStats.charts.userGrowth = (formattedStats.charts.userGrowth || []).map((item: any) => ({
                    name: MONTHS[item._id - 1] || item._id,
                    Users: item.count
                }));
                formattedStats.charts.jobVolume = (formattedStats.charts.jobVolume || []).map((item: any) => ({
                    name: MONTHS[item._id - 1] || item._id,
                    Jobs: item.count
                }));
            }

            setStats(formattedStats);
            setUsers(usersRes.data || []);
            setJobs(jobsRes.data || []);
            setApplications(appsRes.data || []);
            setInterviews(intRes.data || []);
        } catch (error: any) {
            console.error("Failed to fetch admin data", error);
            if (error?.response?.status === 401) {
                dispatch(logout());
                navigate("/login");
            } else {
                setError("Failed to load dashboard data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── User Actions ──
    const handleBanToggle = async (id: string) => {
        if (!window.confirm("Ban/Unban this user?")) return;
        try { await toggleBanUser(id); fetchData(); }
        catch { alert("Action failed (Admin protection)."); }
    };

    const handleDeleteUser = async (id: string, name: string) => {
        if (!window.confirm(`DELETE user "${name}" and ALL their data permanently?`)) return;
        try { await deleteUserAdmin(id); fetchData(); }
        catch { alert("Delete failed."); }
    };

    const handleRoleChange = async (id: string, role: string) => {
        try { await changeUserRole(id, role); setRoleDropdown(null); fetchData(); }
        catch (e: any) { alert(e?.response?.data?.message || "Role change failed."); }
    };

    // ── Job Actions ──
    const handleDeleteJob = async (id: string) => {
        if (!window.confirm("Force delete this job and all its applications?")) return;
        try { await deleteJobAdmin(id); fetchData(); }
        catch { alert("Delete failed."); }
    };

    const handleToggleJobStatus = async (id: string) => {
        try { await toggleJobStatus(id); fetchData(); }
        catch { alert("Status toggle failed."); }
    };

    // ── Application Actions ──
    const handleDeleteApp = async (id: string) => {
        if (!window.confirm("Delete this application?")) return;
        try { await deleteApplicationAdmin(id); fetchData(); }
        catch { alert("Delete failed."); }
    };

    // ── Interview Actions ──
    const handleDeleteInterview = async (id: string) => {
        if (!window.confirm("Delete this interview?")) return;
        try { await deleteInterviewAdmin(id); fetchData(); }
        catch { alert("Delete failed."); }
    };

    const isJobSuspicious = (job: any) => {
        const suspiciousKeywords = ["easy money","guaranteed","crypto","investment","whatsapp","telegram","pay first","no experience required","cash","urgent hiring without interview","click link"];
        const textToSearch = `${job.title} ${job.description} ${job.requirements?.join(" ")}`.toLowerCase();
        let score = 0;
        suspiciousKeywords.forEach(kw => { if (textToSearch.includes(kw)) score++; });
        if (job.salary?.max > 5000000 && job.salary?.min < 100000) score++;
        if (job.description && job.description.length < 50) score++;
        return score >= 1;
    };

    if (loading && !stats) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-[#FDFCF8]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] bg-[#FDFCF8]">
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex flex-col items-center gap-3">
                    <p className="font-bold">{error}</p>
                    <button onClick={fetchData} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow hover:bg-red-700 transition">Retry</button>
                </div>
            </div>
        );
    }

    const TABS = [
        { id: "overview",      label: "Analytics",     icon: <Globe className="w-3.5 h-3.5" /> },
        { id: "users",         label: "Users",          icon: <Users className="w-3.5 h-3.5" /> },
        { id: "jobs",          label: "Jobs",           icon: <Briefcase className="w-3.5 h-3.5" /> },
        { id: "applications",  label: "Applications",   icon: <ClipboardList className="w-3.5 h-3.5" /> },
        { id: "interviews",    label: "Interviews",     icon: <Video className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCF8] pb-20" onClick={() => setRoleDropdown(null)}>
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                            <div className="p-3 bg-slate-900 rounded-3xl shadow-xl shadow-slate-900/10">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            Command Center
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mt-3 ml-1">
                            Full System Control &amp; Governance
                        </p>
                    </div>
                    {/* Quick stats pills */}
                    {stats && (
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-black text-slate-700">{stats.metrics.totalUsers} Users</span>
                            </div>
                            <div className="px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-black text-slate-700">{stats.metrics.totalJobs} Jobs</span>
                            </div>
                            <div className="px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-violet-500" />
                                <span className="text-xs font-black text-slate-700">{stats.metrics.totalApplications} Apps</span>
                            </div>
                            <div className="px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2">
                                <Video className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-black text-slate-700">{interviews.length} Interviews</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap bg-slate-200/50 p-1 rounded-2xl w-fit mb-10 border border-slate-200/50 shadow-inner gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === tab.id ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            {tab.icon}{tab.label}
                        </button>
                    ))}
                </div>

                {/* ── ANALYTICS ── */}
                {activeTab === "overview" && stats && (
                    <div className="space-y-10 animate-in fade-in duration-700">
                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Total Users",    value: stats.metrics.totalUsers,        icon: <Users className="w-7 h-7" />,    color: "bg-blue-50 text-blue-600" },
                                { label: "Employers",      value: stats.metrics.totalRecruiters,   icon: <Building className="w-7 h-7" />, color: "bg-indigo-50 text-indigo-600" },
                                { label: "Live Jobs",      value: stats.metrics.totalJobs,         icon: <Briefcase className="w-7 h-7" />,color: "bg-emerald-50 text-emerald-600" },
                                { label: "Applications",   value: stats.metrics.totalApplications, icon: <FileText className="w-7 h-7" />, color: "bg-rose-50 text-rose-600" },
                            ].map((kpi) => (
                                <div key={kpi.label} className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500">
                                    <div className={`w-14 h-14 ${kpi.color} rounded-2xl flex items-center justify-center mb-6`}>{kpi.icon}</div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">{kpi.label}</p>
                                    <h3 className="text-4xl font-black text-slate-900 leading-none">{kpi.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {[
                                { title: "Growth Analytics", badge: "Users", color: "#2563eb", grad: "userGrad", data: stats.charts.userGrowth, dataKey: "Users" },
                                { title: "Job Volume",       badge: "Jobs",  color: "#10b981", grad: "jobGrad",  data: stats.charts.jobVolume,  dataKey: "Jobs"  },
                            ].map(chart => (
                                <div key={chart.title} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{chart.title}</h3>
                                        <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">{chart.badge}</span>
                                    </div>
                                    <div className="h-[280px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chart.data}>
                                                <defs>
                                                    <linearGradient id={chart.grad} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%"  stopColor={chart.color} stopOpacity={0.15} />
                                                        <stop offset="95%" stopColor={chart.color} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "900", fill: "#94a3b8" }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "900", fill: "#94a3b8" }} />
                                                <Tooltip contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)", fontWeight: "bold" }} />
                                                <Area type="monotone" dataKey={chart.dataKey} stroke={chart.color} strokeWidth={4} fillOpacity={1} fill={`url(#${chart.grad})`} strokeLinecap="round" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── USERS ── */}
                {activeTab === "users" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-visible">
                            <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row gap-6 items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-slateate-900 leading-none">User Directory</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{users.length} Registered Identities</p>
                                </div>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or role..."
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl text-[11px] font-black outline-none border border-transparent focus:border-blue-500/20 transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FBFAF5]">
                                        <tr>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Identity</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Role</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Status</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Joined</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {users.filter(u =>
                                            u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                            u.role.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                            u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                                        ).map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-900/10">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">{user.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Role change dropdown */}
                                                <td className="px-10 py-6 relative" onClick={e => e.stopPropagation()}>
                                                    {user.role === "admin" ? (
                                                        <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">Admin</span>
                                                    ) : (
                                                        <div className="relative inline-block">
                                                            <button
                                                                onClick={() => setRoleDropdown(roleDropdown === user._id ? null : user._id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest transition"
                                                            >
                                                                {user.role} <ChevronDown className="w-3 h-3" />
                                                            </button>
                                                            {roleDropdown === user._id && (
                                                                <div className="absolute top-full left-0 mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[130px]">
                                                                    {["job-seeker", "recruiter"].filter(r => r !== user.role).map(r => (
                                                                        <button
                                                                            key={r}
                                                                            onClick={() => handleRoleChange(user._id, r)}
                                                                            className="w-full px-4 py-3 text-left text-[11px] font-black text-slate-700 hover:bg-slate-50 uppercase tracking-widest transition"
                                                                        >
                                                                            {r}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-10 py-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.isBanned ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                                                        {user.isBanned ? "Banned" : "Active"}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <p className="text-[11px] font-black text-slate-600 tracking-tight">{new Date(user.createdAt).toDateString()}</p>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        {/* Ban/Unban */}
                                                        {user.role !== "admin" && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleBanToggle(user._id)}
                                                                    title={user.isBanned ? "Unban" : "Ban"}
                                                                    className={`p-3 rounded-2xl transition-all shadow-sm ${user.isBanned ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50"}`}
                                                                >
                                                                    <Ban className="w-4 h-4" />
                                                                </button>
                                                                {/* Delete */}
                                                                <button
                                                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                                                    title="Delete User"
                                                                    className="p-3 rounded-2xl bg-slate-100 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── JOBS ── */}
                {activeTab === "jobs" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row gap-6 items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-none">Job Inventory</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{jobs.length} Listings</p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => setShowSuspiciousOnly(!showSuspiciousOnly)}
                                        className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center gap-2 ${showSuspiciousOnly ? "bg-rose-600 text-white" : "bg-white text-rose-600 border border-rose-100 hover:bg-rose-50"}`}
                                    >
                                        <Shield className="w-3.5 h-3.5" /> {showSuspiciousOnly ? "Showing Suspicious" : "Detect Fake"}
                                    </button>
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search jobs..."
                                            value={jobSearchQuery}
                                            onChange={(e) => setJobSearchQuery(e.target.value)}
                                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-2xl text-[11px] font-black outline-none border border-transparent focus:border-blue-500/20 transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-6">
                                {jobs.filter(j => {
                                    const matchSearch = j.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) || j.company.toLowerCase().includes(jobSearchQuery.toLowerCase());
                                    if (showSuspiciousOnly && !isJobSuspicious(j)) return false;
                                    return matchSearch;
                                }).map((job) => {
                                    const suspicious = isJobSuspicious(job);
                                    const isActive = job.status === "active";
                                    return (
                                        <div key={job._id} className={`p-8 border ${suspicious ? "border-rose-300 bg-rose-50/30" : "border-slate-100 bg-[#FBFAF5]/50"} rounded-[40px] flex items-center justify-between group hover:border-slate-300 transition-all duration-300`}>
                                            <div className="flex items-center gap-5">
                                                <div className={`w-14 h-14 ${suspicious ? "bg-rose-100 text-rose-500" : "bg-white text-slate-400"} rounded-3xl flex items-center justify-center shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all duration-500`}>
                                                    <Briefcase className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-base font-black text-slate-900 leading-tight">{job.title}</h4>
                                                        {suspicious && <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-md text-[8px] font-black uppercase tracking-wider">Fake Risk</span>}
                                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                                                            {job.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.company}</p>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.location}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {/* Activate / Deactivate */}
                                                <button
                                                    onClick={() => handleToggleJobStatus(job._id)}
                                                    title={isActive ? "Deactivate Job" : "Activate Job"}
                                                    className={`p-3 rounded-[20px] shadow-sm border transition-all duration-300 ${isActive ? "bg-white text-emerald-500 border-slate-100 hover:bg-slate-100" : "bg-white text-slate-400 border-slate-100 hover:bg-emerald-50 hover:text-emerald-600"}`}
                                                >
                                                    {isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    className="p-3 bg-white hover:bg-rose-600 text-slate-300 hover:text-white rounded-[20px] shadow-sm transition-all duration-300 border border-slate-100 hover:border-rose-600"
                                                    title="Delete Job"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── APPLICATIONS ── */}
                {activeTab === "applications" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row gap-6 items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-none">All Applications</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{applications.length} Total Applications</p>
                                </div>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or job..."
                                        value={appSearchQuery}
                                        onChange={(e) => setAppSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl text-[11px] font-black outline-none border border-transparent focus:border-blue-500/20 transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FBFAF5]">
                                        <tr>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Applicant</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Job</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Recruiter</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Status</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Date</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {applications.filter(a => {
                                            const q = appSearchQuery.toLowerCase();
                                            return (
                                                a.applicant?.name?.toLowerCase().includes(q) ||
                                                a.job?.title?.toLowerCase().includes(q) ||
                                                a.recruiter?.company?.toLowerCase().includes(q)
                                            );
                                        }).map((app) => (
                                            <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-10 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center font-black text-xs">
                                                            {app.applicant?.name?.charAt(0) || "?"}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">{app.applicant?.name || "Unknown"}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold">{app.applicant?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <p className="text-sm font-black text-slate-700">{app.job?.title || "—"}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{app.job?.company}</p>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <p className="text-sm font-bold text-slate-600">{app.recruiter?.name || "—"}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{app.recruiter?.company}</p>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[app.status] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <p className="text-[11px] font-black text-slate-500">{new Date(app.createdAt).toDateString()}</p>
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <button
                                                        onClick={() => handleDeleteApp(app._id)}
                                                        className="p-3 rounded-2xl bg-slate-100 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                        title="Delete Application"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── INTERVIEWS ── */}
                {activeTab === "interviews" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-10 border-b border-slate-50">
                                <h3 className="text-2xl font-black text-slate-900 leading-none">All Interviews</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{interviews.length} Scheduled Interviews</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FBFAF5]">
                                        <tr>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Applicant</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Job</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Recruiter</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Mode</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Scheduled At</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {interviews.map((intv) => (
                                            <tr key={intv._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-10 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black text-xs">
                                                            {intv.applicant?.name?.charAt(0) || "?"}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">{intv.applicant?.name || "Unknown"}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold">{intv.applicant?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <p className="text-sm font-black text-slate-700">{intv.job?.title || "—"}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{intv.job?.company}</p>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <p className="text-sm font-bold text-slate-600">{intv.recruiter?.name || "—"}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{intv.recruiter?.company}</p>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <div className="flex items-center gap-2">
                                                        {intv.mode === "video" ? <Video className="w-4 h-4 text-blue-500" /> : <Calendar className="w-4 h-4 text-slate-400" />}
                                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{intv.mode || "video"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <p className="text-[11px] font-black text-slate-700">{new Date(intv.scheduledAt).toLocaleString()}</p>
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <button
                                                        onClick={() => handleDeleteInterview(intv._id)}
                                                        className="p-3 rounded-2xl bg-slate-100 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                        title="Delete Interview"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
