# 🍋 Lemon Squeezy: Test to Live Migration Guide

This checklist covers all the necessary steps to transition your payment integration from Test Mode to a fully functional, revenue-generating Live Mode.

> [!CAUTION]
> **Important:** Test Mode data (products, webhooks, orders) does **not** carry over to Live Mode in Lemon Squeezy. You must recreate your setup in the Live environment.

---

## 1. Lemon Squeezy Dashboard

Before making any code changes, configure your Live environment.

- [ ] **Activate Live Mode:** In the top left corner of the Lemon Squeezy dashboard, toggle the switch from "Test mode" to "Live mode".
- [ ] **Create Your Live Product:** Recreate the "Kettle Strat Pro" subscription product in your Live store. 
- [ ] **Copy the Live Checkout Link:** Once created, click "Share" on the new product and copy the Checkout Link. Note that the **Variant ID** at the end of the URL will be entirely new.
- [ ] **Generate Live API Key:** Go to Settings -> API and generate a new API Key for the Live environment.
- [ ] **Configure Live Webhook:**
    1. Go to Settings -> Webhooks and click the `+` icon.
    2. Set the URL to your live Vercel/Firebase production endpoint (e.g., `https://kettlestrat.com/api/webhook`).
    3. Select the specific events you want to listen to (e.g., `subscription_created`, `subscription_updated`).
    4. Generate and copy the new **Signing Secret**.

---

## 2. Codebase Changes (Strategy Labs)

You will need to update the hardcoded checkout link in your React application to point to the new Live product.

- [ ] **Update App.tsx:** Open `src/App.tsx` and locate the `handleUpgrade` function. Replace the `CHECKOUT_URL` string with the new Live link you copied from the dashboard.

```diff
  const handleUpgrade = async () => {
    if (!user || !profile) return;
    
-   const CHECKOUT_URL = "https://kettlestrat.lemonsqueezy.com/checkout/buy/63494c15-306e-437f-86e1-c07e367b37da"; // Test Variant
+   const CHECKOUT_URL = "https://kettlestrat.lemonsqueezy.com/checkout/buy/YOUR-NEW-LIVE-VARIANT-ID"; // Live Variant
    
    const checkoutWithParams = `${CHECKOUT_URL}?checkout[custom][user_id]=${user.uid}`;
    window.location.href = checkoutWithParams;
  };
```

> [!TIP]
> If you plan to toggle back and forth between Test and Live modes frequently in the future, consider moving the Variant ID into an environment variable (e.g., `import.meta.env.VITE_LEMON_SQUEEZY_VARIANT_ID`).

---

## 3. Vercel Configuration

Your production environment must be updated to securely store the new Live credentials.

- [ ] **Log into Vercel:** Go to your Kettle Strat project dashboard.
- [ ] **Navigate to Environment Variables:** Settings -> Environment Variables.
- [ ] **Update Webhook Secret:** Add or update the environment variable used to verify incoming webhook payloads (e.g., `LEMON_SQUEEZY_WEBHOOK_SECRET`) with the new Signing Secret you generated in Step 1.
- [ ] **Update API Key (If Applicable):** If your backend uses the Lemon Squeezy API to manage subscriptions or retrieve customer data, add the new Live API key (e.g., `LEMON_SQUEEZY_API_KEY`).
- [ ] **Trigger a Rebuild:** After saving the new environment variables and pushing your code changes to GitHub, trigger a new Production Deployment in Vercel to ensure the changes take effect.

---

## 4. Final Verification

> [!IMPORTANT]
> **Run a Live Test:** Before announcing the launch, use a real credit card to purchase a subscription on the live site. Verify that:
> 1. The payment is successfully processed in Lemon Squeezy.
> 2. The webhook successfully updates the user's `isPaidTier` status in Firebase.
> 3. The UI automatically unlocks Pro features.
> *(You can immediately refund yourself in the Lemon Squeezy dashboard after testing).*
