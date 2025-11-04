"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This is intentional - we need to set mounted after hydration
    // to prevent hydration mismatch with theme-dependent rendering
    // Using setTimeout to avoid setState in effect warning
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Base class: identical on server + client to avoid hydration mismatch
  const baseClass =
    "p-2 rounded-lg transition-colors";

  // Prevent mismatch by using a neutral default before hydration
  const themeClass = !mounted
    ? "bg-white/10 border border-white/20"
    : theme === "dark"
      ? "bg-black/20 hover:bg-black/30 border border-white/10"
      : "bg-white/10 hover:bg-gray-100 border border-gray-300";

  return (
    <button
      aria-label="Toggle theme"
      className={`${baseClass} ${themeClass}`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      🌓
    </button>
  );
}
