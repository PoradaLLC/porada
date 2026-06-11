import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof ContactSchema>;

export const BookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  message: z.string().optional(),
});

export type BookingFormData = z.infer<typeof BookingSchema>;

export const InvoiceCreateSchema = z.object({
  customer_email: z.string().email("Invalid email address"),
  customer_name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1, "Description is required").max(500),
  amount_cents: z.coerce
    .number()
    .int("Amount must be a whole number of cents")
    .positive("Amount must be greater than zero")
    .max(10_000_000, "Amount may not exceed $100,000"),
});

export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;
