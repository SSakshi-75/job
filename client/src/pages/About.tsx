const About = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 py-12">
            <div className="max-w-3xl glass-card space-y-6">
                <div className="bg-[var(--accent)]/10 text-[var(--accent)] inline-block p-4 rounded-full mb-2">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">Our Mission</h1>
                <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
                    We're building a smarter, faster, and more beautiful way to hire and get hired.
                    Connecting top talent with thriving companies through an intelligent platform tailored to the modern professional.
                </p>
            </div>
        </div>
    );
};

export default About;
