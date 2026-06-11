import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Users, BookOpen, Trophy, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/as classes.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AS Classes — Live online coaching for school & competitive exams" },
      { name: "description", content: "Join AS Classes for live online courses in Maths, Science, English and Coding. Expert mentors, weekly tests, doubt clearing — all in one place." },
    ],
  }),
  component: Home,
});

type Course = {
  id: string; title: string; subject: string; description: string;
  level: string; duration: string; price: number;
};

function Home() {
  const { data: courses } = useQuery({
    queryKey: ["courses-featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, subject, description, level, duration, price")
        .limit(3);
      if (error) throw error;
      return data as Course[];
    },
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-radial">
        <div className="container mx-auto grid items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Aiming for excellence...
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
              AS Classes <span className="text-gradient">By Ankur Singhal</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Empowering students to dream big, aim high, and achieve academic excellence. Experience premium quality coaching with personalized mentorship.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/courses">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90">
                  Explore Courses <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Book a free demo</Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> 1,000+ top scores</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> Expert mentorship</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> Aiming for excellence</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-hero opacity-30 blur-2xl" />
            <img
              src={heroImage}
              alt="AS Classes Success Celebration with Ankur Singhal and students"
              width={1536}
              height={1024}
              className="relative w-full rounded-3xl border border-border shadow-elegant object-cover"
            />
          </div>
        </div>
      </section>

      {/* ACHIEVERS & CELEBRATION */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Celebrating <span className="text-gradient">Student Success</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            We celebrate the accomplishments of our hard-working students and dedicated mentors. Together, we turn ambition into reality.
          </p>
        </div>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-elegant">
              <img
                src={heroImage}
                alt="AS Classes Success Celebration with Ankur Singhal and students"
                width={1024}
                height={683}
                className="w-full rounded-2xl object-cover"
              />
              <div className="absolute top-6 left-6 rounded-full bg-background/80 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
                🏆 Success Felicitation Ceremony
              </div>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-6 transition-smooth hover:border-accent/40">
              <h3 className="font-display text-lg font-bold text-accent">"Dream Big & Aim High"</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We inspire students to push their boundaries, build strong fundamentals, and target outstanding ranks in board exams and competition.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 transition-smooth hover:border-accent/40">
              <h3 className="font-display text-lg font-bold text-accent">"Focus On Your Dream"</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Through customized guidance, structured weekly tests, and one-on-one doubt clarification sessions with Ankur Singhal and our team, we keep students aligned.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 transition-smooth hover:border-accent/40">
              <h3 className="font-display text-lg font-bold text-accent">"You Can Do It"</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Building confidence is our priority. By simplifying complex concepts in Maths and Science, we make learning active, engaging, and highly successful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto grid grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {[
          { icon: Users, label: "Students", value: "10K+" },
          { icon: BookOpen, label: "Courses", value: "25+" },
          { icon: Trophy, label: "Top scorers", value: "500+" },
          { icon: Sparkles, label: "Avg rating", value: "4.9" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 text-center">
            <s.icon className="mx-auto h-6 w-6 text-accent" />
            <div className="mt-2 font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURED COURSES */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Featured Courses</h2>
            <p className="mt-2 text-muted-foreground">Hand-picked programs taught by our top mentors.</p>
          </div>
          <Link to="/courses" className="hidden text-sm font-medium text-accent hover:underline md:inline">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {(courses ?? []).map((c) => (
            <div key={c.id} className="group rounded-2xl border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">{c.subject}</div>
              <h3 className="mt-2 font-display text-xl font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-bold">₹{c.price.toLocaleString("en-IN")}</span>
                <span className="text-xs text-muted-foreground">{c.duration} · {c.level}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: "Live + Recorded", desc: "Attend live, revisit anytime via recorded lectures." },
            { title: "Personal mentors", desc: "1-on-1 guidance from teachers who actually care." },
            { title: "Weekly tests", desc: "Track progress with structured assessments and analytics." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-8">
        <div className="rounded-3xl border border-border bg-gradient-hero p-10 text-center shadow-elegant">
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to start learning?
          </h2>
          <p className="mt-3 text-primary-foreground/90">Sign up free and book your first demo class today.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button size="lg" variant="secondary">Create free account</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Talk to us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
