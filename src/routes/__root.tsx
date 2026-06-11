import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import logoAsset from "../assets/as-classes-logo.png";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-hero px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AS Classes" },
      {
        name: "description",
        content:
          "AS Classes offers live online courses in Maths, Science, English and Coding for classes 5–12 with expert mentors, weekly tests and doubt clearing.",
      },
      { property: "og:title", content: "AS Classes" },
      {
        property: "og:description",
        content:
          "Live online classes, doubt clearing and weekly tests for school and competitive exams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AS Classes" },
      { name: "description", content: "Ascend Academy Hub is a full-stack educational website for AS classes, featuring a logo, navigation, and chatbot." },
      { property: "og:description", content: "Ascend Academy Hub is a full-stack educational website for AS classes, featuring a logo, navigation, and chatbot." },
      { name: "twitter:description", content: "Ascend Academy Hub is a full-stack educational website for AS classes, featuring a logo, navigation, and chatbot." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/09f744e8-0eb3-41f6-8472-a19d21017ab4/id-preview-3377eec4--fe4fcf0c-e3e7-42fc-bfe7-a8d45d0b3d5a.lovable.app-1781101306740.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/09f744e8-0eb3-41f6-8472-a19d21017ab4/id-preview-3377eec4--fe4fcf0c-e3e7-42fc-bfe7-a8d45d0b3d5a.lovable.app-1781101306740.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: logoAsset, type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              const theme = localStorage.getItem('theme') || 'dark';
              if (theme === 'light') {
                document.documentElement.classList.add('light');
              } else {
                document.documentElement.classList.remove('light');
              }
            } catch (e) {}
          })();
        ` }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <SonnerToaster />
    </QueryClientProvider>
  );
}
