# Convex Stripe Template

To test, follow these steps:

1. Sign up for Stripe for free at https://stripe.com/
2. [Install the stripe CLI](https://stripe.com/docs/stripe-cli)
3. Run

```
stripe listen --forward-to localhost:5173/stripe
```

4. Copy the "Your webhook signing secret" from the output of the `listen` command, and set it as `STRIPE_WEBHOOKS_SECRET` environment variable on your Convex dashboard
5. Copy your test secret API key from the code example on https://stripe.com/docs/checkout/quickstart and set it as `STRIPE_KEY` environment variable on your Convex dashboard

You can then use the test credit card details to go through the payment flow, see https://stripe.com/docs/checkout/quickstart#testing
