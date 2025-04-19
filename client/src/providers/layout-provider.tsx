import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Check if the current route is the landing page or auth page
  const isPublicRoute = location === "/" || location.startsWith("/auth");

  // If it's a public route, don't wrap with the application layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      {/* Mobile Header - shown only on mobile */}
      {isMobile && <Header />}
      
      {/* Sidebar - hidden on mobile, shown on desktop */}
      <Sidebar />
      
      {/* Mobile Bottom Navigation - shown only on mobile */}
      {isMobile && <MobileNav />}
      
      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 pb-16">
        {children}
      </main>
    </SidebarProvider>
  );
}
