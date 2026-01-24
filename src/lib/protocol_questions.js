import {
    Shield,
    PieChart,
    Target,
    Zap,
    Lock,
    RefreshCw,
    Phone,
    MessageCircle,
    Lightbulb,
    MessageSquare,
    Users,
    Home
} from 'lucide-react';

export const PROTOCOL_QUESTIONS = [
    {
        id: 'king_rich_dilemma',
        module: 'Module 1: Strategic Alignment',
        icon: Shield,
        question: "A VC offers $15M for your startup. You own 40%. It's life-changing money ($6M) but they will likely kill the product. Use the money or save the dream?",
        subtext: "Psychology: Wasserman's Rich vs. King. Financial Freedom vs. Legacy.",
        options: [
            { id: 'rich', label: "Take the deal.", desc: "Financial freedom and security are the primary goals.", signal: "Rich Mindset" },
            { id: 'king', label: "Reject the deal.", desc: "I won't sell to someone who will kill my product.", signal: "King Mindset" },
            { id: 'ambition', label: "Reject (Too Small).", desc: "We are building a unicorn. $15M is a failure.", signal: "High Ambition" }
        ]
    },
    {
        id: 'equity_split',
        module: 'Module 1: Strategic Alignment',
        icon: PieChart,
        question: "Your co-founder joins 4 months after you started. They are equally skilled. How do you split equity?",
        subtext: "Psychology: Fairness vs. Avoidance.",
        options: [
            { id: 'equal', label: "50/50.", desc: "We are equal partners moving forward; past work is sunk cost.", signal: "Relational/Avoidance" },
            { id: 'premium', label: "60/40 (Premium).", desc: "I keep a premium for early risk and IP creation.", signal: "Transactional/Fairness" },
            { id: 'dynamic', label: "Dynamic/Vesting.", desc: "Set a baseline but adjust based on future milestones.", signal: "Conductor/Sophisticated" }
        ]
    },
    {
        id: 'exit_horizon',
        module: 'Module 1: Strategic Alignment',
        icon: Target,
        question: "It is Day 1. What is the definition of 'Success'?",
        subtext: "Psychology: Vision Alignment.",
        options: [
            { id: 'venture', label: "IPO or >$500M Exit.", desc: "Go big or go home. Venture scale.", signal: "Rich/Venture Scale" },
            { id: 'lifestyle', label: "Profitable Business.", desc: "$1M/year in dividends for founders. Freedom.", signal: "King/Lifestyle" },
            { id: 'product', label: "Build Cool Tech.", desc: "See what happens. Focus on the product.", signal: "Product Focus" }
        ]
    },
    {
        id: 'tech_debt',
        module: 'Module 2: Velocity & Methodology',
        icon: Zap,
        question: "A major client wants a feature tomorrow. You can 'hack' it (spaghetti code) or build it properly (2 weeks).",
        subtext: "Psychology: Action Orientation vs. Conscientiousness.",
        options: [
            { id: 'hack', label: "Hack it.", desc: "Ship it. Fix it later. Revenue first.", signal: "New Vibe/High Action" },
            { id: 'proper', label: "Build it properly.", desc: "Technical debt kills startups. Quality matters.", signal: "Veteran/Architect" },
            { id: 'negotiate', label: "Negotiate.", desc: "Offer a manual workaround to buy time.", signal: "Pragmatic/Sales" }
        ]
    },
    {
        id: 'ethics',
        module: 'Module 2: Velocity & Methodology',
        icon: Lock,
        question: "A 'grey area' growth hack (e.g., scraping) violates TOS but triples growth. Undetectable for now.",
        subtext: "Psychology: Nonconformity vs. Conscientiousness.",
        options: [
            { id: 'do_it', label: "Do it.", desc: "Move fast and break things. Competitors will.", signal: "Indie Hacker" },
            { id: 'dont', label: "Don't do it.", desc: "Building on a violation is a house of cards.", signal: "Veteran/Ethical" },
            { id: 'legal', label: "Consult Counsel.", desc: "Wait for legal approval before acting.", signal: "Bureaucratic" }
        ]
    },
    {
        id: 'pivot',
        module: 'Module 2: Velocity & Methodology',
        icon: RefreshCw,
        question: "Market data says nobody wants the core product, but they love a minor secondary feature. Pivot?",
        subtext: "Psychology: Openness vs. Perseverance.",
        options: [
            { id: 'pivot', label: "Pivot immediately.", desc: "The market is the boss. Throw away the old code.", signal: "High Openness/Ruthless" },
            { id: 'persist', label: "Double down.", desc: "We just haven't found the right marketing yet.", signal: "High Persistence" },
            { id: 'hybrid', label: "Hybrid.", desc: "Support both to avoid conflict.", signal: "Avoiding/Low Focus" }
        ]
    },
    {
        id: 'sales_role',
        module: 'Module 3: Role Fit',
        icon: Phone,
        question: "We need to cold-call 100 prospects this week. Who does it?",
        subtext: "Psychology: BP10 Rainmaker Talent.",
        options: [
            { id: 'me', label: "I love it.", desc: "I am the face of the company.", signal: "Rainmaker" },
            { id: 'duty', label: "I'll do it (Duty).", desc: "Preferred product, but I'll do what's needed.", signal: "Conscientious" },
            { id: 'hire', label: "Hire Sales.", desc: "I can't sell. We need a pro.", signal: "Expert/Introvert" }
        ]
    },
    {
        id: 'stress_response',
        module: 'Module 4: Resilience & Culture',
        icon: MessageCircle,
        question: "A key investor pulls out. Your co-founder goes silent. What do you do?",
        subtext: "Psychology: TKI Conflict Mode & Neuroticism.",
        options: [
            { id: 'confront', label: "Confrontation.", desc: "Call them repeatedly. We need to fix this NOW.", signal: "Competing/High Urgency" },
            { id: 'space', label: "Give Space.", desc: "Trust them. They are processing.", signal: "Accommodating/Trust" },
            { id: 'support', label: "Support.", desc: "Send a message: 'Here when you're ready.'", signal: "Collaborating/EQ" }
        ]
    },
    {
        id: 'gut_vs_data',
        module: 'Module 3: Role Fit',
        icon: Lightbulb,
        question: "Co-founder wants a bold, expensive marketing campaign based on 'gut'. Data looks bad.",
        subtext: "Psychology: Risk Tolerance & Intuition.",
        options: [
            { id: 'block', label: "Block it.", desc: "We don't spend money without validation.", signal: "Conductor/Risk Managed" },
            { id: 'trust', label: "Trust the Vision.", desc: "Data is past-tense. Intuition is future.", signal: "Rainmaker/Risk Acceptance" },
            { id: 'test', label: "Test it.", desc: "Run a micro-budget version to prove it.", signal: "Empirical/Mediator" }
        ]
    },
    {
        id: 'feedback',
        module: 'Module 4: Resilience & Culture',
        icon: MessageSquare,
        question: "Co-founder gives you harsh feedback in front of the team.",
        subtext: "Psychology: Agreeableness & Ego.",
        options: [
            { id: 'appreciate', label: "Appreciate it.", desc: "Radical candor makes us better.", signal: "Growth Mindset" },
            { id: 'defensive', label: "Defensive.", desc: "You should have done this in private.", signal: "Normative/Sensitive" },
            { id: 'counter', label: "Counter-Attack.", desc: "Fire back with their own flaws.", signal: "Toxic/Competing" }
        ]
    },
    {
        id: 'hiring',
        module: 'Module 3: Role Fit',
        icon: Users,
        question: "You have budget for one key hire.",
        subtext: "Psychology: Delegator Talent & Control.",
        options: [
            { id: 'senior', label: "Senior Expert.", desc: "Expensive, but needs zero management.", signal: "Delegator/Trust" },
            { id: 'juniors', label: "Two Juniors.", desc: "Cheaper, and I can mold them.", signal: "High Control/King" },
            { id: 'ops', label: "Admin/Ops.", desc: "Take grunt work off my plate.", signal: "Efficiency" }
        ]
    },
    {
        id: 'risk_guarantee',
        module: 'Module 4: Resilience & Culture',
        icon: Home,
        question: "To get a bridge loan, you must personally guarantee it with your home/assets.",
        subtext: "Psychology: Risk Acceptance.",
        options: [
            { id: 'sign', label: "Sign it.", desc: "I'm all in. Burn the boats.", signal: "High Risk/Gambler" },
            { id: 'refuse', label: "No way.", desc: "My family's security comes first.", signal: "Low Risk/Security" },
            { id: 'find_alt', label: "Find Alternatives.", desc: "Cut costs or find non-dilutive capital.", signal: "Resourceful/Prudent" }
        ]
    }
];
