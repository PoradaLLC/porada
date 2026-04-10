"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingSchema, type BookingFormData } from "@/lib/validators";
import { Calendar, CheckCircle, AlertCircle, Loader2, Clock } from "lucide-react";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const services = [
  "Web Development Consultation",
  "Cloud Architecture Review",
  "UI/UX Design Sprint",
  "Tech Stack Audit",
  "General Discussion",
];

export function BookingForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema),
  });

  const selectedDate = watch("date");

  // Generate available dates (next 14 business days)
  const availableDates = useMemo(() => {
    const dates: string[] = [];
    const today = new Date();
    let d = new Date(today);
    d.setDate(d.getDate() + 1); // start from tomorrow
    while (dates.length < 14) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        dates.push(d.toISOString().split("T")[0]);
      }
      d.setDate(d.getDate() + 1);
    }
    return dates;
  }, []);

  async function onSubmit(data: BookingFormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to book");
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
        <h3 className="font-mono text-xl font-bold text-foreground">Consultation Booked!</h3>
        <p className="mt-2 text-sm text-brand-text">
          You&apos;ll receive a confirmation email with meeting details shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-sm text-brand-accent hover:text-brand-accent-light transition-colors"
        >
          Book another consultation
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="booking-name" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
            Name *
          </label>
          <input
            id="booking-name"
            {...register("name")}
            className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 font-mono text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="booking-email" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
            Email *
          </label>
          <input
            id="booking-email"
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
          <label htmlFor="booking-phone" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
            Phone
          </label>
          <input
            id="booking-phone"
            {...register("phone")}
            className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="booking-company" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
            Company
          </label>
          <input
            id="booking-company"
            {...register("company")}
            className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <div>
        <label htmlFor="booking-service" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
          Service *
        </label>
        <select
          id="booking-service"
          {...register("service")}
          className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
        >
          <option value="">Select a service...</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.service && <p className="mt-1 font-mono text-xs text-red-400">{errors.service.message}</p>}
      </div>

      {/* Date Selection */}
      <div>
        <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-3">
          <Calendar className="inline h-3 w-3 mr-1" />
          Select Date *
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
          {availableDates.map((date) => {
            const d = new Date(date + "T12:00:00");
            const isSelected = selectedDate === date;
            return (
              <label
                key={date}
                className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                  isSelected
                    ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
                    : "border-brand-accent/10 bg-brand-primary/30 text-brand-text hover:border-brand-accent/30"
                }`}
              >
                <input
                  type="radio"
                  value={date}
                  {...register("date")}
                  className="sr-only"
                />
                <div className="font-mono text-[10px] uppercase">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="font-mono text-sm font-bold">
                  {d.getDate()}
                </div>
                <div className="font-mono text-[10px]">
                  {d.toLocaleDateString("en-US", { month: "short" })}
                </div>
              </label>
            );
          })}
        </div>
        {errors.date && <p className="mt-1 font-mono text-xs text-red-400">{errors.date.message}</p>}
      </div>

      {/* Time Selection */}
      <div>
        <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-3">
          <Clock className="inline h-3 w-3 mr-1" />
          Select Time (EST) *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {timeSlots.map((time) => {
            const watchTime = watch("time");
            const isSelected = watchTime === time;
            return (
              <label
                key={time}
                className={`cursor-pointer rounded-lg border px-4 py-3 text-center font-mono text-sm transition-all ${
                  isSelected
                    ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
                    : "border-brand-accent/10 bg-brand-primary/30 text-brand-text hover:border-brand-accent/30"
                }`}
              >
                <input
                  type="radio"
                  value={time}
                  {...register("time")}
                  className="sr-only"
                />
                {time}
              </label>
            );
          })}
        </div>
        {errors.time && <p className="mt-1 font-mono text-xs text-red-400">{errors.time.message}</p>}
      </div>

      <div>
        <label htmlFor="booking-message" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
          Additional Details
        </label>
        <textarea
          id="booking-message"
          rows={3}
          {...register("message")}
          className="w-full rounded-lg border border-brand-accent/10 bg-brand-primary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors resize-none"
          placeholder="Brief description of your project or what you'd like to discuss..."
        />
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
            Booking...
          </>
        ) : (
          <>
            <Calendar className="h-4 w-4" />
            Book Consultation
          </>
        )}
      </button>
    </form>
  );
}
