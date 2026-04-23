export const JobSkeleton = () => {
    return (
        <div className="glass-card !p-4 sm:!p-5 animate-pulse flex flex-col h-full border border-[var(--border)] overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-[var(--text-secondary)]/10 rounded-xl"></div>
                    <div className="space-y-2.5">
                        <div className="h-4 bg-[var(--text-secondary)]/10 rounded w-48"></div>
                        <div className="h-3 bg-[var(--text-secondary)]/10 rounded w-32"></div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-[var(--text-secondary)]/10 rounded-full"></div>
                    <div className="h-6 w-20 bg-[var(--text-secondary)]/10 rounded-full"></div>
                </div>
            </div>
            
            <div className="space-y-2.5 mb-5 flex-grow mt-2">
                <div className="h-2.5 bg-[var(--text-secondary)]/10 rounded w-full"></div>
                <div className="h-2.5 bg-[var(--text-secondary)]/10 rounded w-5/6"></div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="h-3 bg-[var(--text-secondary)]/10 rounded w-20 shrink-0"></div>
                <div className="h-3 bg-[var(--text-secondary)]/10 rounded w-24 shrink-0"></div>
                <div className="h-3 bg-[var(--text-secondary)]/10 rounded w-16 shrink-0"></div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-auto">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-12 bg-[var(--text-secondary)]/10 rounded shrink-0"></div>
                    <div className="h-5 w-16 bg-[var(--text-secondary)]/10 rounded shrink-0"></div>
                    <div className="h-5 w-10 bg-[var(--text-secondary)]/10 rounded shrink-0"></div>
                </div>
                <div className="h-4 w-16 bg-[var(--text-secondary)]/10 rounded shrink-0"></div>
            </div>
        </div>
    );
};
