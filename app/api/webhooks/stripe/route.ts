import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!secret || !stripeKey) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2026-05-27.dahlia" });
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid signature";
        return NextResponse.json({ error: message }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const quoteId = session.metadata?.quote_id;
        const userId = session.metadata?.user_id;

        if (quoteId && userId) {
            const supabase = createServiceClient();
            if (!supabase) {
                return NextResponse.json({ error: "Database not configured" }, { status: 500 });
            }

            await supabase
                .from("payments")
                .update({
                    status: "paid",
                    paid_at: new Date().toISOString(),
                    stripe_payment_intent_id:
                        typeof session.payment_intent === "string"
                            ? session.payment_intent
                            : session.payment_intent?.id ?? null,
                })
                .eq("stripe_session_id", session.id);

            await supabase
                .from("quotes")
                .update({
                    status: "accepted",
                    stripe_payment_intent_id:
                        typeof session.payment_intent === "string"
                            ? session.payment_intent
                            : session.payment_intent?.id ?? null,
                })
                .eq("id", quoteId);
        }
    }

    return NextResponse.json({ received: true });
}
