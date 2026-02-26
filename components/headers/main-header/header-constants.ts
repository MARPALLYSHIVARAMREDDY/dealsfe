import {
  User,
  Heart,
  Bell,
  LogIn,
  LogOut,
  Home,
  Flame,
  Tag,
  ShoppingBag,
  BookOpen,
  Ticket,
} from "lucide-react";

export const accountItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
];

export const authItems = [
  { icon: LogIn, label: "Sign In / Sign Up", path: "/auth" },
];

export const logoutItem = { icon: LogOut, label: "Logout", action: "logout" };

export const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Flame, label: "Trending Deals", path: "/hot" },
  { icon: Tag, label: "All Deals", path: "/deals" },
  { icon: Ticket, label: "Coupons", path: "/coupons" },
  { icon: ShoppingBag, label: "Sales", path: "/sales" },
  { icon: BookOpen, label: "Blog", path: "/blog" },
];

export const navItems = [
  { label: "All Deals", href: "/alldeals" },
  { label: "Coupons", href: "/coupons" },
  { label: "Trending", href: "/deals?sort=trending" },
  { label: "Sales", href: "/sales" },
  { label: "Blog", href: "/blog" },
];
