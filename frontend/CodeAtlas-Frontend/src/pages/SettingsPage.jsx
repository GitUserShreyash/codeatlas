import { Settings, Shield, User, Moon, Sun, Laptop, LogOut } from "lucide-react"

import { useCurrentUser, useLogout } from "@/hooks/use-auth"
import { useTheme } from "@/providers/ThemeProvider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { data: user } = useCurrentUser()
  const logout = useLogout()
  const { theme, setTheme } = useTheme()

  const displayName = user?.displayName || user?.githubUsername || "GitHub User"
  const username = user?.githubUsername ? `@${user.githubUsername}` : ""
  const avatarFallback = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your account profile, theme appearance, and indexing configuration.
        </p>
      </div>

      {/* Account Section */}
      <Card className="rounded-2xl border-border/70 bg-card/80 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold">GitHub Account</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Your connected GitHub profile details used for repository discovery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar className="size-11 rounded-xl ring-1 ring-border">
                <AvatarImage src={user?.avatarUrl || ""} alt={displayName} />
                <AvatarFallback className="text-sm font-semibold">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{displayName}</p>
                <p className="text-xs text-muted-foreground">{username}</p>
              </div>
            </div>

            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[11px]">
              OAuth Connected
            </Badge>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="gap-2 rounded-xl text-xs"
            >
              <LogOut className="size-3.5" />
              {logout.isPending ? "Signing out..." : "Disconnect & Sign Out"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="rounded-2xl border-border/70 bg-card/80 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold">Appearance</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Choose your preferred color theme for CodeAtlas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Laptop },
            ].map((item) => {
              const Icon = item.icon
              const isSelected = theme === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border text-xs font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Indexing & Vector DB Info */}
      <Card className="rounded-2xl border-border/70 bg-card/80 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold">RAG & Embedding Model</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Parameters configured in Spring Boot and PGVector store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-muted-foreground text-[11px]">Embedding Model</span>
              <p className="font-semibold font-mono">gemini-embedding-001</p>
            </div>
            <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-muted-foreground text-[11px]">Vector Dimensions</span>
              <p className="font-semibold font-mono">768 (Cosine Distance / HNSW)</p>
            </div>
            <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-muted-foreground text-[11px]">Chat Model</span>
              <p className="font-semibold font-mono">gemini-2.5-flash</p>
            </div>
            <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-muted-foreground text-[11px]">Token Splitter</span>
              <p className="font-semibold font-mono">800 tokens / chunk</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
