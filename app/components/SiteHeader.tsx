"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/tracker", label: "Tracker" },
  { href: "/tips", label: "Tips & tricks" },
  { href: "/#tutorials", label: "Tutorials" },
  { href: "https://rid2caltopo.discourse.group/", label: "Forum", external: true },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * One header for every page: logo + icon, a persistent Download link, and the
 * primary destinations. Below 800px the destinations collapse into a menu
 * button; the Download link stays visible in the header bar.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Escape closes the menu; so does a click or focus move outside the header.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: Event) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <Link className="brand" href="/" aria-label="RID2Caltopo home">
        <img
          className="brand-mark"
          src="/icon-64.png"
          width={28}
          height={28}
          alt=""
          aria-hidden="true"
        />
        <span>
          RID<span className="brand-two">2</span>CalTopo
        </span>
      </Link>

      <nav
        id="site-nav"
        className={`site-nav${open ? " is-open" : ""}`}
        aria-label="Primary navigation"
        onClick={(event) => {
          // Close the menu after any link inside it is chosen.
          if ((event.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        {navItems.map((item) =>
          "external" in item ? (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className="site-header-actions">
        <Link className="button button-primary header-download" href="/#testing">
          Download
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="menu-toggle-bars" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
