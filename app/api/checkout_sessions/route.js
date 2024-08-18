import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
	try {
		const params = {
			mode: "subscription",
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: { name: "Pro subscription" },
						unit_amount: 1000,
						recurring: { interval: "month", interval_count: 1 },
					},
					quantity: 1,
				},
			],
			success_url: `${process.env.BASE_URL}result?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.BASE_URL}result?session_id={CHECKOUT_SESSION_ID}`,
		};
		const checkoutSession = await stripe.checkout.sessions.create(params);
		return NextResponse.json(checkoutSession);
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return new NextResponse(
			JSON.stringify({ error: { message: error.message } }),
			{ status: 500 }
		);
	}
}
