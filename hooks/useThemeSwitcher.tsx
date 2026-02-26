"use client";

import { useEffect, useState } from "react";
import { themes } from "../data/theme-data";

type ThemeName = keyof typeof themes; // "theme1" | "theme2" | ... 43 themes

type CSSVarMap = Record<string, string>;

interface ThemeObject {
  ":root": CSSVarMap;
  ".dark": CSSVarMap;
  inline?: CSSVarMap; // optional because not applied by hook
}

export function useThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>("theme1");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Watch for dark mode class changes
  useEffect(() => {
    const root = document.documentElement;
    setIsDarkMode(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains("dark"));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Apply theme variables whenever theme or dark mode changes
  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme: ThemeObject = themes[theme];

    // Apply :root vars
    Object.entries(selectedTheme[":root"]).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply .dark vars if dark class exists
    if (isDarkMode) {
      Object.entries(selectedTheme[".dark"]).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    // Apply inline vars if they exist
    if (selectedTheme.inline) {
      Object.entries(selectedTheme.inline).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, [theme, isDarkMode]);

  return { theme, setTheme };
}
