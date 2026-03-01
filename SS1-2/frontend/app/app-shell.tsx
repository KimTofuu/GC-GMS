"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", iconClass: "fa-solid fa-table-columns" },
  { href: "/checklist", label: "Checklist", iconClass: "fa-solid fa-list-check" },
  { href: "/deliberation", label: "Deliberation", iconClass: "fa-solid fa-comments" },
];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const noShellRoutes = ["/login"];
  const shouldHideShell = noShellRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    const isFixedViewportRoute =
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/") ||
      pathname === "/checklist" ||
      pathname.startsWith("/checklist/");

    document.body.classList.toggle("dashboard-no-page-scroll", isFixedViewportRoute);
    document.documentElement.classList.toggle("dashboard-no-page-scroll", isFixedViewportRoute);

    return () => {
      document.body.classList.remove("dashboard-no-page-scroll");
      document.documentElement.classList.remove("dashboard-no-page-scroll");
    };
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  if (shouldHideShell) {
    return <>{children}</>;
  }

  return (
    <div className="dashboard-root">
      <header className="top-header">
        <div className="brand-icon" aria-hidden>
          <i className="fa-solid fa-graduation-cap" />
        </div>
        <div>
          <p className="brand-title">GC - GMS</p>
          <p className="brand-subtitle">Graduation Enrollment Checklist</p>
        </div>
      </header>

      <div className={`dashboard-shell ${isSidebarMinimized ? "sidebar-minimized" : ""}`.trim()}>
        <aside className="sidebar">
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarMinimized((prev) => !prev)}
            aria-label={isSidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
            type="button"
          >
            <i
              className={`fa-solid ${isSidebarMinimized ? "fa-angles-right" : "fa-angles-left"}`}
              aria-hidden
            />
          </button>

          <nav className="nav-menu" aria-label="Dashboard Navigation">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  className={`nav-item ${active ? "active" : ""}`.trim()}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="nav-icon" aria-hidden>
                    <i className={item.iconClass} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                  {active && (
                    <span className="nav-arrow" aria-hidden>
                      <i className="fa-solid fa-angle-right" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <Link className="nav-item settings" href="/dashboard">
            <span className="nav-icon" aria-hidden>
              <i className="fa-solid fa-gear" />
            </span>
            <span className="nav-label">Settings</span>
          </Link>
        </aside>

        {children}
      </div>
    </div>
  );
}