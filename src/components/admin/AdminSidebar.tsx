"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Mountain,
  LayoutDashboard,
  ClipboardList,
  Package,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/bookings",
    label: "Booking",
    icon: ClipboardList,
  },
  {
    href: "/admin/items",
    label: "Kelola Alat",
    icon: Package,
  },
];

interface AdminSidebarProps {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar.");
    router.push("/admin/login");
    router.refresh();
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Mountain className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground leading-none">
            sewa_in.tgr
          </p>
          <p className="text-xs text-muted-foreground leading-none mt-0.5">
            Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-sidebar-border px-3 py-4 space-y-2">
        <p className="truncate px-3 text-xs text-muted-foreground">
          {userEmail}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          id="btn-logout"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile: Hamburger button */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 z-40 h-full w-60 border-r border-sidebar-border bg-sidebar">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
