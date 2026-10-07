import {
  LayoutDashboard,
  GitBranch,
  MessageSquare,
  Settings,
} from "lucide-react"

export const dashboardNavGroups = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Repositories",
        href: "/repositories",
        icon: GitBranch,
      },
      {
        label: "Chat",
        href: "/chat",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function isDashboardNavActive(pathname, href) {
  if (href === "/dashboard") {
    return pathname === "/dashboard"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}