export const ARCHETYPE_DATA = {
    'Sovereign': {
        name: 'Sovereign',
        headline: 'The Sovereign ⚡',
        role: "Founder",
        bio: "I build empires. I move fast, break things, and ask for forgiveness later. I need a partner who can keep the engine running while I chart the course.",
        superpower: "The Reality Distortion Field: I can convince investors and hires to believe in a future that is mathematically unlikely.",
        kryptonite: "The House of Cards Trap: I often sell the dream before the reality exists. Without checks, I will scale a broken system until it collapses.",
        commStyle: "Direct, Visionary, Impatient with details. I prefer 'What' and 'Why' over 'How'.",
        triggerWarning: "I might pivot the entire company at 3am if I have a better idea.",
        vibe_data: [
            { subject: 'Risk', A: 140, fullMark: 150 },
            { subject: 'Pace', A: 145, fullMark: 150 },
            { subject: 'Control', A: 40, fullMark: 150 },
            { subject: 'Optimism', A: 140, fullMark: 150 },
            { subject: 'Details', A: 30, fullMark: 150 },
        ]
    },
    'Architect': {
        name: 'Architect',
        headline: 'The Architect 🏛️',
        role: "Engineering",
        bio: "I build systems that last. I care about truth, scalability, and code quality. I need a partner who can sell the vision while I ensure we can actually deliver it.",
        superpower: "The Deep Work Engine: I can hold entire system architectures in my mind and code for 12 hours straight without breaking focus.",
        kryptonite: "The Gold-Plating Trap: I am statistically likely to build a perfect product that nobody wants. I prioritize scalability before we have users.",
        commStyle: "Precise, Asynchronous, Data-backed. I prefer written specs over brainstorming calls.",
        triggerWarning: "If you ask me to 'just hack it basically', I will lecture you on technical debt for 45 minutes.",
        vibe_data: [
            { subject: 'Risk', A: 40, fullMark: 150 },
            { subject: 'Pace', A: 70, fullMark: 150 },
            { subject: 'Control', A: 130, fullMark: 150 },
            { subject: 'Optimism', A: 50, fullMark: 150 },
            { subject: 'Details', A: 150, fullMark: 150 },
        ]
    },
    'Operator': {
        name: 'Operator',
        headline: 'The Operator 🎯',
        role: "Operations",
        bio: "I turn chaos into order. I love clear goals, efficient processes, and execution. I need a partner who can generate the raw energy and vision that I can then organize into reality.",
        superpower: "The Execution Engine: I turn vague visions into specific JIRA tickets. I remove ambiguity and ensure the trains run on time.",
        kryptonite: "The Optimization Trap: I might optimize funnels for a product that has no market fit. I struggle with 'irrational bets' that look bad on a spreadsheet.",
        commStyle: "Action-oriented, Bullet points, Clear next steps. I hate ambiguous meetings.",
        triggerWarning: "I hate chaos. If it's not on the calendar or in the project board, it doesn't exist.",
        vibe_data: [
            { subject: 'Risk', A: 80, fullMark: 150 },
            { subject: 'Pace', A: 120, fullMark: 150 },
            { subject: 'Control', A: 140, fullMark: 150 },
            { subject: 'Optimism', A: 90, fullMark: 150 },
            { subject: 'Details', A: 130, fullMark: 150 },
        ]
    }
};

export const getArchetypeDetails = (name) => {
    // Normalize string to match keys
    if (!name) return ARCHETYPE_DATA['Sovereign'];

    // Check if name contains key words
    if (name.includes('Sovereign')) return ARCHETYPE_DATA['Sovereign'];
    if (name.includes('Architect')) return ARCHETYPE_DATA['Architect'];
    if (name.includes('Operator')) return ARCHETYPE_DATA['Operator'];

    // Default
    return ARCHETYPE_DATA['Sovereign'];
};
