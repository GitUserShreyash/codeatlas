import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";

import { CodeAtlasIcon } from "@/components/icons/codeatlas-icon";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { dashboardNavGroups, isDashboardNavActive } from "@/lib/dashboard-nav";

import { cn } from "@/lib/utils";

export function BrandMark({ className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-semibold tracking-tight",
        className,
      )}
    >
      <CodeAtlasIcon className="size-8 rounded-[10px]" />

      <span className="font-heading text-[1.05rem] leading-none">
        CodeAtlas
      </span>
    </div>
  );
}

export function AppShell({
  children,
  title,
  description,
  actions,
  hideHeader = false,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: user } = useCurrentUser();
  const logout = useLogout();

  function handleLogout() {
    logout.mutate();
  }

  const displayName =
    user?.displayName || user?.githubUsername || "GitHub User";

  const username = user?.githubUsername ? `@${user.githubUsername}` : "";

  const avatarFallback = displayName.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        {/* Sidebar Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={<Link to="/dashboard" />}
                tooltip="CodeAtlas"
              >
                <CodeAtlasIcon className="size-8 rounded-[10px]" />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CodeAtlas</span>

                  <span className="truncate text-xs text-muted-foreground">
                    Chat with your code
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Sidebar Navigation */}
        <SidebarContent>
          {dashboardNavGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = isDashboardNavActive(pathname, item.href);

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          isActive={active}
                          tooltip={item.label}
                          render={<Link to={item.href} />}
                        >
                          {item.icon && <item.icon className="size-4" />}

                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      src={user?.avatarUrl || ""}
                      alt={displayName}
                    />

                    <AvatarFallback className="rounded-lg">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {displayName}
                    </span>

                    <span className="truncate text-xs text-muted-foreground">
                      {username}
                    </span>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56"
                  side="right"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{displayName}</span>

                      {username && (
                        <span className="text-xs text-muted-foreground">
                          {username}
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="size-4" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={logout.isPending}
                    >
                      <LogOut className="size-4" />
                      {logout.isPending ? "Logging out..." : "Log out"}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        {!hideHeader && (
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur">
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4">
              <div className="min-w-0">
                {title && (
                  <h1 className="truncate font-heading text-sm font-medium">
                    {title}
                  </h1>
                )}

                {description && (
                  <p className="truncate text-xs text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {actions}

                <ModeToggle />
              </div>
            </div>
          </header>
        )}

        {/* Actual Page Content */}
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
