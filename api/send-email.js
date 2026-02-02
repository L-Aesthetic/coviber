import { Resend } from 'resend';
import { getArchetypeEmail } from './emailTemplates.js';

export default async function handler(request, response) {
    // 1. Safe JSON Error Helper
    const safeError = (code, message, details = null) => {
        console.error(`API Error (${code}): ${message}`, details);
        return response.status(code).json({ error: { message, details } });
    };

    try {
        if (request.method !== 'POST') {
            return safeError(405, 'Method not allowed');
        }

        const { email, archetype } = request.body;

        if (!email || !archetype) {
            return safeError(400, 'Missing email or archetype');
        }

        // 2. Validate API Key
        if (!process.env.RESEND_API_KEY) {
            return safeError(500, 'Server Configuration Error: Missing RESEND_API_KEY');
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        // 3. Generate HTML (Safe)
        let htmlContent;
        try {
            htmlContent = getArchetypeEmail(archetype);
        } catch (templateError) {
            return safeError(500, 'Template Generation Failed', templateError.message);
        }

        // 4. Send Email
        const { data, error } = await resend.emails.send({
            from: 'CoVibr <founder@covibr.com>', // MUST be verified domain
            to: [email],
            subject: `Your Founder Archetype: ${archetype}`,
            html: htmlContent,
        });

        if (error) {
            return safeError(400, 'Resend API Error', error);
        }

        return response.status(200).json({ data });

    } catch (e) {
        // 5. Catch-All for Crash
        return safeError(500, 'Internal Server Error', e.message);
    }
}
