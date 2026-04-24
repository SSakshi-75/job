import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Mail, Lock, User, Loader2 } from "lucide-react";
import { setLoading, setUser, setError } from "../../redux/slices/authSlice.js";
import api from "../../services/api.js";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "job-seeker" });
    
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        let { name, value } = e.target;
        
        if (name === "name") {
            // Only allow letters and spaces
            value = value.replace(/[^a-zA-Z\s]/g, "");
        } else if (name === "email") {
            // Force lowercase
            value = value.toLowerCase();
        } else if (name === "password") {
            // Limit to max 8 characters
            if (value.length > 8) return;
        }

        setFormData({ ...formData, [name]: value });
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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-transparent px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-sm w-full space-y-8 glass-card !p-8 !rounded-[2rem] !shadow-sm">
                <div className="text-center">
                    <div className="flex justify-center mb-5">
                        <div className="bg-[#EAF2FF] p-4 rounded-2xl inline-flex">
                            <UserPlus className="w-8 h-8 text-[#2563EB]" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h2 className="text-[28px] font-extrabold text-[#0F172A] tracking-tight">Candidate Signup</h2>
                    <p className="mt-2 text-[#64748B] font-medium text-[15px]">Join our community to find your dream job</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#2563EB]">
                                <User className="w-5 h-5 text-[#94A3B8]" />
                            </div>
                            <input
                                name="name"
                                type="text"
                                required
                                className="input-field pl-11 py-3"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#2563EB]">
                                <Mail className="w-5 h-5 text-[#94A3B8]" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="input-field pl-11 py-3"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#2563EB]">
                                <Lock className="w-5 h-5 text-[#94A3B8]" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                maxLength={8}
                                className="input-field pl-11 py-3"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
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
                        className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 !rounded-xl !text-[15px]"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Sign Up</>
                        )}
                    </button>
                    
                    <div className="text-center mt-6">
                        <p className="text-[#64748B] text-[15px] font-medium transition-colors">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#2563EB] hover:text-[#1D4ED8] font-bold transition-colors">
                                Log in
                            </Link>
                        </p>
                        <p className="text-[#64748B] text-[14px] font-medium mt-4 transition-colors">
                            Are you an employer?{" "}
                            <Link to="/recruiter/register" className="text-[#059669] hover:text-[#047857] font-bold transition-colors">
                                Go to Employer Setup
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
