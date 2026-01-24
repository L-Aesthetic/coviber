
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
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: Helvetica, Arial, sans-serif; color: #cccccc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0f0f0f; border: 1px solid #333333; border-radius: 12px; overflow: hidden; margin-top: 20px; margin-bottom: 20px;">
            
            <!-- Header -->
            <div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #333333; background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%);">
                <div style="font-size: 48px; margin-bottom: 10px;">${data.icon}</div>
                <h1 style="color: #ffffff; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">${archetype}</h1>
                <p style="color: ${data.color}; font-size: 16px; font-style: italic; margin-top: 8px;">"${data.headline}"</p>
            </div>

            <div style="padding: 30px;">
                
                <!-- Profile Analysis -->
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #ffffff; font-size: 18px; border-left: 3px solid ${data.color}; padding-left: 10px; margin-top: 0;">🧠 Deep Profile Analysis</h2>
                    <p style="line-height: 1.6; font-size: 15px;">${data.profile}</p>
                </div>

                <!-- Superpowers -->
                <div style="margin-bottom: 30px; background-color: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px;">
                    <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">⚡ The Superpowers</h2>
                    <p style="line-height: 1.6; font-size: 15px; margin-bottom: 15px;"><strong>${data.superpowerTitle}:</strong> ${data.superpowerDesc}</p>
                    <p style="line-height: 1.6; font-size: 15px;"><em>Why you are essential:</em> ${data.superpowerEssential}</p>
                </div>

                <!-- Fatal Flaws -->
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #ef4444; font-size: 18px; border-left: 3px solid #ef4444; padding-left: 10px; margin-top: 0;">💀 The Fatal Flaw</h2>
                    <p style="line-height: 1.6; font-size: 15px;"><strong>${data.flawTitle}:</strong> ${data.flawDesc}</p>
                </div>

                <!-- Match Protocol -->
                <div style="border: 1px solid ${data.color}; border-radius: 8px; padding: 25px; text-align: center; background-color: rgba(${data.rgb}, 0.1);">
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Compatibility Protocol</p>
                    <h3 style="margin: 10px 0; color: #ffffff; font-size: 20px;">Your Perfect Match: <span style="color: ${data.color};">${data.match}</span></h3>
                    <p style="font-size: 14px; line-height: 1.5; margin-bottom: 20px;">${data.matchWhy}</p>
                    
                    <a href="https://covibr.vercel.app/login" style="display: inline-block; background-color: ${data.color}; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 14px;">Find Your Co-Founder</a>
                </div>

            </div>

             <div style="padding: 20px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #333333;">
                <p>You are receiving this because you took the Founder Archetype protocol on CoVibr.</p>
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
