import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Palette, Check } from "lucide-react";
import { setTheme } from "../redux/slices/themeSlice";

const themes = [
    { id: "dark", name: "Dark", colors: ["#0B1220", "#111827", "#3B82F6"] },
    { id: "luxury", name: "Luxury", colors: ["#0a0a0a", "#1a1a1a", "#d4af37"] },
    { id: "dracula", name: "Dracula", colors: ["#1e1f29", "#282a36", "#bd93f9"] },
    { id: "cmyk", name: "CMYK", colors: ["#ffffff", "#f5f5f5", "#ff0066"] },
    { id: "autumn", name: "Autumn", colors: ["#2c1b0c", "#3b2a1a", "#ff8c00"] },
    { id: "business", name: "Business", colors: ["#f9fafb", "#ffffff", "#374151"] },
    { id: "acid", name: "Acid", colors: ["#0f0f0f", "#1a1a1a", "#00ffcc"] },
];

const ThemeSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const currentTheme = useSelector((state) => state.theme.theme);
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleThemeChange = (id) => {
        dispatch(setTheme(id));
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                title="Change Theme"
            >
                <Palette className="w-5 h-5 text-[var(--accent)]" />
                <span className="hidden sm:inline font-medium">Theme</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="p-2 space-y-1">
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => handleThemeChange(theme.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
                                    currentTheme === theme.id 
                                    ? "bg-[var(--accent)]/10 text-[var(--accent)]" 
                                    : "hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-1">
                                        {theme.colors.map((color, i) => (
                                            <div 
                                                key={i} 
                                                className="w-3 h-3 rounded-full border border-black/10" 
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium">{theme.name}</span>
                                </div>
                                {currentTheme === theme.id && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;
