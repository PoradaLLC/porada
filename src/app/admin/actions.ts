"use server";

import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const role = user.app_metadata?.role ?? user.user_metadata?.role;
  if (role !== "admin") throw new Error("Forbidden");
  return user;
}

// ─── Customer Management ───

export async function createCustomer(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;

  // Create Stripe customer if Stripe is configured
  let stripeCustomerId: string | null = null;
  if (process.env.STRIPE_SECRET_KEY) {
    const { stripe } = await import("@/lib/stripe");
    if (stripe) {
      const customer = await stripe.customers.create({
        name,
        email,
        phone: phone || undefined,
        metadata: { company: company || "" },
      });
      stripeCustomerId = customer.id;
    }
  }

  // Store in Supabase
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("customers").insert({
      name,
      email,
      company: company || null,
      phone: phone || null,
      stripe_customer_id: stripeCustomerId,
    });
  }

  revalidatePath("/admin/customers");
  return { success: true };
}

export async function deleteCustomer(customerId: string) {
  await requireAdmin();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("customers").delete().eq("id", customerId);
  }

  revalidatePath("/admin/customers");
  return { success: true };
}

// ─── Invoice / Charge Management ───

export async function createOneTimeCharge(formData: FormData) {
  await requireAdmin();

  const customerEmail = formData.get("customerEmail") as string;
  const amount = parseInt(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const stripeCustomerId = formData.get("stripeCustomerId") as string;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }

  const { stripe } = await import("@/lib/stripe");
  if (!stripe) throw new Error("Stripe not available");

  // Create an invoice item and invoice for the customer
  const invoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    collection_method: "send_invoice",
    days_until_due: 30,
    description,
  });

  await stripe.invoiceItems.create({
    customer: stripeCustomerId,
    amount,
    currency: "usd",
    description,
    invoice: invoice.id,
  });

  await stripe.invoices.sendInvoice(invoice.id);

  // Record in Supabase
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("payments").insert({
      customer_email: customerEmail,
      amount,
      description,
      status: "invoiced",
      mode: "payment",
      stripe_session_id: invoice.id,
    });
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin/customers");
  return { success: true };
}

export async function createSubscription(formData: FormData) {
  await requireAdmin();

  const stripeCustomerId = formData.get("stripeCustomerId") as string;
  const priceId = formData.get("priceId") as string;
  const customerEmail = formData.get("customerEmail") as string;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }

  const { stripe } = await import("@/lib/stripe");
  if (!stripe) throw new Error("Stripe not available");

  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  // Record in Supabase
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("payments").insert({
      customer_email: customerEmail,
      amount: 0,
      description: `Subscription: ${priceId}`,
      status: "active",
      mode: "subscription",
      stripe_session_id: subscription.id,
    });
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin/customers");
  return { success: true, subscriptionId: subscription.id };
}

export async function createStripeProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const amount = parseInt(formData.get("amount") as string);
  const recurring = formData.get("recurring") === "true";
  const interval = (formData.get("interval") as string) || "month";

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }

  const { stripe } = await import("@/lib/stripe");
  if (!stripe) throw new Error("Stripe not available");

  const product = await stripe.products.create({ name });

  const priceData: {
    product: string;
    unit_amount: number;
    currency: string;
    recurring?: { interval: "month" | "year" | "week" | "day" };
  } = {
    product: product.id,
    unit_amount: amount,
    currency: "usd",
  };

  if (recurring) {
    priceData.recurring = {
      interval: interval as "month" | "year" | "week" | "day",
    };
  }

  const price = await stripe.prices.create(priceData);

  revalidatePath("/admin/payments");
  return { success: true, productId: product.id, priceId: price.id };
}

// ─── Booking Management ───

export async function updateBookingStatus(bookingId: string, status: string) {
  await requireAdmin();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("bookings").update({ status }).eq("id", bookingId);
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function deleteBooking(bookingId: string) {
  await requireAdmin();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("bookings").delete().eq("id", bookingId);
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}
