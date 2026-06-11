import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/as-classes-logo.png";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    // Detect initial theme
    const activeTheme = document.documentElement.classList.contains("light") ? "light" : "dark";
    setTheme(activeTheme);

    return () => sub.subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const profileName = user?.user_metadata?.full_name || user?.email || "User";
  const initial = profileName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <img src={logoAsset} alt="AS Classes" className="h-10 w-10 object-contain" />
          <span className="font-display text-lg font-bold tracking-tight">
            AS <span className="text-gradient">Classes</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="mr-1 h-9 w-9 rounded-full cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9 border border-border cursor-pointer transition-smooth hover:opacity-85">
                  <AvatarFallback className="bg-gradient-hero text-primary-foreground font-semibold text-sm">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profileName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/dashboard" className="flex w-full items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/profile" className="flex w-full items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          aria-label="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-full justify-start gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>Toggle {theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </Button>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <UserIcon className="h-4 w-4" /> My Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => { signOut(); setOpen(false); }} className="w-full justify-start gap-2 text-destructive">
                    <LogOut className="h-4 w-4" /> Sign out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full bg-gradient-hero text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
