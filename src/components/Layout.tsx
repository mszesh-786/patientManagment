import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/material/Button"; // New import
import { MadeWithDyad } from "./made-with-dyad";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"; // Keeping shadcn Sheet for now
import { MenuIcon } from "lucide-react";
import IconButton from '@mui/material/IconButton'; // For MenuIcon

const Layout: React.FC = () => {
  const { user, role, signOut } = useAuth();

  const navLinks = [
    { path: "/patients", label: "Patients", roles: ["admin", "practitioner"] },
    { path: "/calendar", label: "Calendar", roles: ["admin", "practitioner"] },
    { path: "/audit", label: "Audit Log", roles: ["admin"] },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            Clinic MVP
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            {user &&
              navLinks.map(
                (link) =>
                  role &&
                  link.roles.includes(role) && (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ),
              )}
            {user && (
              <Button variant="ghost" onClick={signOut} className="text-sm">
                Sign Out
              </Button>
            )}
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <IconButton color="inherit" size="medium"> {/* Use IconButton for MenuIcon */}
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </IconButton>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 py-6">
                  {user &&
                    navLinks.map(
                      (link) =>
                        role &&
                        link.roles.includes(role) && (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="text-lg font-medium hover:text-primary"
                          >
                            {link.label}
                          </Link>
                        ),
                    )}
                  {user && (
                    <Button variant="ghost" onClick={signOut} className="text-lg justify-start">
                      Sign Out
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-grow container py-8">
        <Outlet />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Layout;