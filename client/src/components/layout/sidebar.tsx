import { Link, useLocation } from "wouter";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { isMobile } = useMobile();
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
    { path: "/contracts", label: "Contracts", icon: "ri-file-text-line" },
    { path: "/scheduling", label: "Scheduling", icon: "ri-calendar-line" },
    { path: "/payments", label: "Payments", icon: "ri-secure-payment-line" },
    { path: "/client-portal", label: "Client Portal", icon: "ri-user-star-line" },
  ];

  const settingsItems = [
    { path: "/settings", label: "Account Settings", icon: "ri-settings-4-line" },
    { path: "/team", label: "Team Members", icon: "ri-team-line" },
  ];

  if (isMobile && !isSidebarOpen) {
    return (
      <>
        {/* Mobile Sidebar Overlay */}
        <div 
          className={cn(
            "fixed inset-0 bg-slate-900/50 z-40",
            isSidebarOpen ? "block" : "hidden"
          )}
          onClick={closeSidebar}
        />
      </>
    );
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobile && (
        <div 
          className={cn(
            "fixed inset-0 bg-slate-900/50 z-40",
            isSidebarOpen ? "block" : "hidden"
          )}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm z-50",
          isMobile ? "transform transition-transform duration-300" : "hidden lg:flex",
          isMobile && !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="p-5 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary-600 flex items-center justify-center text-white font-bold">CP</div>
              <span className="font-bold text-xl text-primary-600">ClientPath</span>
            </div>
            {isMobile && (
              <button type="button" className="p-2 rounded-md text-slate-500" onClick={closeSidebar}>
                <i className="ri-close-line text-xl"></i>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Turn client chaos into a smooth path forward</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              onClick={isMobile ? closeSidebar : undefined}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg",
                isActive(item.path) 
                  ? "bg-primary-50 text-primary-600" 
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <i className={cn(item.icon, "text-lg")}></i>
              <span className={isActive(item.path) ? "font-medium" : ""}>{item.label}</span>
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-200">
            <p className="px-3 text-xs font-medium text-slate-400 uppercase">Settings</p>
            {settingsItems.map((item) => (
              <Link 
                key={item.path}
                href={item.path}
                onClick={isMobile ? closeSidebar : undefined}
                className={cn(
                  "mt-2 flex items-center space-x-3 px-3 py-2 rounded-lg",
                  isActive(item.path) 
                    ? "bg-primary-50 text-primary-600" 
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <i className={cn(item.icon, "text-lg")}></i>
                <span className={isActive(item.path) ? "font-medium" : ""}>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="font-medium text-primary-700">JS</span>
            </div>
            <div>
              <p className="font-medium text-slate-700">John Smith</p>
              <p className="text-xs text-slate-500">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
