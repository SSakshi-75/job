import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Shield, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { setLoading, setUser, setError } from "../../redux/slices/authSlice.js";
import api from "../../services/api.js";

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const { loading, error } = useSelector((state) => state.auth);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const res = await api.post("/auth/login", credentials);
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                // Fetch the full user info
                const userRes = await api.get("/auth/me");
                const user = userRes.data.data;
                
                // Verify if the user is actually an admin
                if (user.role !== "admin") {
                    localStorage.removeItem("token");
                    dispatch(setError("Access Denied do not have admin privileges."));
                    dispatch(setLoading(false));
                    return;
                }

                dispatch(setUser(user));
                navigate("/admin");
            }
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Admin Login failed"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Dark abstract bg elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Portal
            </Link>

            <div className="max-w-md w-full space-y-8 bg-slate-800/50 backdrop-blur-2xl p-10 rounded-[40px] border border-slate-700/50 shadow-2xl relative z-10">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-4 rounded-3xl shadow-lg shadow-blue-600/30">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Admin Gateway</h2>
                    <p className="mt-2 text-slate-400 font-medium text-sm tracking-widest uppercase">Secure Access Only</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-inner"
                                placeholder="Admin Email"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-inner"
                                placeholder="Command Password"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-2xl text-sm flex items-center justify-center text-center font-bold animate-in fade-in">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>Initialize Access</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
