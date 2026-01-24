
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
        <div style="max-width: 640px; margin: 40px auto; background-color: #0f0f0f; border: 1px solid #222222; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.5);">
            
            <!-- Header -->
            <div style="padding: 40px 30px 30px; text-align: center; border-bottom: 1px solid #222222; background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 100%);">
                <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">${data.icon}</div>
                <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">${archetype}</h1>
                <p style="color: ${data.color}; font-size: 15px; font-weight: 500; margin: 0;">"${data.headline}"</p>
            </div>

            <div style="padding: 30px;">
                
                <!-- Profile Analysis -->
                <div style="margin-bottom: 32px;">
                    <h2 style="color: #ffffff; font-size: 16px; border-left: 2px solid ${data.color}; padding-left: 12px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">🧠 Deep Profile Analysis</h2>
                    <p style="line-height: 1.6; font-size: 15px; margin: 0; color: #a1a1aa;">${data.profile}</p>
                </div>

                <!-- Superpowers -->
                <div style="margin-bottom: 32px; background-color: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    <h2 style="color: #ffffff; font-size: 16px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">⚡ The Superpowers</h2>
                    <p style="line-height: 1.6; font-size: 15px; margin: 0 0 12px; color: #a1a1aa;"><strong style="color: #e4e4e7;">${data.superpowerTitle}:</strong> ${data.superpowerDesc}</p>
                    <p style="line-height: 1.6; font-size: 15px; margin: 0; color: #a1a1aa;"><em style="color: #d4d4d8;">Why you are essential:</em> ${data.superpowerEssential}</p>
                </div>

                <!-- Fatal Flaws -->
                <div style="margin-bottom: 40px;">
                    <h2 style="color: #ef4444; font-size: 16px; border-left: 2px solid #ef4444; padding-left: 12px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">💀 The Fatal Flaw</h2>
                    <p style="line-height: 1.6; font-size: 15px; margin: 0; color: #a1a1aa;"><strong style="color: #e4e4e7;">${data.flawTitle}:</strong> ${data.flawDesc}</p>
                </div>

                <!-- Match Protocol -->
                <div style="border: 1px solid ${data.color}; border-radius: 12px; padding: 30px; text-align: center; background: radial-gradient(circle at center, rgba(${data.rgb}, 0.1) 0%, rgba(0,0,0,0) 70%);">
                    <p style="margin: 0 0 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #71717a; font-weight: 600;">Compatibility Protocol</p>
                    <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 20px;">Your Perfect Match: <span style="color: ${data.color};">${data.match}</span></h3>
                    <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; color: #a1a1aa;">${data.matchWhy}</p>
                    
                    <a href="https://covibr.vercel.app/landing" target="_blank" style="display: inline-block; background-color: ${data.color}; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(${data.rgb}, 0.3);">Find Your Co-Founder</a>
                </div>

            </div>

             <div style="padding: 24px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #222222; background-color: #0a0a0a;">
                <p style="margin: 0;">You are receiving this because you initiated the protocol on CoVibr.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

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
            matchWhy: 'You need an Adult in the room. You need someone who converts your chaos into systems and is the only person you respect enough to listen to when they say "No".',
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
        }
    };

    // Fallback to Sovereign if not found, or match partial key
    if (key.includes('architect')) return db['the architect'];
    if (key.includes('sovereign')) return db['the sovereign'];
    if (key.includes('operator')) return db['the operator'];

    return db['the sovereign']; // Default
};
