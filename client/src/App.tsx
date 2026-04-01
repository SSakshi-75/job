import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { setTheme } from "./redux/slices/themeSlice";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-4">
            <div className="max-w-4xl space-y-12">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
                    <div className="bg-blue-600/10 text-blue-500 font-bold tracking-widest uppercase inline-block px-4 py-1.5 rounded-full border border-blue-500/20 text-xs shadow-lg shadow-blue-500/10">
                        The Future of Job Search is Here
                    </div>
                    <h1 className="text-6xl font-black text-[var(--text-primary)] tracking-tight leading-none sm:text-7xl lg:text-8xl">
                        Find Your Next <br /> <span className="text-[var(--accent)]">Big Career</span> Move.
                    </h1>
                    <p className="max-w-xl mx-auto text-xl text-[var(--text-secondary)] font-medium leading-relaxed">
                        Join millions of professionals and find jobs that match your expertise with AI-powered candidate selection tools.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom offset-200 duration-1000">
                    <button className="btn-primary px-8 py-4 text-lg font-bold shadow-xl shadow-blue-500/20">Explore Jobs Now</button>
                    <button className="px-8 py-4 text-lg font-bold text-[var(--text-primary)] border border-[var(--border)] rounded-xl hover:bg-white/5 transition-all">Browse Companies</button>
                </div>
            </div>
        </div>
    );
};

function App() {
    const { theme } = useSelector((state: any) => state.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        // Apply initial theme
        const savedTheme = localStorage.getItem("theme") || "dark";
        dispatch(setTheme(savedTheme));
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, [dispatch]);

    return (
        <Router>
            <div className="min-h-screen bg-[var(--bg-main)]">
                <Navbar />
                <div className="mx-auto">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
