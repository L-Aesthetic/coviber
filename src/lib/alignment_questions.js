
import {
    Wallet,
    Scale,
    Users,
    Clock,
    Flame,
    MessageCircle,
    Globe,
    Briefcase,
    Shield,
    Target,
    Zap,
    Lock,
    RefreshCw
} from 'lucide-react';

export const ALIGNMENT_QUESTIONS = [
    // MODULE I: FINANCIAL & RISK ALIGNMENT
    {
        id: 'survival_number',
        module: 'Module 1: Financial & Risk',
        icon: Wallet,
        question: "What is your 'Survival Number' (minimum monthly income) vs. your 'Comfort Number'?",
        subtext: "If one founder needs $3k and the other needs $15k, resentment builds.",
        options: [
            { id: 'low', label: "Low (<$4k/mo).", desc: "I can survive on very little. Ramen profitability.", signal: "Low Burn/Bootstrapper" },
            { id: 'medium', label: "Medium ($5k-$10k/mo).", desc: "I have standard obligations (mortgage/rent).", signal: "Moderate/Market" },
            { id: 'high', label: "High (>$12k/mo).", desc: "I have significant fixed costs or family obligations.", signal: "High Burn/Experienced" }
        ]
    },
    {
        id: 'runway_tolerance',
        module: 'Module 1: Financial & Risk',
        icon: Clock,
        question: "We have $500k in the bank. Do we spend $50k/mo (10 months runway) or $20k/mo (25 months)?",
        subtext: "Growth vs. Survival Mindset.",
        options: [
            { id: 'growth', label: "Spend $50k/mo (Growth).", desc: "Aggressive hiring. Hit milestones for Series A or die trying.", signal: "Venture Scaler" },
            { id: 'survival', label: "Spend $20k/mo (Survival).", desc: "Extend runway. Avoid fundraising desperation.", signal: "Bootstrapper" },
            { id: 'hybrid', label: "Hybrid ($35k/mo).", desc: "Balance growth with safety.", signal: "Pragmatic" }
        ]
    },
    {
        id: 'personal_guarantee',
        module: 'Module 1: Financial & Risk',
        icon: Lock,
        question: "To get a corporate credit card or lease, a Personal Guarantee (PG) is required.",
        subtext: "Liability Asymmetry.",
        options: [
            { id: 'sign', label: "I will sign it.", desc: "I'm all in. I accept the personal risk.", signal: "High Risk Tolerance" },
            { id: 'never', label: "I will never sign.", desc: "My personal assets are off-limits.", signal: "Asset Protection" },
            { id: 'conditional', label: "Only if we split liability.", desc: "I sign only if you sign too, or if equity reflects this risk.", signal: "Transactional" }
        ]
    },

    // MODULE II: AMBITION & EXIT
    {
        id: 'rich_vs_king',
        module: 'Module 2: Ambition & Exit',
        icon: Shield,
        question: "Would you rather own 100% of a $5M business (Control) or 1% of a $1B business (Wealth)?",
        subtext: "Wasserman's Dilemma: You can't usually have both.",
        options: [
            { id: 'king', label: "100% of $5M (King).", desc: "I want autonomy and control above all.", signal: "King/Control" },
            { id: 'rich', label: "1% of $1B (Rich).", desc: "I want maximum financial impact, even if I'm replaced.", signal: "Rich/Wealth" },
            { id: 'hybrid', label: "Hybrid.", desc: "I want to grow big but keep control (very rare).", signal: "Optimist" }
        ]
    },
    {
        id: 'sell_out_price',
        module: 'Module 2: Ambition & Exit',
        icon: Target,
        question: "A competitor offers to buy us for $10M cash today. You walk away with $4M.",
        subtext: "Life-Changing Money Threshold.",
        options: [
            { id: 'sell', label: "Sell immediately.", desc: "That is life-changing security. Win secured.", signal: "Security Seeker" },
            { id: 'hold', label: "Reject. Too low.", desc: "We are building a unicorn. $10M is failure.", signal: "Empire Builder" },
            { id: 'negotiate', label: "Shop the offer.", desc: "See if we can get $15M, but likely sell.", signal: "Pragmatic Seller" }
        ]
    },

    // MODULE III: WORK ETHIC & CONSTRAINTS
    {
        id: 'work_intensity',
        module: 'Module 3: Work Ethic',
        icon: Zap,
        question: "Define 'Full Time' commitment.",
        subtext: "Sustainability vs. Intensity (The 'Hustle' Debate).",
        options: [
            { id: 'sprinter', label: "The Sprinter (60+ hrs).", desc: "Nights and weekends are fair game. Speed is everything.", signal: "Sprinter/Grind" },
            { id: 'marathoner', label: "The Marathoner (40-50 hrs).", desc: "Sustainable pace. Weekends are for rest to prevent burnout.", signal: "Marathoner/Sustainable" },
            { id: 'output', label: "Results Only.", desc: "I don't track hours. If I ship, I ship.", signal: "Output Focused" }
        ]
    },
    {
        id: 'side_hustle',
        module: 'Module 3: Work Ethic',
        icon: Briefcase,
        question: "Do you have active side projects, consulting gigs, or board seats?",
        subtext: "Focus Dilution.",
        options: [
            { id: 'exclusive', label: "Zero. Exclusive focus.", desc: "This startup is my only professional priority.", signal: "All-In" },
            { id: 'minor', label: "Minor Consulting.", desc: "I keep a small gig (<5hrs/week) for cash flow.", signal: "Hybrid/De-risked" },
            { id: 'portfolio', label: "Multiple Projects.", desc: "I run multiple ventures simultaneously.", signal: "Portfolio Founder" }
        ]
    },

    // MODULE IV: ROLES & AUTHORITY
    {
        id: 'ceo_deadlock',
        module: 'Module 4: Roles & Authority',
        icon: Users,
        question: "We strongly disagree on a fatal strategic choice (e.g., Pivot or Sell). Who breaks the tie?",
        subtext: "The 'Two-Headed Monster' Problem.",
        options: [
            { id: 'ceo', label: "The CEO decides.", desc: "We argue, but CEO has the final vote. Disagree and commit.", signal: "Hierarchy/Monarch" },
            { id: 'consensus', label: "Must agree (Consensus).", desc: "We effectively veto each other. No action without agreement.", signal: "Consensus/Risk" },
            { id: 'investor', label: "Board/Advisor decides.", desc: "We let an independent third party break the tie.", signal: "External Arbitration" }
        ]
    },
    {
        id: 'firing_founder',
        module: 'Module 4: Roles & Authority',
        icon: Flame,
        question: "What if one founder is underperforming?",
        subtext: "The Uncomfortable Conversation.",
        options: [
            { id: 'process', label: "Formal Process.", desc: "PIP (Performance Plan) -> Board Vote -> Termination.", signal: "Governance/Professional" },
            { id: 'impossible', label: "You can't fire a founder.", desc: "We are partners. We fix it or die together.", signal: "Marriage/Loyalty" },
            { id: 'buyout', label: "Buyout.", desc: "The company buys back their unvested shares.", signal: "Transactional" }
        ]
    },

    // MODULE V: EQUITY & STRUCTURE
    {
        id: 'split_logic',
        module: 'Module 5: Equity',
        icon: Scale,
        question: "How are we splitting equity?",
        subtext: "Static vs. Dynamic Equity.",
        options: [
            { id: 'equal', label: "50/50 Fixed.", desc: "We are partners. Future value is unknown, so we split equally.", signal: "Egalitarian/Static" },
            { id: 'dynamic', label: "Dynamic (Slicing Pie).", desc: "Based on contributions (cash, time, IP) until Series A.", signal: "Fairness/Dynamic" },
            { id: 'value', label: "Unequal / Value Based.", desc: "One puts in more risk/cash/IP, so they get more.", signal: "Meritocratic" }
        ]
    },
    {
        id: 'vesting_cliff',
        module: 'Module 5: Equity',
        icon: RefreshCw,
        question: "A founder leaves after 9 months. What do they keep?",
        subtext: "The Cliff Protection.",
        options: [
            { id: 'cliff', label: "Zero (Standard Cliff).", desc: "1-year cliff is mandatory. They leave with nothing.", signal: "Standard/Protected" },
            { id: 'pro_rata', label: "Pro-rata (No Cliff).", desc: "They keep 9 months worth of equity.", signal: "Founder Friendly/Risky" },
            { id: 'keep_all', label: "Everything.", desc: "We own our shares upfront.", signal: "Red Flag/Uninvestable" }
        ]
    }
];
