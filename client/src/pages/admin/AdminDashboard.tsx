import { useState, useEffect } from "react";
import { getAdminStats, getAllUsers, getAllJobs, toggleBanUser, deleteJobAdmin } from "../../services/adminService";
import { Loader2, Users, Briefcase, FileText, Ban, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, jobsRes] = await Promise.all([
                getAdminStats(),
                getAllUsers(),
                getAllJobs()
            ]);
            
            // Format charts data
            const formattedStats = { ...statsRes.data };
            if (formattedStats.charts) {
                formattedStats.charts.userGrowth = formattedStats.charts.userGrowth.map((item: any) => ({
                    name: MONTHS[item._id - 1] || item._id,
                    Users: item.count
                }));
                formattedStats.charts.jobVolume = formattedStats.charts.jobVolume.map((item: any) => ({
                    name: MONTHS[item._id - 1] || item._id,
                    Jobs: item.count
                }));
            }
            
            setStats(formattedStats);
            setUsers(usersRes.data || []);
            setJobs(jobsRes.data || []);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBanToggle = async (id: string) => {
        if (window.confirm("Are you sure you want to toggle ban status for this user?")) {
            try {
                await toggleBanUser(id);
                fetchData(); // refresh data
            } catch (error) {
                console.error("Failed to toggle ban", error);
                alert("Cannot ban this user (Admin protection).");
            }
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (window.confirm("WARNING: Force delete this job and all its applications?")) {
            try {
                await deleteJobAdmin(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete job", error);
            }
        }
    };

    if (loading && !stats) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-8">Admin Control Panel</h1>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-4 mb-8 pb-2 border-b border-[var(--border)]">
                <button 
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "overview" ? "bg-[var(--accent)] text-[var(--bg-main)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                >
                    Overview & Stats
                </button>
                <button 
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "users" ? "bg-[var(--accent)] text-[var(--bg-main)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                >
                    User Management
                </button>
                <button 
                    onClick={() => setActiveTab("jobs")}
                    className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "jobs" ? "bg-[var(--accent)] text-[var(--bg-main)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                >
                    Content & Jobs
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && stats && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-[var(--accent)]">
                            <div className="bg-[var(--accent)]/10 p-4 rounded-xl text-[var(--accent)]">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wider">Total Users</p>
                                <h3 className="text-3xl font-black text-[var(--text-primary)]">{stats.metrics.totalUsers}</h3>
                            </div>
                        </div>
                        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-purple-500">
                            <div className="bg-purple-500/10 p-4 rounded-xl text-purple-400">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wider">Total Seekers</p>
                                <h3 className="text-3xl font-black text-[var(--text-primary)]">{stats.metrics.totalSeekers}</h3>
                            </div>
                        </div>
                        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-blue-500">
                            <div className="bg-blue-500/10 p-4 rounded-xl text-blue-400">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wider">Total Jobs</p>
                                <h3 className="text-3xl font-black text-[var(--text-primary)]">{stats.metrics.totalJobs}</h3>
                            </div>
                        </div>
                        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-emerald-500">
                            <div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-400">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wider">Applications</p>
                                <h3 className="text-3xl font-black text-[var(--text-primary)]">{stats.metrics.totalApplications}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">User Acquisition (MOM)</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.charts.userGrowth}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                        <YAxis stroke="var(--text-secondary)" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem' }} 
                                            itemStyle={{ color: 'var(--accent)' }}
                                        />
                                        <Line type="monotone" dataKey="Users" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Job Postings Volume</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.charts.jobVolume}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                        <YAxis stroke="var(--text-secondary)" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem' }} 
                                            cursor={{fill: 'var(--border)'}}
                                        />
                                        <Bar dataKey="Jobs" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
                <div className="glass-card overflow-hidden animate-in fade-in duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-main)]/50 border-b border-[var(--border)]">
                                    <th className="p-4 font-bold text-[var(--text-secondary)] uppercase text-xs tracking-wider">User</th>
                                    <th className="p-4 font-bold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Role</th>
                                    <th className="p-4 font-bold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Joined Date</th>
                                    <th className="p-4 font-bold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Status</th>
                                    <th className="p-4 font-bold text-[var(--text-secondary)] uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-main)]/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-[var(--text-primary)]">{user.name}</div>
                                            <div className="text-sm text-[var(--text-secondary)]">{user.email}</div>
                                        </td>
                                        <td className="p-4 capitalize">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-md ${user.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-[var(--accent)]/10 text-[var(--accent)]'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-[var(--text-secondary)]">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            {user.isBanned ? (
                                                <span className="flex items-center gap-1 text-xs font-bold text-red-400"><Ban className="w-3 h-3" /> Banned</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-bold text-green-400"><CheckCircle className="w-3 h-3" /> Active</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {user.role !== 'admin' && (
                                                <button 
                                                    onClick={() => handleBanToggle(user._id)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 ml-auto transition-colors ${user.isBanned ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                                                >
                                                    <AlertTriangle className="w-4 h-4" />
                                                    {user.isBanned ? "Unban" : "Ban"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Jobs Tab */}
            {activeTab === "jobs" && (
                <div className="glass-card overflow-hidden animate-in fade-in duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-main)]/50 border-b border-[var(--border)]">
                                    <th className="p-4 font-bold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Job Title</th>
                                    <th className="p-4 font-bold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Recruiter</th>
                                    <th className="p-4 font-bold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Posted On</th>
                                    <th className="p-4 font-bold text-[var(--text-secondary)] uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job._id} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-main)]/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-[var(--text-primary)]">{job.title}</div>
                                            <div className="text-sm text-[var(--text-secondary)]">{job.company} • {job.location}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-[var(--text-primary)]">{job.postedBy?.name}</div>
                                            <div className="text-xs text-[var(--text-secondary)]">{job.postedBy?.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-[var(--text-secondary)]">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleDeleteJob(job._id)}
                                                className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-bold flex items-center gap-2 ml-auto transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
