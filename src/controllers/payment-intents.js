const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = process.env.CURRENCY;

const payment_intents = async (req, res) => {
	if (req.method === "POST") {
		try {
			// Assuming req.body is already parsed
			const { amount } = req.body;

			const paymentIntent = await stripe.paymentIntents.create({
				amount: amount * 100, // Convert to cents
				currency: currency.toLowerCase(), // Convert currency to lowercase
			});

			return res
				.status(200)
				.json({ client_secret: paymentIntent.client_secret });
		} catch (err) {
			console.error(err); // Log the error for debugging
			return res
				.status(500)
				.json({ success: false, message: "Internal server error" });
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
};

module.exports = { payment_intents };
