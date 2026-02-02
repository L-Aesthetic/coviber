import Stripe from 'stripe';

const stripe = new Stripe(process.env.SUPABASE_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { tier, userId, email, returnUrl } = req.body;

    if (!tier || !userId) {
        return res.status(400).json({ error: 'Missing parameters' });
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
            unit_amount: 1900, // $19.00 (Updated from $49 based on 60% off promo mentioned in UI)
            // Wait, UI said $49... but then "60% OFF ($19)". Let's honor the $19 price point for "Members" if that's the current deal.
            // Re-reading UpgradePage.jsx: 
            // "price: 19, originalPrice: '$49', isOneTime: true"
            // So the CHARGE should be $19.00 (1900 cents).
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
            // No recurring for one-time
        };
        mode = 'payment';
    } else {
        return res.status(400).json({ error: 'Invalid tier selected' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: priceData,
                quantity: 1,
            }],
            mode: mode,
            success_url: `${returnUrl}?success=true&tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl}?canceled=true`,
            customer_email: email,
            metadata: {
                userId,
                tier
            }
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
}
