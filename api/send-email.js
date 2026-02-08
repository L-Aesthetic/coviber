
import { Resend } from 'resend';
import { getArchetypeEmail, getIntroEmail } from './emailTemplates.js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (needed to look up user emails by ID)
// Note: This requires SUPABASE_SERVICE_ROLE_KEY to be set in Vercel env
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

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

        const { type } = request.body;

        // 2. Validate API Key
        if (!process.env.RESEND_API_KEY) {
            return safeError(500, 'Server Configuration Error: Missing RESEND_API_KEY');
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        let email, htmlContent, subject, recipientName;

        // === TYPE 1: ARCHETYPE RESULT (Original) ===
        if (!type || type === 'archetype') {
            const { email: targetEmail, archetype } = request.body;
            if (!targetEmail || !archetype) return safeError(400, 'Missing email or archetype');

            email = targetEmail;
            subject = `Your Founder Archetype: ${archetype}`;
            try {
                htmlContent = getArchetypeEmail(archetype);
            } catch (e) {
                return safeError(500, 'Template Error', e.message);
            }
        }

        // === TYPE 2: INTRO REQUEST (New) ===
        else if (type === 'intro') {
            const { targetUserId, senderName, message } = request.body;
            if (!targetUserId || !senderName) return safeError(400, 'Missing targetUserId or senderName');

            if (!supabaseAdmin) {
                return safeError(500, 'Server Config Error: Missing Service Role Key');
            }

            // A. Lookup Target Email
            // Method 1: Try auth.users (requires service role)
            const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(targetUserId);

            if (userError || !userData?.user) {
                // Method 2: Fallback to public profiles if auth lookup fails (and if we store email there, which we might not for privacy)
                console.warn("Auth lookup failed, trying profiles...", userError);
                // For now, fail safely if we can't get the email via Admin.
                return safeError(404, 'User not found or email unavailable');
            }

            email = userData.user.email;
            recipientName = userData.user.user_metadata?.full_name || "Founder";
            subject = `🚀 New Co-Founder Match: ${senderName}`;

            try {
                htmlContent = getIntroEmail(recipientName, senderName, message, null);
            } catch (e) {
                return safeError(500, 'Template Error', e.message);
            }
        }

        else {
            return safeError(400, 'Invalid email type');
        }

        // 3. Send Email
        const { data, error } = await resend.emails.send({
            from: 'CoVibr <founder@covibr.com>',
            to: [email],
            subject: subject,
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
