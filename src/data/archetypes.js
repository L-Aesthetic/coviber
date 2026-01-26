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
        powerDynamics: "Equity is performance fuel. I believe in dynamic splits based on value creation, not time spent.",
        workDialect: "Speed & Vision. I communicate in possibilities and aggressive timelines.",
        quote: "The Reality Distortion Field",
        whyEssential: "You are the spark. You create the energy that pulls investors, talent, and customers into your orbit when nothing else exists.",
        match: {
            name: "THE OPERATOR 🎯",
            desc: "You need an Engine. You need someone who can take your 3AM vision and turn it into a 9AM execution plan without killing the vibe."
        },
        vibe_data: [
            { subject: 'Risk', A: 140, fullMark: 150 },
            { subject: 'Pace', A: 145, fullMark: 150 },
            { subject: 'Control', A: 40, fullMark: 150 },
            { subject: 'Optimism', A: 150, fullMark: 150 },
            { subject: 'Details', A: 30, fullMark: 150 },
        ]
    },
    'Architect': {
        name: 'Architect',
        headline: 'The Architect 🏛️',
        role: "Engineering",
        bio: "You are the Veteran Builder. You view software engineering not as a means to an end, but as a craft. You value Legacy, Control, and Truth. While others sell dreams, you stay up at 3 AM worrying about database concurrency.",
        superpower: "The Deep Work Engine: You can hold entire system architectures in your mind and code for 12 hours straight without breaking focus.",
        kryptonite: "The 'Gold-Plating' Trap: You are statistically likely to build a perfect product that nobody wants. You prioritize scalability before you have users.",
        commStyle: "Precise, Asynchronous, Data-backed. I prefer written specs over brainstorming calls.",
        triggerWarning: "If you ask me to 'just hack it basically', I will lecture you on technical debt for 45 minutes.",
        powerDynamics: "Equity is long-term commitment. I value fairness, vesting, and protecting the cap table.",
        workDialect: "Quality & Precision. I communicate in specifications, constraints, and scalability.",
        quote: "The Code is the Product.",
        whyEssential: "You build the actual asset that gives the company value. You create the 'Sleep at Night' factor for the team.",
        match: {
            name: "THE SOVEREIGN ⚡",
            desc: "You need a Pirate. You need someone to sell the vision and force you to ship 'good enough' code while you ensure their promises get fulfilled."
        },
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
        bio: "You are the Engine. You turn chaos into order. You love clear goals, efficient processes, and execution. You need a partner who can generate the raw energy and vision that you can then organize into reality.",
        superpower: "The Execution Engine: You turn vague visions into specific JIRA tickets. You remove ambiguity and ensure the trains run on time.",
        kryptonite: "The Optimization Trap: You might optimize funnels for a product that has no market fit. You struggle with 'irrational bets' that look bad on a spreadsheet.",
        commStyle: "Action-oriented, Bullet points, Clear next steps. I hate ambiguous meetings.",
        triggerWarning: "I hate chaos. If it's not on the calendar or in the project board, it doesn't exist.",
        powerDynamics: "Equity aligns incentives. I believe in clear roles, structure, and operational leverage.",
        workDialect: "Efficiency & Clarity. I communicate in OKRs, process maps, and deliverables.",
        quote: "Chaos is the Enemy.",
        whyEssential: "You are the glue. Without you, the vision is just a hallucination and the code is just a hobby. You build the business.",
        match: {
            name: "THE SOVEREIGN ⚡",
            desc: "You need a Visionary. You need someone to point the ship at a destination worth reaching, so you can focus on getting it there safely."
        },
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
