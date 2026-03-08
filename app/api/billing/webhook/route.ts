import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ use service role, not anon key
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  // 1. Verify the webhook is genuinely from Stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2. Handle the events that matter for Pro access
  switch (event.type) {
    // ✅ Grant Pro — subscription created or reactivated
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const isActive = sub.status === "active" || sub.status === "trialing";

      await supabase
        .from("users")
        .update({
          is_pro: isActive,
          plan: isActive ? "pro" : "free",
          stripe_subscription_id: sub.id,
        })
        .eq("stripe_customer_id", sub.customer as string);
      break;
    }

    // ❌ Revoke Pro — subscription cancelled or payment failed
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;

      await supabase
        .from("users")
        .update({ is_pro: false, plan: "free", stripe_subscription_id: null })
        .eq("stripe_customer_id", sub.customer as string);
      break;
    }

    // 🔗 Link Stripe customer ID to your user on checkout
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.customer_email) {
        await supabase
          .from("users")
          .update({ stripe_customer_id: session.customer as string })
          .eq("email", session.customer_email);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
