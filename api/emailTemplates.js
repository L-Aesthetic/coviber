
export const getArchetypeEmail = (archetype) => {
    const data = getArchetypeData(archetype);

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your CoVibr Archetype: ${archetype}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #cccccc; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.5);">
            
            <!-- Header -->
            <div style="padding: 40px 30px 30px; text-align: center; border-bottom: 1px solid #27272a; background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 100%);">
                <img src="https://covibr.vercel.app/logo-full.png" alt="CoVibr" style="height: 60px; margin-bottom: 24px; display: block; margin-left: auto; margin-right: auto;" />
                <div style="font-size: 48px; margin-bottom: 16px; line-height: 1;">${data.icon}</div>
                <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">${archetype}</h1>
                <p style="color: ${data.color}; font-size: 14px; font-weight: 600; margin: 0; letter-spacing: 0.5px;">"${data.headline}"</p>
            </div>

            <div style="padding: 30px;">
                
                <!-- Profile Analysis (Free) -->
                <div style="margin-bottom: 32px;">
                    <h2 style="color: #ffffff; font-size: 14px; border-left: 2px solid ${data.color}; padding-left: 12px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">🧠 Unlocked: Psychology Profile</h2>
                    <p style="line-height: 1.6; font-size: 15px; margin: 0; color: #a1a1aa;">${data.profile}</p>
                </div>

                <!-- Superpowers (Free) -->
                <div style="margin-bottom: 32px; background-color: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                    <h2 style="color: #ffffff; font-size: 14px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">⚡ Unlocked: Your Superpower</h2>
                    <p style="line-height: 1.6; font-size: 14px; margin: 0 0 8px; color: #d4d4d8;"><strong>${data.superpowerTitle}</strong></p>
                    <p style="line-height: 1.6; font-size: 14px; margin: 0; color: #a1a1aa;">${data.superpowerDesc}</p>
                </div>

                <!-- Fatal Flaws (LOCKED) -->
                <div style="margin-bottom: 24px; position: relative;">
                    <h2 style="color: #ef4444; font-size: 14px; display: flex; align-items: center; gap: 8px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">
                        <span>💀 The Fatal Flaw</span>
                        <span style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">LOCKED</span>
                    </h2>
                    <p style="line-height: 1.6; font-size: 15px; margin: 0; color: #52525b;">
                        This is the #1 reason startups led by ${archetype}s fail before Series A. Without a specific counter-balance, you will default to...
                    </p>
                    <div style="margin-top: 8px; filter: blur(5px); opacity: 0.5; user-select: none; color: #a1a1aa;">
                        You tend to over-optimize everything before validation. You will build a beautiful cathedral in the desert that nobody visits because you focused on architecture instead of...
                    </div>
                </div>

                <!-- Match Protocol (LOCKED) -->
                <div style="border: 1px dashed #3f3f46; border-radius: 12px; padding: 30px; text-align: center; background: rgba(0,0,0,0.2);">
                    <div style="font-size: 24px; margin-bottom: 12px;">🔒</div>
                    <h3 style="margin: 0 0 8px; color: #ffffff; font-size: 18px;">Your Co-Founder Match</h3>
                    <p style="font-size: 14px; line-height: 1.5; margin: 0 0 24px; color: #a1a1aa;">
                        We identified <strong>1 specific archetype</strong> that balances your fatal flaw. <br/>
                        (Hint: It's NOT who you think.)
                    </p>
                    
                    <a href="https://covibr.com/login?ref=report" target="_blank" style="display: inline-block; background-color: ${data.color}; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(${data.rgb}, 0.3);">
                        Unlock Full Report
                    </a>
                </div>

            </div>

             <div style="padding: 24px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #27272a; background-color: #050505;">
                <p style="margin: 0;">Included in your Free Diagnostic.<br/>Upgrade to Founding 100 for proper legal & equity analysis.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const getIntroEmail = (recipientName, senderName, message, senderProfileUrl) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Intro Request: ${senderName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #cccccc; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.5);">
            
            <!-- Header -->
            <div style="padding: 30px; text-align: center; border-bottom: 1px solid #27272a; background: linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, rgba(0,0,0,0) 100%);">
                <div style="font-size: 40px; margin-bottom: 12px;">🚀</div>
                <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">New Co-Founder Match</h1>
            </div>

            <div style="padding: 30px;">
                <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px; color: #e4e4e7;">
                    Hi <strong>${recipientName}</strong>,
                </p>
                <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px; color: #a1a1aa;">
                    <strong>${senderName}</strong> viewed your profile on CoVibr and thinks you could be a great match. They've requested an intro called:
                </p>

                <!-- Message Card -->
                <div style="background-color: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 32px; font-style: italic; color: #d4d4d8;">
                    "${message}"
                </div>

                <div style="text-align: center;">
                    <a href="https://covibr.com/dashboard?tab=requests" target="_blank" style="display: inline-block; background-color: #6366F1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                        View Profile & Accept Intro
                    </a>
                </div>
                
                <p style="font-size: 12px; margin-top: 24px; text-align: center; color: #71717a;">
                    You can view their full psychometric profile before accepting.
                </p>

            </div>
            
            <div style="padding: 24px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #27272a; background-color: #050505;">
                <p style="margin: 0;">CoVibr • Build together. Ship faster. Split fairly.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

const getArchetypeData = (name) => {
    // Normalize input
    const key = name?.toLowerCase().trim();

    const db = {
        'the architect': {
            icon: '🏛️',
            color: '#3b82f6', // Blue
            rgb: '59, 130, 246',
            headline: 'The Code is the Product.',
            profile: 'You are the Veteran Builder. You view software engineering not as a means to an end, but as a craft. You value Legacy, Control, and Truth. While others sell dreams, you stay up at 3 AM worrying about database concurrency.',
            superpowerTitle: 'The Deep Work Engine',
            superpowerDesc: 'You can hold entire system architectures in your mind and code for 12 hours straight.',
            superpowerEssential: 'You build the actual asset that gives the company value. You create the "Sleep at Night" factor for the team.',
            flawTitle: 'The "Gold-Plating" Trap',
            flawDesc: 'You are statistically likely to build a perfect product that nobody wants. You prioritize scalability before you have users.',
            match: 'THE SOVEREIGN ⚡',
            matchWhy: 'You need a Pirate. You need someone to sell the vision and force you to ship "good enough" code while you ensure their promises get fulfilled.',
        },
        'the sovereign': {
            icon: '⚡',
            color: '#8b5cf6', // Purple
            rgb: '139, 92, 246',
            headline: 'Burn the Boats.',
            profile: 'You are a Wartime Captain. You operate on "Vibes" and intuition. You prioritize Speed, Wealth, and Dominance. You view Process as the enemy of Progress.',
            superpowerTitle: 'The Reality Distortion Field',
            superpowerDesc: 'You can convince investors and hires to believe in a future that is mathematically unlikely.',
            superpowerEssential: 'You generate momentum out of thin air. You are the "Zero to One" engine.',
            flawTitle: 'The "House of Cards" Trap',
            flawDesc: 'You often sell the dream before the reality exists. Without checks, you will scale a broken system until it collapses.',
            match: 'THE OPERATOR 🎯',
            matchWhy: 'You need an Adult in the room. You need someone to force you to take risks and generate the raw energy that you can then organize.',
        },
        'the operator': {
            icon: '🎯',
            color: '#22c55e', // Green
            rgb: '34, 197, 94',
            headline: 'Order from Chaos.',
            profile: 'You are the Systems Thinker and the "Adult in the Room." You view a startup as a Machine that needs to be tuned. You thrive on clarity, efficiency, and execution.',
            superpowerTitle: 'The Execution Engine',
            superpowerDesc: 'You turn vague goals into specific JIRA tickets. You remove ambiguity.',
            superpowerEssential: 'You are the bridge that translates the Sovereign\'s manic vision into actionable tasks. You protect the company\'s resources.',
            flawTitle: 'The Optimization Trap',
            flawDesc: 'You might optimize funnels for a product that has no market fit. You struggle with "Irrational Bets" that look bad on a spreadsheet.',
            match: 'THE SOVEREIGN ⚡',
            matchWhy: 'You need a wild card. You need someone to force you to take risks and generate the raw energy that you can then organize.',
        },
        'the hustler': {
            icon: '🚀',
            color: '#F97316', // Orange
            rgb: '249, 115, 22',
            headline: 'Sales Cures All.',
            profile: 'You are the Velocity Engine. You believe that "Perfect is the enemy of Good." While others debate strategy, you are DMing 50 leads. You operate with High Agency and relentless output.',
            superpowerTitle: 'The Traction Flywheel',
            superpowerDesc: 'You generate momentum out of thin air. You don\'t wait for permission or resources; you hack it together and sell it.',
            superpowerEssential: 'You force the market to pay attention. You turn a "quiet launch" into a noisy event through sheer force of will.',
            flawTitle: 'The Burnout Trap',
            flawDesc: 'You often mistake motion for progress. You scale noise instead of signal, burning through cash and relationships to hit vanity metrics.',
            match: 'THE ARCHITECT 🏛️',
            matchWhy: 'You need a Product Anchor. You need someone to actually BUILD what you are selling, ensuring that your aggressive promises don\'t result in 100% churn.',
        }
    };

    // Fallback to Sovereign if not found, or match partial key
    if (key.includes('architect')) return db['the architect'];
    if (key.includes('sovereign')) return db['the sovereign'];
    if (key.includes('operator')) return db['the operator'];
    if (key.includes('hustler')) return db['the hustler'];

    return db['the sovereign']; // Default
};
