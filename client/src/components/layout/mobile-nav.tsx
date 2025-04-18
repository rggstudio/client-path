import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/invoices", label: "Invoices", icon: "ri-file-list-3-line" },
    { path: "/proposals", label: "Proposals", icon: "ri-file-paper-2-line" },
    { path: "/scheduling", label: "Schedule", icon: "ri-calendar-line" },
    { path: "/more", label: "More", icon: "ri-menu-line" }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-sm z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4",
              isActive(item.path) ? "text-primary-600" : "text-slate-500"
            )}
          >
            <i className={cn(item.icon, "text-lg")}></i>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
