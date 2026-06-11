import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/as-classes-logo.png";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src={logoAsset} alt="AS Classes" className="h-10 w-10" />
            <span className="font-display text-lg font-bold">
              AS <span className="text-gradient">Classes</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Empowering students with personalised learning, expert mentors and a tech-first classroom.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/courses" className="hover:text-foreground">Courses</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/auth" className="hover:text-foreground">Sign in</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> ankursinghal0333@gmail.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +91 7014853551</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +91 8239276617</li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <a 
                href="https://maps.app.goo.gl/G69eqi71KHqjrbU87" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline hover:text-foreground transition-smooth"
              >
                8, Vivek Vihar, Near Bank of India, Jagatpura, Jaipur
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground space-y-1">
        <p>© {new Date().getFullYear()} AS Classes. All rights reserved.</p>
        <p className="text-muted-foreground/70">
          Created by <span className="text-accent font-semibold">Jatin Jangid</span>. For any queries, <Link to="/contact" className="hover:text-accent hover:underline transition-smooth">contact me</Link>.
        </p>
      </div>
    </footer>
  );
}
