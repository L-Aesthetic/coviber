export const quizQuestions = [
    // Section A: Strategic Alignment (Rich vs. King)
    {
        id: 1,
        category: "Strategic Alignment",
        text: "It is Year 3. You receive a $15M acquisition offer. You own 40%. The acquirer will likely shut down the product but hire the team. This is 'life-changing money' ($6M) but ends the dream of a billion-dollar legacy.",
        options: [
            { id: 'A', text: "Take the deal. Financial freedom and security are the primary goals.", type: "Security" },
            { id: 'B', text: "Reject the deal. We are building a unicorn. $15M is a failure.", type: "Rich" },
            { id: 'C', text: "Reject the deal. I won't sell to someone who will kill my product.", type: "King" }
        ]
    },
    {
        id: 2,
        category: "Equity Philosophy",
        text: "You started working on the idea 4 months before your co-founder. They are now joining full-time and are equally skilled. How do you split equity?",
        options: [
            { id: 'A', text: "50/50. We are equal partners moving forward; past work is sunk cost.", type: "Relational" },
            { id: 'B', text: "60/40. I keep a premium for the early risk and IP creation.", type: "Transactional" },
            { id: 'C', text: "Dynamic/Vesting. We set a baseline but adjust based on future milestones.", type: "Conductor" }
        ]
    },
    {
        id: 3,
        category: "Exit Horizon",
        text: "It is Day 1. What is the definition of 'Success' for this venture?",
        options: [
            { id: 'A', text: "IPO or >$500M Acquisition. Go big or go home.", type: "Rich" },
            { id: 'B', text: "A profitable, automated business generating $1M/year in dividends.", type: "King" },
            { id: 'C', text: "Build cool tech and see what happens.", type: "Product" }
        ]
    },

    // Section B: Velocity & Methodology (New Vibe vs. Veteran)
    {
        id: 4,
        category: "Velocity",
        text: "A major potential client wants a feature tomorrow to sign a contract. You can 'hack' it' together (creating technical debt) or build it properly in 2 weeks (risking losing the client).",
        options: [
            { id: 'A', text: "Hack it. Ship it. Fix it later. Revenue first.", type: "New Vibe" },
            { id: 'B', text: "Build it properly. Technical debt kills startups.", type: "Veteran" },
            { id: 'C', text: "Negotiate. Offer a manual workaround or 'concierge MVP'.", type: "Pragmatic" }
        ]
    },
    {
        id: 5,
        category: "Ethics",
        text: "You discover a 'grey area' growth hack that violates a platform's TOS (e.g., scraping LinkedIn) but will triple user growth overnight. It is undetectable for now.",
        options: [
            { id: 'A', text: "Do it. 'Move fast and break things.' If we don't, competitors will.", type: "Indie Hacker" },
            { id: 'B', text: "Don't do it. Building a business on a violation is a house of cards.", type: "Veteran" },
            { id: 'C', text: "Consult Counsel. Wait for legal approval.", type: "Bureaucratic" }
        ]
    },
    {
        id: 6,
        category: "Pivot Pressure",
        text: "Data comes back after launch: nobody wants the core product, but they love a minor secondary feature. Pivoting means throwing away 6 months of code.",
        options: [
            { id: 'A', text: "Pivot immediately. The market is the boss.", type: "Ruthless" },
            { id: 'B', text: "Double down. We just haven't found the right marketing channel yet.", type: "Rigid" },
            { id: 'C', text: "Hybrid. Try to support both features simultaneously.", type: "Avoiding" }
        ]
    },

    // Section C: Role Fit & Resilience (BP10 & TKI)
    {
        id: 7,
        category: "Sales Front",
        text: "The product is ready, but no users. You need to cold-call/email 100 potential clients this week. Who does it?",
        options: [
            { id: 'A', text: "I love it. I am the face of the company.", type: "Rainmaker" },
            { id: 'B', text: "I'll do it if I have to, but I prefer product work.", type: "Duty" },
            { id: 'C', text: "We need to hire sales. I can't sell.", type: "Expert" }
        ]
    },
    {
        id: 8,
        category: "Stress Response",
        text: "A key investor pulls out. Your co-founder goes silent and stops attending stand-ups for 24 hours. What is your immediate reaction?",
        options: [
            { id: 'A', text: "Confrontation. Call them repeatedly. 'We need to fix this now!'", type: "Competing" },
            { id: 'B', text: "Avoidance/Trust. Give them space; they are probably processing.", type: "Accommodating" },
            { id: 'C', text: "Support. Send a message: 'I know this is hard. Let's meet when you're ready.'", type: "Collaborating" }
        ]
    },
    {
        id: 9,
        category: "Gut vs Data",
        text: "Your co-founder wants to launch a bold, expensive marketing campaign based on 'gut instinct'. The early data suggests it will fail.",
        options: [
            { id: 'A', text: "Block it. We don't spend money without validation.", type: "Conductor" },
            { id: 'B', text: "Trust the Vision. Data can be wrong; you have to bet on intuition.", type: "Rainmaker" },
            { id: 'C', text: "Test it. Run a micro-budget version to prove them right or wrong.", type: "Mediator" }
        ]
    },

    // Section D: Gender & Cultural Dynamics
    {
        id: 10,
        category: "Feedback Loop",
        text: "Your co-founder gives you harsh feedback on your performance in front of the team.",
        options: [
            { id: 'A', text: "Appreciate it. Radical candor makes us better.", type: "Growth" },
            { id: 'B', text: "Defensive. 'You should have done this in private.'", type: "Sensitive" },
            { id: 'C', text: "Counter-Attack. Fire back with their own flaws.", type: "Competing" }
        ]
    },
    {
        id: 11,
        category: "Hiring Philosophy",
        text: "You have budget for one key hire.",
        options: [
            { id: 'A', text: "A Senior Expert. Someone expensive who needs zero management.", type: "Delegator" },
            { id: 'B', text: "Two Juniors. Cheaper, and I can mold them to my way of working.", type: "Control" },
            { id: 'C', text: "An Admin/Ops. To take the grunt work off my plate.", type: "Efficiency" }
        ]
    },
    {
        id: 12,
        category: "Risk Appetite",
        text: "To secure a bridge loan, you must personally guarantee it with your home/assets.",
        options: [
            { id: 'A', text: "Sign it. I'm all in. Burn the boats.", type: "High Risk" },
            { id: 'B', text: "No way. My family's security comes first.", type: "Low Risk" },
            { id: 'C', text: "Search for alternatives. I will find non-dilutive capital or cut costs.", type: "Prudent" }
        ]
    },
    // Section E: The Hustle (New "Growth" Questions)
    {
        id: 13,
        category: "Agency",
        text: "You need to launch a landing page, but the designer is sick and the dev is busy.",
        options: [
            { id: 'A', text: "Wait. Brand consistency is everything.", type: "Veteran" },
            { id: 'B', text: "Build it myself in a no-code tool (Carrd/Webflow) and launch today.", type: "Hacker" },
            { id: 'C', text: "Write the spec document so they can start immediately upon return.", type: "Bureaucratic" }
        ]
    },
    {
        id: 14,
        category: "Outreach",
        text: "You have 0 users. How do you get the first 10?",
        options: [
            { id: 'A', text: "DM 100 people on LinkedIn/Twitter manually.", type: "Grind" },
            { id: 'B', text: "Run detailed Facebook Ads to a segmented audience.", type: "Rich" },
            { id: 'C', text: "Post on Product Hunt and wait for organic traffic.", type: "Indie Hacker" }
        ]
    },
    {
        id: 15,
        category: "Failure",
        text: "You spent 3 weeks on a campaign and got 0 leads. What is your post-mortem?",
        options: [
            { id: 'A', text: "The market is wrong/early. We need to educate them.", type: "Visionary" },
            { id: 'B', text: "My copy sucked. I need to iterate the hook and try again tomorrow.", type: "Ownership" },
            { id: 'C', text: "The product isn't ready. We shouldn't be marketing yet.", type: "Product" }
        ]
    },
    {
        id: 16,
        category: "Rule Breaking",
        text: "A competitor has a public list of their customers. You could scrape it.",
        options: [
            { id: 'A', text: "Scrape it immediately. All is fair in love and war.", type: "Ruthless" },
            { id: 'B', text: "No, that's unethical and maybe illegal.", type: "Duty" },
            { id: 'C', text: "Manually research the top 20 to see if they are a fit.", type: "Prudent" }
        ]
    },
    {
        id: 17,
        category: "Velocity",
        text: "What means more to you?",
        options: [
            { id: 'A', text: "Speed. If you aren't embarrassed by V1, you launched too late.", type: "Hacker" },
            { id: 'B', text: "Quality. You only get one chance to make a first impression.", type: "Veteran" },
            { id: 'C', text: "Scale. Systems need to be robust from Day 1.", type: "Conductor" }
        ]
    },
    // Section F: Financial Alignment (Burn Rate)
    {
        id: 18,
        category: "Salary Expectations",
        text: "We just raised a $2M Seed Round. What is your salary?",
        options: [
            { id: 'A', text: "Market Rate ($150k+). I need to be comfortable to perform.", type: "Rich" },
            { id: 'B', text: "Ramen Profitability ($60k). Every dollar should go to growth.", type: "Indie Hacker" },
            { id: 'C', text: "Hybrid ($100k). Enough to live, but showing discipline.", type: "Pragmatic" }
        ]
    },
    {
        id: 19,
        category: "Burn Multiplier",
        text: "It's month 3. Growth is flat. Strategy?",
        options: [
            { id: 'A', text: "Spend More. We need to buy awareness to get the flywheel spinning.", type: "High Risk" },
            { id: 'B', text: "Cut Costs. Extend runway to 24 months until we find PMF.", type: "Prudent" },
            { id: 'C', text: "Do Things That Don't Scale. Manual sales until it hurts.", type: "Grind" }
        ]
    },
    {
        id: 20,
        category: "Office vs Remote",
        text: "Where do we work?",
        options: [
            { id: 'A', text: "Premium Office. We need a 'War Room' vibe to win.", type: "Rainmaker" },
            { id: 'B', text: "Remote. Offices are a vanity metric and value leak.", type: "Efficiency" },
            { id: 'C', text: "Co-working. Flexible, cheap, but professional.", type: "Mediator" }
        ]
    }
];

export const determineArchetype = (answers) => {
    // Simple scoring logic for the MVP
    // New Vibe/Indie Hacker vs Veteran vs Operator

    let scores = {
        Operator: 0,
        Architect: 0,
        Sovereign: 0,
        Hustler: 0
    };

    // Map answers to archetypes
    Object.values(answers).forEach(type => {
        // SOVEREIGN: Visionary, High Risk, Sales, Speed
        if (['Rich', 'New Vibe', 'Indie Hacker', 'Rainmaker', 'Competing', 'High Risk', 'Delegator', 'Visionary'].includes(type)) {
            scores.Sovereign += 1;
        }
        // ARCHITECT: Product-Led, Perfectionist, Low Risk, Control
        if (['King', 'Veteran', 'Expert', 'Product', 'Rigid', 'Control', 'Security', 'Low Risk', 'Growth', 'Duty'].includes(type)) {
            scores.Architect += 1;
        }
        // OPERATOR: Systems, People, Harmony, Efficiency, Prudence
        if (['Conductor', 'Pragmatic', 'Mediator', 'Efficiency', 'Bureaucratic', 'Avoiding', 'Accommodating', 'Collaborating', 'Sensitive', 'Prudent', 'Relational'].includes(type)) {
            scores.Operator += 1;
        }
        // HUSTLER: Velocity, Agency, Sales, Grit
        // Added 'Grind' to Hustler
        if (['Hacker', 'Grind', 'Ownership', 'Ruthless', 'Transactional'].includes(type)) {
            scores.Hustler += 2;
        }
    });

    const max = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b);

    return {
        name: max[0], // "Sovereign", "Architect", or "Operator" or "Hustler"
        role: getArchetypeRole(max[0]),
        desc: getArchetypeDescription(max[0])
    };
};

const getArchetypeRole = (name) => {
    const roles = {
        Sovereign: "Distribution", // Visionary
        Hustler: "Distribution",   // Growth
        Architect: "Builder",      // Systems
        Operator: "Builder"        // Product
    };
    return roles[name] || "Builder";
};

const getArchetypeDescription = (name) => {
    const descs = {
        Sovereign: "High Risk • High Vision • Empire Builder. You need a Builder.",
        Architect: "High Standards • Technical Mastery • Legacy Focused. You need a Visionary.",
        Operator: "High Efficiency • Systems Thinker • Scale Oriented. You need a Marketer.",
        Hustler: "High Velocity • Sales Focused • Unstoppable Force. You need a Builder."
    };
    return descs[name] || descs.Sovereign;
};
