"use client";

import { PROFILE_TABS } from "../utils/constants";
import type { ProfileTab } from "../utils/types";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="lg:hidden px-4 pb-2">
      <div className="flex gap-2">
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}