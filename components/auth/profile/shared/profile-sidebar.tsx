"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { PROFILE_TABS } from "../utils/constants";
import type { ProfileTab } from "../utils/types";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onSignOut: () => void;
}

export function ProfileSidebar({
  activeTab,
  onTabChange,
  onSignOut,
}: ProfileSidebarProps) {
  const { user } = useAppSelector((state) => state.newAuth);

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  const getMemberSince = () => {
    if (!user?.createdAt) return "";
    const date = new Date(user.createdAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:bg-card lg:border lg:rounded-xl lg:h-fit sticky">
      {/* Profile Info */}
      <div className="p-6 border-b">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-3">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold">{user?.name || "User"}</h2>
          {user?.createdAt && (
            <p className="text-sm text-muted-foreground mt-1">
              Member since {getMemberSince()}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {PROFILE_TABS.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
