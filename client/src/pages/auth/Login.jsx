import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { setLoading, setUser, setError } from "../../redux/slices/authSlice.js";
import api from "../../services/api.js";

const Login = () => {
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
                // Fetch the user data (usually returned in login or via /me)
                localStorage.setItem("token", res.data.token);
                // For simplicity, let's assume register/login returns at least a partial user obj or we call /me
                const userRes = await api.get("/auth/me");
                const user = userRes.data.data;
                
                // Verify if the user is a job seeker
                if (user.role !== "job-seeker") {
                    localStorage.removeItem("token");
                    dispatch(setError("Access Denied portal is for Candidates. Please use the Employer Portal."));
                    dispatch(setLoading(false));
                    return;
                }

                dispatch(setUser(user));
                navigate("/");
            }
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"));
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-transparent px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-sm w-full space-y-8 glass-card !p-8 !rounded-[2rem] !shadow-sm">
                <div className="text-center">
                    <div className="flex justify-center mb-5">
                        <div className="bg-[#EAF2FF] p-4 rounded-2xl inline-flex">
                            <LogIn className="w-8 h-8 text-[#2563EB]" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h2 className="text-[28px] font-extrabold text-[#0F172A] tracking-tight">Candidate Login</h2>
                    <p className="mt-2 text-[#64748B] font-medium text-[15px]">Log in to search and apply for jobs</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                                <Mail className="w-5 h-5 text-[#94A3B8]" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="input-field pl-11 py-3"
                                placeholder="Email address"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                                <Lock className="w-5 h-5 text-[#94A3B8]" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="input-field pl-11 py-3"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 !rounded-xl !text-[15px]"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Sign In</>
                        )}
                    </button>
                    
                    <div className="text-center mt-6">
                        <p className="text-[#64748B] text-[15px] font-medium transition-colors">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-[#2563EB] hover:text-[#1D4ED8] font-bold transition-colors">
                                Sign up
                            </Link>
                        </p>
                        <p className="text-[#64748B] text-[14px] font-medium mt-4 transition-colors">
                            Are you an employer?{" "}
                            <Link to="/recruiter/login" className="text-[#059669] hover:text-[#047857] font-bold transition-colors">
                                Employer Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
