import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    const { email, invoiceCode } = await req.json();

    if (!email || !invoiceCode) {
      return NextResponse.json(
        { error: "Email and invoice code are required" },
        { status: 400 }
      );
    }

    // Look up the invoice by ID (invoiceCode is the Stripe invoice ID)
    // Support both raw Stripe IDs (in_xxx) and our formatted codes (INV-xxx)
    const stripeId = invoiceCode.startsWith("INV-")
      ? invoiceCode.replace("INV-", "in_")
      : invoiceCode;

    const invoice = await stripe.invoices.retrieve(stripeId);

    // Verify the email matches the customer
    if (invoice.customer_email?.toLowerCase() !== email.toLowerCase()) {
      // Also check the customer object if email isn't on the invoice directly
      if (invoice.customer && typeof invoice.customer === "string") {
        const customer = await stripe.customers.retrieve(invoice.customer);
        if (
          "email" in customer &&
          customer.email?.toLowerCase() !== email.toLowerCase()
        ) {
          return NextResponse.json(
            { error: "Email does not match this invoice." },
            { status: 404 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Email does not match this invoice." },
          { status: 404 }
        );
      }
    }

    // Check invoice status
    if (invoice.status === "paid") {
      return NextResponse.json(
        { error: "This invoice has already been paid." },
        { status: 400 }
      );
    }

    if (invoice.status === "void" || invoice.status === "uncollectible") {
      return NextResponse.json(
        { error: "This invoice is no longer active." },
        { status: 400 }
      );
    }

    // Return the hosted invoice URL for payment
    const url = invoice.hosted_invoice_url;
    if (!url) {
      return NextResponse.json(
        { error: "No payment link available for this invoice." },
        { status: 400 }
      );
    }

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const stripeError = error as { type?: string };
    if (stripeError.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invoice not found. Double-check your code and try again." },
        { status: 404 }
      );
    }
    console.error("Invoice lookup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
