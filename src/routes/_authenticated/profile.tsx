import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Mail, Shield, Save, Key, Award } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — AS Classes" },
      { name: "description", content: "Manage your AS Classes account profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [targetExams, setTargetExams] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user);
        setName(data.user.user_metadata?.full_name || "");
        
        // Initial fallbacks from user metadata
        setClassLevel(data.user.user_metadata?.class_level || "");
        setTargetExams(data.user.user_metadata?.target_exams || []);

        try {
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .maybeSingle();
          if (dbProfile) {
            if (dbProfile.full_name) setName(dbProfile.full_name);
            if (dbProfile.class_level) setClassLevel(dbProfile.class_level);
            if (dbProfile.target_exams) setTargetExams(dbProfile.target_exams);
          }
        } catch (err) {
          console.warn("Could not query DB profiles table:", err);
        }
      }
    });
  }, []);

  const handleToggleExam = (exam: string) => {
    if (targetExams.includes(exam)) {
      setTargetExams(targetExams.filter((t) => t !== exam));
    } else {
      setTargetExams([...targetExams, exam]);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Save to Auth User Metadata
    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: { 
        full_name: name,
        class_level: classLevel,
        target_exams: targetExams
      },
    });

    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    // Save to profiles database table (cast to any for non-regenerated type flexibility)
    try {
      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          class_level: classLevel,
          target_exams: targetExams
        } as any)
        .eq("id", user.id);
      if (dbError) {
        console.warn("DB profiles update failed:", dbError);
      }
    } catch (err) {
      console.warn("Could not update public.profiles DB table:", err);
    }
    
    setLoading(false);
    toast.success("Profile updated successfully!");
    if (authData.user) setUser(authData.user);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setPasswordLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password changed successfully!");
    setNewPassword("");
  };

  if (!user) {
    return (
      <SiteLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-muted-foreground animate-pulse">Loading profile...</div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display text-4xl font-bold md:text-5xl">
          My <span className="text-gradient">Profile</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings, academic grade, and target examinations.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {/* PROFILE SUMMARY */}
          <div className="rounded-2xl border border-border bg-card p-6 md:col-span-1 flex flex-col items-center text-center justify-center h-fit">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground font-semibold text-3xl shadow-glow">
              {name.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">{name || "User"}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{user.email}</p>
            <div className="mt-6 w-full border-t border-border pt-4 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-accent" /> Role: Student / Learner
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" /> Status: Verified Account
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-accent" /> Category: {classLevel ? (
                  classLevel === "5-9" ? "Classes 5 to 9" :
                  classLevel === "11" ? "Class 11" :
                  classLevel === "12" ? "Class 12" :
                  "Competitive Prep"
                ) : "Not Selected"}
              </div>
              {targetExams && targetExams.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Award className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>Target: {targetExams.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          {/* EDIT SECTIONS */}
          <div className="space-y-6 md:col-span-2">
            {/* PERSONAL & ACADEMIC INFO FORM */}
            <form onSubmit={handleUpdateProfile} className="rounded-2xl border border-border bg-card p-6 space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" /> Personal Information
                </h3>
                <div className="grid gap-4 mt-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Email Address (Read-only)</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm text-muted-foreground outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border/60 pt-6">
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" /> Academic Details
                </h3>
                <div className="grid gap-5 mt-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Class / Category</label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    >
                      <option value="">Select your class/category</option>
                      <option value="5-9">Classes 5 to 9</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                      <option value="competitive">Competitive Exams (JEE / NEET / CUET / NDA)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Target Competitive Exams</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {["JEE", "NEET", "CUET", "NDA"].map((exam) => {
                        const isChecked = targetExams.includes(exam);
                        return (
                          <button
                            key={exam}
                            type="button"
                            onClick={() => handleToggleExam(exam)}
                            className={`flex items-center justify-between rounded-lg border p-2.5 text-xs font-semibold transition-smooth cursor-pointer ${
                              isChecked
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border bg-input/40 text-muted-foreground hover:border-border/80 hover:text-foreground"
                            }`}
                          >
                            <span>{exam}</span>
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded border shrink-0 ${
                                isChecked
                                  ? "border-accent bg-accent text-primary-foreground"
                                  : "border-muted-foreground/60 bg-transparent"
                              }`}
                            >
                              {isChecked && (
                                <svg
                                  className="h-3 w-3 stroke-[3px]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="bg-gradient-hero text-primary-foreground shadow-glow cursor-pointer">
                <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>

            {/* SECURITY FORM */}
            <form onSubmit={handleChangePassword} className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Key className="h-5 w-5 text-accent" /> Change Password
              </h3>
              <div>
                <label className="mb-1 block text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button type="submit" disabled={passwordLoading} variant="outline" className="border-border cursor-pointer">
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
