import { Resend } from 'resend';
import { getArchetypeEmail } from './emailTemplates.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { email, archetype } = request.body;

    if (!email || !archetype) {
        return response.status(400).json({ error: 'Missing email or archetype' });
    }

    // DEBUG: Check if Key is loaded
    if (!process.env.RESEND_API_KEY) {
        console.error("CRITICAL: RESEND_API_KEY is missing in process.env!");
        return response.status(500).json({ error: "Server Configuration Error: Missing API Key" });
    } else {
        console.log("RESEND_API_KEY is loaded. Attempting to send...");
    }

    try {
        const htmlContent = getArchetypeEmail(archetype);

        const { data, error } = await resend.emails.send({
            from: 'CoVibr <onboarding@resend.dev>', // UPDATE: Use this until you verify 'covibr.com' in Resend Dashboard
            to: [email],
            subject: `Your Founder Archetype: ${archetype}`,
            html: htmlContent,
        });

        if (error) {
            console.error('Resend Error:', error);
            return response.status(400).json({ error });
        }

        return response.status(200).json({ data });
    } catch (e) {
        console.error('Server Error:', e);
        return response.status(500).json({ error: e.message });
    }
}
