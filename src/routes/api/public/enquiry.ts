import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit.server";

const Schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  course_interest: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
  // Honeypot — real users leave this empty; bots fill all fields.
  website: z.string().max(0).optional().or(z.literal("")),
});

export const Route = createFileRoute("/api/public/enquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        const host = request.headers.get("host");
        if (origin && host) {
          try {
            if (new URL(origin).host !== host) {
              return new Response("Forbidden", { status: 403 });
            }
          } catch {
            return new Response("Forbidden", { status: 403 });
          }
        }

        const ip = getClientIp(request);
        const rl = rateLimit(`enquiry:${ip}`, 5, 60 * 60_000);
        if (!rl.ok) {
          return new Response("Too many submissions — please try again later.", {
            status: 429,
            headers: { "Retry-After": String(rl.retryAfter) },
          });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = Schema.safeParse(raw);
        if (!parsed.success) {
          return new Response("Invalid submission", { status: 400 });
        }
        // Honeypot triggered — silently accept to avoid bot signal.
        if (parsed.data.website && parsed.data.website.length > 0) {
          return Response.json({ ok: true });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!SUPABASE_SERVICE_ROLE_KEY) {
          console.log("[Dev Fallback] Contact enquiry received:", parsed.data);
          // Simulate latency
          await new Promise((resolve) => setTimeout(resolve, 500));
          return Response.json({ ok: true });
        }

        const { error } = await supabaseAdmin.from("enquiries").insert({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          course_interest: parsed.data.course_interest || null,
          message: parsed.data.message,
        });
        if (error) {
          console.error("[enquiry] insert failed", error);
          return new Response("Could not save enquiry", { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
