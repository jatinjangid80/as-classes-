import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Inbox,
  Phone,
  Mail,
  BookMarked,
  Calendar,
  Copy,
  CheckCircle,
  ExternalLink,
  Award,
  ChevronRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AS Classes" }] }),
  component: Dashboard,
});

const FALLBACK_COURSES = [
  {
    id: "fb-1",
    title: "Mathematics Mastery",
    subject: "Mathematics",
    duration: "6 months",
    price: 4999,
    level: "Class 9-12"
  },
  {
    id: "fb-2",
    title: "Physics Powerhouse",
    subject: "Physics",
    duration: "8 months",
    price: 6499,
    level: "Class 11-12"
  },
  {
    id: "fb-3",
    title: "Chemistry Champion",
    subject: "Chemistry",
    duration: "8 months",
    price: 5999,
    level: "Class 11-12"
  }
];

function Dashboard() {
  const { user } = Route.useRouteContext();
  const [activeTab, setActiveTab] = useState<"learning" | "enquiries">("learning");

  // Fetch profiles metadata for full name
  const { data: profile } = useQuery({
    queryKey: ["dashboard-profile"],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) {
        console.warn("Profile fetch error:", error);
        return null;
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: courses } = useQuery({
    queryKey: ["dashboard-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id,title,subject,duration,level,price").limit(3);
      return data ?? [];
    },
  });

  const { data: enquiries, isLoading: loadingEnquiries } = useQuery({
    queryKey: ["dashboard-enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("Enquiries fetch error:", error);
        return [];
      }
      return data ?? [];
    },
  });

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Student";
  const displayEmail = user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  const handleCopyDetails = (e: any) => {
    const text = `Name: ${e.name}\nEmail: ${e.email}\nPhone: ${e.phone || "N/A"}\nCourse: ${e.course_interest || "N/A"}\nMessage: ${e.message}`;
    navigator.clipboard.writeText(text);
    toast.success("Enquiry details copied to clipboard!");
  };

  // Decide which courses to show: Supabase db courses if they exist, otherwise elegant fallback recommendations
  const coursesToRecommend = courses && courses.length > 0 ? courses : FALLBACK_COURSES;

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-12 max-w-6xl space-y-10">

        {/* Sleek Glassmorphic Welcome Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border/65 bg-card/45 backdrop-blur-xl p-8 shadow-elegant transition-smooth hover:border-accent/25">
          {/* Neon radial glow in background */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground font-display font-bold text-3xl shadow-glow">
                {initial}
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-background border border-border">
                  <UserCheck className="h-3.5 w-3.5 text-accent" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold tracking-wider uppercase">Student Portal</span>
                </div>
                <h1 className="mt-1 font-display text-2xl font-bold text-foreground md:text-3xl">
                  {displayName}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {displayEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Button variant="outline" className="border-border cursor-pointer">Edit Profile</Button>
              </Link>
              <Link to="/courses">
                <Button className="bg-gradient-hero text-primary-foreground shadow-glow cursor-pointer">Explore Courses</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-5 flex items-center justify-between transition-smooth hover:border-accent/25 hover:bg-card/50">
            <div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Courses</span>
              <h3 className="text-2xl font-bold mt-1">0 Enrolled</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-5 flex items-center justify-between transition-smooth hover:border-accent/25 hover:bg-card/50">
            <div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Inbox Enquiries</span>
              <h3 className="text-2xl font-bold mt-1">{enquiries ? enquiries.length : 0} Submitted</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Inbox className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-5 flex items-center justify-between transition-smooth hover:border-accent/25 hover:bg-card/50">
            <div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Account Badge</span>
              <h3 className="text-2xl font-bold mt-1 text-accent flex items-center gap-1.5">
                <Award className="h-5 w-5" /> Verified
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* TABS BAR */}
        <div className="flex gap-4 border-b border-border/60 pb-px">
          <button
            onClick={() => setActiveTab("learning")}
            className={`pb-4 text-sm font-semibold border-b-2 cursor-pointer transition-smooth ${activeTab === "learning" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Learning Center
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`pb-4 text-sm font-semibold border-b-2 cursor-pointer transition-smooth ${activeTab === "enquiries" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Enquiries Inbox ({enquiries ? enquiries.length : 0})
          </button>
        </div>

        {/* CONTENT SECTIONS */}
        {activeTab === "learning" ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-card p-6 flex flex-col justify-between">
              <div>
                <BookOpen className="h-7 w-7 text-accent" />
                <h3 className="mt-4 font-display text-xl font-bold">Continue Learning</h3>
                <p className="mt-2 text-sm text-muted-foreground">You haven't enrolled in an active course yet. Join a course to track your live learning path.</p>
              </div>
              <Link to="/courses" className="mt-6">
                <Button size="sm" className="w-full bg-gradient-hero text-primary-foreground cursor-pointer">Browse available courses</Button>
              </Link>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 md:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div>
                  <h3 className="font-display text-lg font-bold">Recommended for you</h3>
                  <p className="text-xs text-muted-foreground">Top-rated curriculum classes</p>
                </div>
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {coursesToRecommend.map((c: any) => (
                  <div key={c.id} className="group rounded-xl border border-border/50 bg-background/50 p-4 transition-smooth hover:border-accent/30 hover:bg-background">
                    <div className="text-xs font-semibold text-accent uppercase tracking-wider">{c.subject}</div>
                    <h4 className="mt-1 font-display font-bold text-sm text-foreground line-clamp-1 group-hover:text-accent transition-smooth">{c.title}</h4>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{c.level || "Class 9-12"}</span>
                      <span>{c.duration}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                      <div className="text-sm font-bold text-foreground">
                        {c.price ? `₹${Number(c.price).toLocaleString("en-IN")}` : "Free"}
                      </div>
                      <Link to="/courses">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs hover:text-accent cursor-pointer flex items-center gap-0.5">
                          Details <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold">Student Enquiries</h3>
                <p className="text-sm text-muted-foreground">Messages submitted through the public contact form</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Inbox className="h-5 w-5" />
              </div>
            </div>

            {loadingEnquiries ? (
              <div className="text-center py-12 text-sm text-muted-foreground">Loading enquiries...</div>
            ) : !enquiries || enquiries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center bg-card/25">
                <Inbox className="mx-auto h-12 w-12 text-muted-foreground/60 animate-pulse" />
                <h4 className="mt-4 font-semibold text-lg">No enquiries found</h4>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  When visitors submit enquiries via the Contact form, their queries will load and display here instantly.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {enquiries.map((e: any) => (
                  <div key={e.id} className="group rounded-2xl border border-border/60 bg-card p-6 space-y-4 transition-smooth hover:border-accent/40 hover:shadow-glow/5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-lg font-bold text-foreground group-hover:text-accent transition-smooth">{e.name}</h4>
                          {e.course_interest && (
                            <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent border border-accent/20">
                              <BookMarked className="mr-1 h-3 w-3" /> {e.course_interest}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                          <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 hover:text-accent transition-smooth">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground/80" /> {e.email}
                          </a>
                          {e.phone && (
                            <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 hover:text-accent transition-smooth">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground/80" /> {e.phone}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(e.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl bg-input/40 border border-border/30 p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {e.message}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-border/30 pt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyDetails(e)}
                        className="h-8 border-border hover:bg-secondary cursor-pointer flex items-center gap-1.5 text-xs"
                      >
                        <Copy className="h-3.5 w-3.5" /> Copy Details
                      </Button>
                      <a
                        href={`mailto:${e.email}?subject=Response from AS Classes for your Enquiry&body=Hi ${e.name},%0D%0A%0D%0AThank you for contacting AS Classes. We received your message:%0D%0A"${e.message}"%0D%0A%0D%0A`}
                      >
                        <Button
                          size="sm"
                          className="h-8 bg-gradient-hero text-primary-foreground shadow-glow cursor-pointer flex items-center gap-1.5 text-xs"
                        >
                          <Mail className="h-3.5 w-3.5" /> Reply Email
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
