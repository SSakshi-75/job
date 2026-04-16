// Keyword grouping & overlapping logic for smart matching

/**
 * Calculates a match score between user skills and job requirements.
 * Returns a score from 0 to 100.
 */
export const calculateSkillMatch = (userSkills = [], jobSkills = []) => {
    if (!jobSkills || jobSkills.length === 0) return { matchPercentage: 100, missingSkills: [] };
    if (!userSkills || userSkills.length === 0) return { matchPercentage: 0, missingSkills: jobSkills || [] };

    const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
    const normalizedJobSkills = jobSkills.map(s => s.toLowerCase().trim());

    // Basic overlap
    let matchCount = 0;
    const missingSkills = [];

    normalizedJobSkills.forEach(skill => {
        // We do a strict match or a substring match but prevent short false positives
        const hasSkill = normalizedUserSkills.some(userSkill => {
            if (userSkill === skill) return true;
            // Only allow substring matching if length is considerable (>2 chars) to avoid "c" matching "react"
            if (userSkill.length > 2 && skill.includes(userSkill)) return true;
            if (skill.length > 2 && userSkill.includes(skill)) return true;
            return false;
        });

        if (hasSkill) {
            matchCount++;
        } else {
            // Keep original casing for missing skills
            const originalSkill = jobSkills.find(s => s.toLowerCase().trim() === skill);
            missingSkills.push(originalSkill || skill);
        }
    });

    const matchPercentage = Math.round((matchCount / jobSkills.length) * 100);
    
    return {
        matchPercentage,
        missingSkills
    };
};

/**
 * Recommends jobs based on user's profile skills.
 * Sorts higher overlap to the top.
 */
export const getJobRecommendations = (user, allJobs) => {
    if (!user || (!user.skills && !user.profile?.skills)) return allJobs.slice(0, 10); // Return random/recent if no skills

    const userSkills = user.profile?.skills || user.skills || [];

    const jobsWithScores = allJobs.map(job => {
        const { matchPercentage } = calculateSkillMatch(userSkills, job.skills);
        return {
            ...job.toObject(),
            matchScore: matchPercentage
        };
    });

    // Sort by match score descending, then by creation date
    return jobsWithScores
        .sort((a, b) => b.matchScore - a.matchScore || new Date(b.createdAt) - new Date(a.createdAt))
        .filter(job => job.matchScore > 10) // Only recommend if at least > 10% match
        .slice(0, 15); // Top 15 recommendations
};

/**
 * Analyzes resume (skills) against a specific job role to provide actionable feedback.
 */
export const analyzeResume = (userSkills = [], jobTitle, jobSkills = []) => {
    const { matchPercentage, missingSkills } = calculateSkillMatch(userSkills, jobSkills);

    let feedback = "";
    if (matchPercentage >= 80) {
        feedback = "Excellent match! You are a highly competitive candidate for this role.";
    } else if (matchPercentage >= 50) {
        feedback = `Good match. You have the core foundation, but consider brushing up on: ${missingSkills.slice(0, 3).join(", ")}.`;
    } else {
        feedback = `This role might be a stretch right now. Focusing on ${missingSkills.slice(0, 3).join(", ")} will drastically improve your chances.`;
    }

    return {
        score: matchPercentage,
        missingSkills,
        feedback,
        isRecommended: matchPercentage >= 60
    };
};
