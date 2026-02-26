"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Sun, Moon, Shuffle, Search } from "lucide-react";
import { useThemeSwitcher } from "@/hooks/useThemeSwitcher";
import { themes } from "@/data/theme-data";

type ThemeName = keyof typeof themes;

interface ThemeOption {
  name: ThemeName;
  label: string;
  customName?: string;
  colors: string[];
}

const themeOptions: ThemeOption[] = [
  {
    name: "theme1",
    label: "Purple Theme",
    customName: "Midnight Purple",
    colors: [
      "oklch(0.6056 0.2189 292.7172)", // primary
      "oklch(0.9691 0.0161 293.7558)", // muted
      "oklch(0.9319 0.0316 255.5855)", // accent
      "oklch(0.4568 0.2146 277.0229)", // secondary
    ],
  },
  {
    name: "theme2",
    label: "Green Theme",
    customName: "Amber Minimal",
    colors: [
      "oklch(0.7686 0.1647 70.0804)", // primary
      "oklch(0.9869 0.0214 95.2774)", // accent
      "oklch(0.9670 0.0029 264.5419)", // secondary
      "oklch(0.9846 0.0017 247.8389)", // muted
    ],
  },
   {
    name: "theme3",
    label: "Bubble Gum",
    customName: "Bubble Gum",
    colors: [
      "oklch(0.6209 0.1801 348.1385)", // primary
    "oklch(0.9195 0.0801 87.6670)", // accent
       "oklch(0.8095 0.0694 198.1863)", // secondary
      "oklch(0.8800 0.0504 212.0952)", // muted
    ],
  },
  {
    name: "theme4",
    label: "Cyan Theme",
    customName: "Perpetuity",
    colors: [
      "oklch(0.5624 0.0947 203.2755)", // primary
      "oklch(0.9021 0.0297 201.8915)", // accent
      "oklch(0.9244 0.0181 196.8450)", // secondary
      "oklch(0.9295 0.0107 196.9723)", // muted
    ],
  },
  {
    name: "theme5",
    label: "Purple Theme",
    customName: "Clean State",
    colors: [
      "oklch(0.5854 0.2041 277.1173)", // primary
      "oklch(0.9299 0.0334 272.7879)", // accent
      "oklch(0.9276 0.0058 264.5313)", // secondary
      "oklch(0.9670 0.0029 264.5419)", // muted
    ],
  },
  {
    name: "theme6",
    label: "Green Theme",
    customName: "Fresh Mint",
    colors: [
      "oklch(0.8348 0.1302 160.9080)", // primary
      "oklch(0.9461 0 0)", // accent
      "oklch(0.9940 0 0)", // secondary
      "oklch(0.9461 0 0)", // muted
    ],
  },
  {
    name: "theme7",
    label: "Red Theme",
    customName: "Elegant Luxury",
    colors: [
      "oklch(0.4650 0.1470 24.9381)", // primary
      "oklch(0.9619 0.0580 95.6174)", // accent
      "oklch(0.9625 0.0385 89.0943)", // secondary
      "oklch(0.9431 0.0068 53.4442)", // muted
    ],
  },
];

export function ThemeDropdown() {
  const { theme, setTheme } = useThemeSwitcher();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoize current theme to avoid recalculation
  const currentTheme = useMemo(
    () => themeOptions.find((t) => t.name === theme) || themeOptions[0],
    [theme]
  );

  // Check dark mode on mount
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (themeName: ThemeName) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  const handleShuffle = () => {
    const randomTheme = themeOptions[Math.floor(Math.random() * themeOptions.length)];
    setTheme(randomTheme.name);
  };

  const toggleMode = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      root.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  // Memoize filtered themes to avoid recalculation on every render
  const filteredThemes = useMemo(() => {
    if (!searchQuery) return themeOptions;
    const query = searchQuery.toLowerCase();
    return themeOptions.filter((theme) =>
      theme.label.toLowerCase().includes(query) ||
      theme.customName?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border-ring rounded-lg border-2 bg-card hover:bg-accent/10 transition-colors"
      >
        {/* Color Dots */}
        <div className="flex gap-1">
          {currentTheme.colors.map((color, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-[5px] border border-border/50"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-sm text-foreground font-medium">{currentTheme.customName || currentTheme.label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu - Only render when open or closing */}
      {(isOpen) && (
        <div
          className={`absolute top-full bg-background mt-2 right-0 w-[298px] border-2 border-ring   rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-300 ease-in-out origin-top ${
            isOpen
              ? "opacity-100 scale-y-100 max-h-[400px]"
              : "opacity-0 scale-y-0 max-h-0 pointer-events-none"
          }`}
        >
        {/* Search Bar */}
        <div className="p-3 border-b border-border">
          <div className="relative h-[45px] flex items-center">
            <Search className="absolute left-3 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-10 pr-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Control Section */}
        <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-muted/30">
          <span className="text-sm text-muted-foreground font-medium">
            {filteredThemes.length} {filteredThemes.length === 1 ? "theme" : "themes"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="p-1.5 rounded-md hover:bg-accent/20 transition-colors"
              title="Toggle dark/light mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleShuffle}
              className="p-1.5 rounded-md hover:bg-accent/20 transition-colors"
              title="Shuffle theme"
            >
              <Shuffle size={18} />
            </button>
          </div>
        </div>

        {/* Themes List */}
        <div className="max-h-[280px] overflow-y-auto">
          {filteredThemes.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No themes found
            </div>
          ) : (
            filteredThemes.map((option) => (
              <button
                key={option.name}
                onClick={() => handleThemeChange(option.name)}
                className={`w-full flex justify-center items-center gap-2 px-4 py-3 hover:bg-accent/20 transition-colors ${
                  theme === option.name ? "bg-accent/10" : ""
                }`}
              >
                 {/* Color Boxes */}
                <div className="flex gap-2">
                  {option.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-[5px] border border-border/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {/* Theme Name */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium text-foreground">
                    {option.customName || option.label}
                  </span>
                  {theme === option.name && (
                    <span className="text-foregroundtext-xs">✓</span>
                  )}
                </div>

               
              </button>
            ))
          )}
        </div>
      </div>
      )}
    </div>
  );
}
