import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit.server";

const SYSTEM_PROMPT = `You are Aspira, the friendly AI assistant for AS Classes — an online educational coaching institute.

About AS Classes:
- Offers courses in Mathematics, Physics, Chemistry, Biology, English, and Coding for Kids (classes 5–12)
- Live online classes with expert mentors, weekly tests, doubt clearing sessions, and recorded lectures
- Targets school students (5th–10th) and competitive exam aspirants (JEE/NEET)
- Course fees range from ₹2,999 to ₹6,499 depending on duration (3–8 months)
- Free demo class available; students can enrol by signing up on the website or filling the contact form
- Support: ankursinghal0333@gmail.com / +91 7014853551 / +91 8239276617

Guidelines:
- Keep replies short, warm, and helpful (2–4 sentences max).
- If asked something unrelated to AS Classes or general education, politely steer the conversation back.
- Always end course recommendations by inviting them to "Browse Courses" or "Book a free demo".`;

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});
const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Origin check — block cross-origin abuse from other sites.
        const origin = request.headers.get("origin");
        const host = request.headers.get("host");
        if (origin && host) {
          try {
            const originHost = new URL(origin).host;
            if (originHost !== host) {
              return new Response("Forbidden", { status: 403 });
            }
          } catch {
            return new Response("Forbidden", { status: 403 });
          }
        }

        // Per-IP rate limit: 20 requests / minute.
        const ip = getClientIp(request);
        const rl = rateLimit(`chat:${ip}`, 20, 60_000);
        if (!rl.ok) {
          return new Response("Too many requests — please slow down.", {
            status: 429,
            headers: { "Retry-After": String(rl.retryAfter) },
          });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        let isLocalFallback = false;
        if (!apiKey) {
          isLocalFallback = true;
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = BodySchema.safeParse(raw);
        if (!parsed.success) {
          return new Response("Invalid messages payload", { status: 400 });
        }

        if (isLocalFallback) {
          const userMessages = parsed.data.messages.filter((m) => m.role === "user");
          const lastMsg = userMessages[userMessages.length - 1]?.content.toLowerCase() || "";
          
          let reply = "Hi! I am Aspira, your AS Classes assistant. I can help you with details about our courses, fees, admissions, and booking a free demo class. What would you like to know?";
          
          if (lastMsg.includes("course") || lastMsg.includes("subject") || lastMsg.includes("offer") || lastMsg.includes("teach") || lastMsg.includes("study") || lastMsg.includes("class")) {
            reply = "AS Classes offers live online courses in Mathematics, Physics, Chemistry, Biology, English, and Coding for Kids, tailored for classes 5–12. Our mentors conduct weekly tests and live doubt-clearing sessions. Would you like to check out our Courses page or book a free demo class?";
          } else if (lastMsg.includes("fee") || lastMsg.includes("cost") || lastMsg.includes("price") || lastMsg.includes("charge") || lastMsg.includes("pay") || lastMsg.includes("₹") || lastMsg.includes("rupee")) {
            reply = "Our course fees range from ₹2,999 to ₹6,499 depending on the subject and course duration (which ranges from 3 to 8 months). You can view the pricing directly on our Courses page. Would you like to book a free demo first?";
          } else if (lastMsg.includes("enrol") || lastMsg.includes("join") || lastMsg.includes("register") || lastMsg.includes("admission") || lastMsg.includes("signup") || lastMsg.includes("sign up") || lastMsg.includes("apply")) {
            reply = "Enrolling is simple! You can click the 'Get Started' button to create a free account, or drop us a line via our Contact page. We'll guide you through batch timings and payment options.";
          } else if (lastMsg.includes("demo") || lastMsg.includes("trial") || lastMsg.includes("free class")) {
            reply = "Yes, we offer free demo classes for all subjects! To book a demo class, head over to our Contact page, fill out your details, and specify your course of interest. We will get back to you within 24 hours.";
          } else if (lastMsg.includes("contact") || lastMsg.includes("support") || lastMsg.includes("phone") || lastMsg.includes("email") || lastMsg.includes("number") || lastMsg.includes("call") || lastMsg.includes("whatsapp")) {
            reply = "You can reach the AS Classes support team at ankursinghal0333@gmail.com or call/WhatsApp us directly at +91 7014853551 or +91 8239276617. We are here to answer all your academic and fee queries!";
          } else if (lastMsg.includes("ankur") || lastMsg.includes("singhal") || lastMsg.includes("founder") || lastMsg.includes("director") || lastMsg.includes("teacher")) {
            reply = "Ankur Singhal is the founder and director of AS Classes. He is a passionate educator who leads the faculty, ensuring excellent conceptual clarity, mentorship, and personalized doubt sessions for every student.";
          } else if (lastMsg.includes("hello") || lastMsg.includes("hi") || lastMsg.includes("hey")) {
            reply = "Hello! I am Aspira, your AS Classes assistant. How can I help you today? You can ask me about batches, fees, subjects, or how to book a free demo.";
          }

          // Simulate a short network latency for a realistic AI feel
          await new Promise((resolve) => setTimeout(resolve, 600));
          return Response.json({ reply });
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey!,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...parsed.data.messages],
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          if (res.status === 429) {
            return new Response("Too many requests — please slow down.", { status: 429 });
          }
          if (res.status === 402) {
            return new Response("AI credits exhausted. Please contact support.", { status: 402 });
          }
          return new Response(text || "AI gateway error", { status: 500 });
        }

        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const reply = data.choices?.[0]?.message?.content?.trim() ?? "Sorry, I couldn't generate a reply.";
        return Response.json({ reply });
      },
    },
  },
});
