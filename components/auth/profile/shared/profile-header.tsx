"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/store/hooks";

export function ProfileHeader() {
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
    <div className="flex items-center gap-4 p-6 lg:hidden">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
        {user?.createdAt && (
          <p className="text-sm text-muted-foreground">
            Member since {getMemberSince()}
          </p>
        )}
      </div>
    </div>
  );
}
