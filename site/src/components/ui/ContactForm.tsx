"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, type ContactFormData } from "@/lib/validators";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-12 w-12 text-brand-accent mb-4" />
        <h3 className="font-mono text-xl font-bold text-foreground">Message Sent</h3>
        <p className="mt-2 text-sm text-brand-text">We&apos;ll get back to you within 24 hours.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-sm text-brand-accent hover:text-brand-accent-light transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
            Name *
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 font-mono text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
            Email *
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
            placeholder="john@company.com"
          />
          {errors.email && <p className="mt-1 font-mono text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
            Phone
          </label>
          <input
            id="phone"
            {...register("phone")}
            className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="company" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
            Company
          </label>
          <input
            id="company"
            {...register("company")}
            className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
          Subject *
        </label>
        <select
          id="subject"
          {...register("subject")}
          className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
        >
          <option value="">Select a subject...</option>
          <option value="Web Development">Web Development</option>
          <option value="Cloud Solutions">Cloud Solutions</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Tech Consulting">Tech Consulting</option>
          <option value="General Inquiry">General Inquiry</option>
        </select>
        {errors.subject && <p className="mt-1 font-mono text-xs text-red-400">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors resize-none"
          placeholder="Tell us about your project..."
        />
        {errors.message && <p className="mt-1 font-mono text-xs text-red-400">{errors.message.message}</p>}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <p className="font-mono text-xs text-red-400">Something went wrong. Please try again.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-8 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
