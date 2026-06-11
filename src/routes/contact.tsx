import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone, Send, ExternalLink, Star } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AS Classes" },
      { name: "description", content: "Get in touch with AS Classes — we'd love to help you find the right course." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  course_interest: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Tell us how we can help").max(2000),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    
    // Honeypot check
    const website = (fd.get("website") as string) || "";
    if (website && website.length > 0) {
      toast.success("Thanks! We'll get back to you within 24 hours.");
      (e.target as HTMLFormElement).reset();
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      course_interest: parsed.data.course_interest || null,
      message: parsed.data.message,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Thanks! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  };


  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Get in <span className="text-gradient">touch</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Have questions about courses, batches or fees? Drop us a message.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            {[
              { icon: Mail, label: "Email", value: <a href="mailto:ankursinghal0333@gmail.com" className="hover:text-accent transition-smooth">ankursinghal0333@gmail.com</a> },
              { icon: Phone, label: "Phone 1", value: <a href="tel:+917014853551" className="hover:text-accent transition-smooth">+91 7014853551</a> },
              { icon: Phone, label: "Phone 2", value: <a href="tel:+918239276617" className="hover:text-accent transition-smooth">+91 8239276617</a> },
              { 
                icon: MapPin, 
                label: "AS Library Address", 
                value: (
                  <a 
                    href="https://maps.app.goo.gl/G69eqi71KHqjrbU87" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-accent transition-smooth flex flex-wrap items-center gap-1 text-sm font-medium leading-relaxed group hover:underline"
                  >
                    8, Vivek Vihar, Near Bank of India, Jagatpura, Jaipur
                    <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-accent transition-smooth" />
                  </a>
                ) 
              },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border border-border bg-card p-4 transition-smooth hover:border-accent/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-hero">
                    <c.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{c.label}</div>
                    <div className="text-sm font-medium mt-0.5">{c.value}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Google Review Prompt Card */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 transition-smooth hover:border-accent/30 hover:shadow-glow/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-accent/5 rounded-bl-3xl -z-10 group-hover:bg-accent/10 transition-smooth" />
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-foreground">Love AS Classes?</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Help other students and parents find our library & classroom by leaving a review on Google!
                </p>
              </div>
              <a 
                href="https://maps.app.goo.gl/G69eqi71KHqjrbU87" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block pt-1"
              >
                <Button size="sm" variant="outline" className="w-full text-xs cursor-pointer border-border hover:bg-secondary flex items-center justify-center gap-1">
                  Write a Google Review <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 md:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              <Field name="name" label="Full name" required />
              <Field name="email" label="Email" type="email" required />
              <Field name="phone" label="Phone (optional)" />
              <Field name="course_interest" label="Course of interest" placeholder="e.g. Physics" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="How can we help you?"
              />
            </div>
            {/* Honeypot — hidden from users, bots fill all fields */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <Button type="submit" disabled={loading} className="bg-gradient-hero text-primary-foreground shadow-glow cursor-pointer">
              <Send className="mr-2 h-4 w-4" /> {loading ? "Sending..." : "Send message"}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field(props: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {props.label}
        {props.required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <input
        name={props.name}
        type={props.type ?? "text"}
        required={props.required}
        placeholder={props.placeholder}
        className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
