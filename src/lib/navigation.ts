import {
  BookOpen,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  LayoutDashboard,
  Megaphone,
  Trophy,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/** Sidebar navigation. Add a route here and create `app/(dashboard)/<href>/page.tsx`. */
export const navigation: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Academics",
    items: [
      { title: "Class Routine", href: "/routine", icon: CalendarClock },
      { title: "My Subjects", href: "/subjects", icon: BookOpen },
      { title: "Attendance", href: "/attendance", icon: CalendarCheck },
      { title: "Exams", href: "/exams", icon: ClipboardList },
      { title: "Results", href: "/results", icon: Trophy },
    ],
  },
  {
    label: "Fees & Requests",
    items: [
      { title: "Fees & Payments", href: "/fees", icon: Wallet },
      { title: "Leave Requests", href: "/leave", icon: CalendarPlus },
    ],
  },
  {
    label: "School",
    items: [
      { title: "Notices", href: "/notices", icon: Megaphone },
      { title: "Events & Holidays", href: "/events", icon: CalendarDays },
    ],
  },
  {
    label: "My Account",
    items: [{ title: "My Profile", href: "/profile", icon: UserRound }],
  },
];

export const allNavItems = navigation.flatMap((group) => group.items);

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Resolve the nav item (and its group label) for the current path. */
export function findNavItem(pathname: string) {
  for (const group of navigation) {
    const item = group.items.find((i) => isActivePath(pathname, i.href));
    if (item) return { ...item, group: group.label };
  }
  return undefined;
}
