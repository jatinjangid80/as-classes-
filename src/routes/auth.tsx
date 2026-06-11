import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoAsset from "@/assets/as-classes-logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AS Classes" },
      { name: "description", content: "Sign in or create your AS Classes account." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
  full_name: z.string().trim().max(100).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const signInWithGoogle = async () => {
    setLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      setLoading(false);
      const message =
        error.message.includes("provider is not enabled")
          ? "Google sign-in is not enabled yet. Enable the Google provider in Supabase (Authentication → Providers → Google) and add your Google OAuth Client ID and Secret."
          : error.message;
      toast.error(message);
      return;
    }
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setLoading(false);
    toast.error("Could not start Google sign-in. Please try again.");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: parsed.data.full_name ?? "" },
        },
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Account created! You're signed in.");
      navigate({ to: "/dashboard" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <SiteLayout>
      <section className="container mx-auto flex max-w-md flex-col items-center px-4 py-16">
        <img src={logoAsset} alt="AS Classes" className="h-16 w-16 object-contain" />
        <h1 className="mt-4 font-display text-3xl font-bold">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to continue learning." : "Join AS Classes in seconds."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 w-full space-y-4 rounded-2xl border border-border bg-card p-6">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm font-medium">Full name</label>
              <input name="full_name" required className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input name="email" type="email" required className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input name="password" type="password" required minLength={6} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-hero text-primary-foreground shadow-glow">
            {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </Button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase">Or continue with</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={signInWithGoogle}
            className="w-full bg-transparent border-border hover:bg-secondary flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Google
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full text-center text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
