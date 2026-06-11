import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, Target, Users, Sparkles, GraduationCap } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import heroImage from "@/assets/as classes.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AS Classes" },
      { name: "description", content: "AS Classes is on a mission to make world-class learning accessible to every student in India." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Heart, title: "Student first", desc: "Every decision starts with how it helps the student grow." },
  { icon: Target, title: "Outcome-driven", desc: "We measure success by your results, not our marketing." },
  { icon: Users, title: "Community", desc: "Learning together with mentors and peers who care." },
  { icon: Award, title: "Excellence", desc: "Top-quality content, taught by India's best teachers." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            About <span className="text-gradient">AS Classes</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            AS Classes was founded by Ankur Singhal with a single, clear objective: to make high-quality coaching accessible and outcome-driven. We merge rigorous conceptual teaching, personalization, and interactive learning to help every student aim high and succeed.
          </p>
        </div>

        {/* FOUNDER & VISION */}
        <div className="mt-20 grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-hero opacity-30 blur-2xl" />
            <img
              src={heroImage}
              alt="Ankur Singhal and AS Classes student achievers"
              width={1024}
              height={683}
              className="relative w-full rounded-3xl border border-border shadow-elegant object-cover"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Founder & Director
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold">
              Meet <span className="text-gradient">Ankur Singhal</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              With years of experience in mentorship and academic training, Ankur Singhal started AS Classes to bridge the gap between classroom teaching and competitive performance. 
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              His student-first approach ensures that learning isn't just about memorizing formulas, but developing a deep, logical understanding of Maths and Sciences. Today, AS Classes is a proud community of achievers aiming for excellence in every field.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">Aiming for Excellence</div>
                <div className="text-xs text-muted-foreground">Guiding students to their dream colleges and boards</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="font-display text-3xl font-bold">Our Core Values</h2>
          <p className="mt-2 text-muted-foreground">The foundation of every lesson we teach.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                <v.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-10 rounded-3xl border border-border bg-card p-10 md:grid-cols-3">
          {[
            { value: "1,000+", label: "Top board scores" },
            { value: "15+", label: "Expert mentors" },
            { value: "98%", label: "Satisfaction rate" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl font-bold text-gradient">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
