import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Clock, GraduationCap } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "All Courses — AS Classes" },
      { name: "description", content: "Browse all AS Classes courses across Maths, Physics, Chemistry, Biology, English and Coding." },
    ],
  }),
  component: CoursesPage,
});

type Course = {
  id: string; title: string; subject: string; description: string;
  level: string; duration: string; price: number; features: string[];
};

function CoursesPage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "5-9" | "11" | "12" | "competitive">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["courses-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("price");
      if (error) throw error;
      return data as Course[];
    },
  });

  const matchesTab = (course: Course) => {
    if (selectedTab === "all") return true;

    const titleLower = course.title.toLowerCase();
    const descLower = course.description.toLowerCase();
    const levelLower = course.level.toLowerCase();
    const subjectLower = course.subject.toLowerCase();

    if (selectedTab === "5-9") {
      return (
        levelLower.includes("5") || levelLower.includes("6") || 
        levelLower.includes("7") || levelLower.includes("8") || 
        levelLower.includes("9") || levelLower.includes("5-8") || 
        levelLower.includes("6-10")
      );
    }
    if (selectedTab === "11") {
      return levelLower.includes("11");
    }
    if (selectedTab === "12") {
      return levelLower.includes("12");
    }
    if (selectedTab === "competitive") {
      return (
        titleLower.includes("jee") || descLower.includes("jee") || levelLower.includes("jee") ||
        titleLower.includes("neet") || descLower.includes("neet") || levelLower.includes("neet") ||
        titleLower.includes("cuet") || descLower.includes("cuet") ||
        titleLower.includes("nda") || descLower.includes("nda")
      );
    }
    return true;
  };

  const filteredCourses = (data ?? []).filter(matchesTab);

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Our <span className="text-gradient">Courses</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-sm">
            Programs designed for every level — from foundational concepts to competitive exam mastery.
          </p>
        </div>

        {/* Filter Categories Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 border-b border-border/60 pb-4">
          {[
            { id: "all", label: "All Programs" },
            { id: "5-9", label: "Classes 5 to 9" },
            { id: "11", label: "Class 11" },
            { id: "12", label: "Class 12" },
            { id: "competitive", label: "Competitive (JEE/NEET/CUET/NDA)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-smooth cursor-pointer ${
                selectedTab === tab.id
                  ? "border-accent bg-accent/15 text-accent shadow-glow/10"
                  : "border-border bg-card/40 text-muted-foreground hover:border-border/80 hover:text-foreground hover:bg-card/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="mt-12 text-center text-muted-foreground animate-pulse">Loading courses…</div>
        ) : filteredCourses.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-border/60 p-12 text-center bg-card/20 max-w-md mx-auto">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/60 animate-bounce" />
            <h4 className="mt-4 font-semibold text-lg">Coming Soon!</h4>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              We are adding new sessions for this segment soon. Fill out our contact enquiry form to request priority updates!
            </p>
            <Link to="/contact">
              <Button size="sm" className="mt-6 bg-gradient-hero text-primary-foreground shadow-glow cursor-pointer">Enquire Now</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((c) => (
              <div key={c.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-smooth hover:border-accent/50 hover:shadow-glow/10 group">
                <div>
                  <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/25">
                    <GraduationCap className="h-3.5 w-3.5" /> {c.subject}
                  </div>
                  <h3 className="font-display text-xl font-bold group-hover:text-accent transition-smooth">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-accent shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.duration}</span>
                    <span>·</span>
                    <span>{c.level}</span>
                  </div>
                  <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                    <div>
                      <div className="text-2xl font-bold">₹{c.price.toLocaleString("en-IN")}</div>
                      <div className="text-xs text-muted-foreground">one-time fee</div>
                    </div>
                    <Link to="/contact">
                      <Button size="sm" className="bg-gradient-hero text-primary-foreground shadow-glow cursor-pointer">Enrol Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
