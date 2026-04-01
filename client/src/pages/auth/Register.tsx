import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Mail, Lock, User, Briefcase, Loader2 } from "lucide-react";
import { setLoading, setUser, setError } from "../../redux/slices/authSlice.js";
import api from "../../services/api.js";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "job-seeker",
    });
    
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const res = await api.post("/auth/register", formData);
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                // Call /me to get full user data
                const userRes = await api.get("/auth/me");
                dispatch(setUser(userRes.data.data));
                navigate("/");
            }
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Registration failed"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 glass-card">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600/20 p-3 rounded-2xl">
                            <UserPlus className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
                    <p className="mt-2 text-[#9CA3AF]">Join our community today</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-500">
                                <User className="w-5 h-5 text-[#9CA3AF]" />
                            </div>
                            <input
                                name="name"
                                type="text"
                                required
                                className="input-field pl-10"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-500">
                                <Mail className="w-5 h-5 text-[#9CA3AF]" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="input-field pl-10"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-500">
                                <Lock className="w-5 h-5 text-[#9CA3AF]" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="input-field pl-10"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-500">
                                <Briefcase className="w-5 h-5 text-[#9CA3AF]" />
                            </div>
                            <select
                                name="role"
                                className="input-field pl-10 appearance-none"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="job-seeker">Job Seeker</option>
                                <option value="recruiter">Recruiter</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Sign Up</>
                        )}
                    </button>
                    
                    <div className="text-center mt-4">
                        <p className="text-[#9CA3AF] text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
