import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    const finishSignIn = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const errorDescription = params.get("error_description");

      if (errorDescription) {
        if (!cancelled) {
          setStatus("error");
          toast.error(decodeURIComponent(errorDescription));
        }
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) {
            setStatus("error");
            toast.error(error.message);
          }
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        if (!cancelled) {
          setStatus("error");
          toast.error(error?.message ?? "Sign-in could not be completed. Please try again.");
        }
        return;
      }

      if (!cancelled) {
        toast.success("Signed in with Google!");
        navigate({ to: "/dashboard", replace: true });
      }
    };

    void finishSignIn();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <SiteLayout>
      <section className="container mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        {status === "loading" ? (
          <>
            <h1 className="font-display text-2xl font-bold">Completing sign-in…</h1>
            <p className="mt-2 text-sm text-muted-foreground">Please wait while we connect your Google account.</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold">Sign-in failed</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Google sign-in could not be completed. Return to the sign-in page and try again.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/auth" })}
              className="mt-6 text-sm font-medium text-primary hover:underline"
            >
              Back to sign in
            </button>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
