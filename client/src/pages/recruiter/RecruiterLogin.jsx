import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { setLoading, setUser, setError } from "../../redux/slices/authSlice.js";
import api from "../../services/api.js";

const RecruiterLogin = () => {
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
                
                // Verify if the user is a recruiter
                if (user.role !== "recruiter") {
                    localStorage.removeItem("token");
                    dispatch(setError("Access Denied portal is strictly for Employers."));
                    dispatch(setLoading(false));
                    return;
                }

                dispatch(setUser(user));
                navigate("/my-jobs");
            }
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Employer Login failed"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 sm:px-6 lg:px-8">
            {/* Business abstract bg elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-teal-400/20 rounded-full blur-[80px] pointer-events-none"></div>
            
            <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-emerald-600 flex items-center gap-2 font-bold transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Portal
            </Link>

            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl relative z-10 hover:shadow-emerald-900/5 transition-shadow duration-500">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-linear-to-br from-emerald-500 to-teal-600 p-4 rounded-3xl shadow-lg shadow-emerald-500/30">
                            <Briefcase className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Employer Portal</h2>
                    <p className="mt-2 text-slate-500 font-medium">Log in to manage your job listings</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                placeholder="Corporate Email"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-2xl text-sm flex items-center justify-center text-center font-bold animate-in fade-in">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>Sign In to Employer Dashboard</>
                        )}
                    </button>
                    
                    <div className="text-center mt-4">
                        <p className="text-slate-500 text-sm font-medium">
                            Need an employer account?{" "}
                            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
                                Create one here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecruiterLogin;
