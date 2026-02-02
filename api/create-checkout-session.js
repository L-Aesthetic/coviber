import Stripe from 'stripe';

export default async function handler(req, res) {
    const safeError = (code, message, details = null) => {
        console.error(`Checkout API Error (${code}): ${message}`, details);
        return res.status(code).json({ error: message, details });
    };

    try {
        if (req.method !== 'POST') {
            return safeError(405, 'Method not allowed');
        }

        // 1. Check Key Presence
        if (!process.env.SUPABASE_STRIPE_SECRET_KEY) {
            return safeError(500, 'Server Config Error: Missing SUPABASE_STRIPE_SECRET_KEY');
        }

        // 2. Init Stripe (Lazy Load)
        const stripe = new Stripe(process.env.SUPABASE_STRIPE_SECRET_KEY);

        const { tier, userId, email, returnUrl } = req.body;

        if (!tier || !userId) {
            return safeError(400, 'Missing parameters: tier or userId');
        }

        let priceData = {};
        let mode = 'subscription';

        if (tier === 'pro') {
            priceData = {
                currency: 'usd',
                product_data: {
                    name: 'Pro Membership',
                    description: 'Unlimited Matches, Full Chemistry Tests, Deep Vibe Analytics',
                },
                unit_amount: 4900, // $49.00
                recurring: { interval: 'month' }
            };
            mode = 'subscription';
        } else if (tier === 'founder') {
            priceData = {
                currency: 'usd',
                product_data: {
                    name: 'Founding Member (Gold Card)',
                    description: 'Lifetime Access. First 100 Users Only.',
                },
                unit_amount: 1900, // $19.00
            };
            mode = 'payment';
        } else if (tier === 'certified') {
            priceData = {
                currency: 'usd',
                product_data: {
                    name: 'Certified Pair',
                    description: '48-Hour Chemistry Test, Official Report, IP Assignment Docs',
                },
                unit_amount: 39900, // $399.00
            };
            mode = 'payment';
        } else {
            return safeError(400, 'Invalid tier selected');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: priceData,
                quantity: 1,
            }],
            mode: mode,
            allow_promotion_codes: true, // Enable coupon field
            success_url: `${returnUrl}?success=true&tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl}?canceled=true`,
            customer_email: email,
            metadata: {
                userId,
                tier
            }
        });

        res.status(200).json({ sessionId: session.id, url: session.url });

    } catch (error) {
        return safeError(500, 'Internal Server Error', error.message);
    }
}
