import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { useMobile } from "@/hooks/use-mobile";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { isMobile } = useMobile();

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
