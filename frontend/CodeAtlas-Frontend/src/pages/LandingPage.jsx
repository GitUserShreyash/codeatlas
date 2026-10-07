import { Link } from "react-router-dom"
import {
  Sparkles,
  GitBranch,
  Database,
  Bot,
  Search,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  Terminal,
  ShieldCheck,
} from "lucide-react"

import { CodeAtlasIcon } from "@/components/icons/codeatlas-icon"
import { GitHubIcon } from "@/components/icons/github-icon"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrentUser } from "@/hooks/use-auth"
import { getGithubLoginUrl } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const { data: user } = useCurrentUser()

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,oklch(from_var(--primary)_0.8_c_h/0.15),transparent_70%)]" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-8">
        <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <CodeAtlasIcon className="size-8 text-primary" />
          <span className="font-heading text-lg font-bold">CodeAtlas</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#architecture" className="text-muted-foreground hover:text-foreground transition-colors">
            Architecture
          </a>
          <a href="#prompts" className="text-muted-foreground hover:text-foreground transition-colors">
            Use Cases
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          {user ? (
            <Link
              to="/dashboard"
              className={cn(buttonVariants({ size: "sm" }), "gap-2")}
            >
              Go to Dashboard
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <a
              href={getGithubLoginUrl()}
              className={cn(buttonVariants({ size: "sm" }), "gap-2")}
            >
              <GitHubIcon className="size-4" />
              Sign In
            </a>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center md:pt-24 md:pb-20">
        <Badge variant="outline" className="mb-6 gap-2 px-3 py-1 text-sm border-primary/30 bg-primary/5">
          <Sparkles className="size-4 text-primary" />
          <span>AI-Powered GitHub Repository Assistant</span>
        </Badge>

        <h1 className="max-w-4xl font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Explore & Understand Any <span className="text-primary">Codebase</span> with AI
        </h1>

        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
          Connect your GitHub repositories, index your code chunks with vector search, and ask natural language questions grounded directly in your codebase.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <a
            href={getGithubLoginUrl()}
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full sm:w-auto gap-2.5 px-6 font-semibold shadow-lg shadow-primary/20"
            )}
          >
            <GitHubIcon className="size-5" />
            Continue with GitHub
          </a>
          <Link
            to={user ? "/dashboard" : "/login"}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto gap-2"
            )}
          >
            {user ? "View Dashboard" : "Sign In / Register"}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Feature Preview Card / Interactive Showcase */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl border bg-card/60 p-2 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-yellow-500/80" />
              <div className="size-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto flex items-center gap-2 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground border">
              <Search className="size-3" />
              <span>codeatlas.ai/chat?repo=spring-boot-demo</span>
            </div>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-2 text-left">
            {/* User Question */}
            <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-primary">User Question</span>
                <span>Just now</span>
              </div>
              <p className="text-sm font-medium">
                "Explain how user authentication works in this repository and where the GitHub OAuth callback is handled."
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <Badge variant="secondary" className="text-[11px]">SecurityConfig.java</Badge>
                <Badge variant="secondary" className="text-[11px]">OAuth2UserService.java</Badge>
                <Badge variant="secondary" className="text-[11px]">AuthController.java</Badge>
              </div>
            </div>

            {/* AI Grounded Response */}
            <div className="flex flex-col gap-3 rounded-xl border bg-primary/5 p-4 shadow-sm border-primary/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Bot className="size-4" />
                <span>CodeAtlas AI (Gemini + RAG)</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Authentication relies on Spring Security OAuth2. When the user logs in via GitHub, <code className="rounded bg-muted px-1 py-0.5 text-foreground">GitHubOAuth2UserService.java</code> retrieves the profile, updates the <code className="rounded bg-muted px-1 py-0.5 text-foreground">User</code> entity, and creates an HTTP session.
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium">
                <CheckCircle2 className="size-3.5" />
                <span>Grounded in 3 retrieved code chunks from vector DB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="border-t bg-muted/30 py-20 px-4 md:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Everything You Need to Navigate Complex Code
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for developers who want deep code understanding without manual digging.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="text-left">
              <CardHeader>
                <GitBranch className="size-8 text-primary mb-2" />
                <CardTitle className="text-lg">GitHub Sync</CardTitle>
                <CardDescription>
                  OAuth connection to quickly select and index any of your GitHub repositories.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <Database className="size-8 text-primary mb-2" />
                <CardTitle className="text-lg">Vector Search</CardTitle>
                <CardDescription>
                  Code is split into chunks and stored as embeddings in PostgreSQL with pgvector.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <Cpu className="size-8 text-primary mb-2" />
                <CardTitle className="text-lg">Gemini + RAG</CardTitle>
                <CardDescription>
                  Retrieval-Augmented Generation ensures answers are strictly grounded in your code.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <Terminal className="size-8 text-primary mb-2" />
                <CardTitle className="text-lg">Interactive Q&A</CardTitle>
                <CardDescription>
                  Ask flow questions, find controller logic, and trace database relationships effortlessly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture / How It Works */}
      <section id="how-it-works" className="py-20 px-4 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-4">How It Works</Badge>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            From Code Chunks to Intelligent Answers
          </h2>
          <p className="mt-3 text-muted-foreground">
            How CodeAtlas indexes and answers questions about your repository.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-4 text-left">
            <div className="rounded-xl border p-5 bg-card">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold mb-3">1</div>
              <h3 className="font-semibold text-base mb-1">Connect Repo</h3>
              <p className="text-xs text-muted-foreground">Authorize GitHub and select your target repository.</p>
            </div>

            <div className="rounded-xl border p-5 bg-card">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold mb-3">2</div>
              <h3 className="font-semibold text-base mb-1">Chunk & Embed</h3>
              <p className="text-xs text-muted-foreground">Source code files are split into chunks and converted to vector embeddings.</p>
            </div>

            <div className="rounded-xl border p-5 bg-card">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold mb-3">3</div>
              <h3 className="font-semibold text-base mb-1">Vector Store</h3>
              <p className="text-xs text-muted-foreground">pgvector performs fast similarity search on incoming queries.</p>
            </div>

            <div className="rounded-xl border p-5 bg-card">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold mb-3">4</div>
              <h3 className="font-semibold text-base mb-1">AI Synthesis</h3>
              <p className="text-xs text-muted-foreground">Gemini receives user prompt + code context to return precise explanations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Badge Section */}
      <section id="architecture" className="border-t bg-muted/20 py-16 px-4 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-6">
            Powered by Modern Full-Stack & AI Stack
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary" className="px-3 py-1.5 text-sm gap-1.5"><Code2 className="size-4" /> React + Vite</Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm gap-1.5"><Layers className="size-4" /> Tailwind CSS + shadcn/ui</Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm gap-1.5"><ShieldCheck className="size-4" /> Spring Boot + Security</Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm gap-1.5"><Database className="size-4" /> PostgreSQL + pgvector</Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm gap-1.5"><Bot className="size-4" /> Spring AI + Gemini</Badge>
          </div>
        </div>
      </section>

      {/* Prompts / Use Cases */}
      <section id="prompts" className="py-20 px-4 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4">Use Cases</Badge>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl mb-4">
            Ask Anything About Your Code
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 text-left">
            {[
              "\"How does user registration work?\"",
              "\"Explain the flow from controller to database.\"",
              "\"Where is the database connection configured?\"",
              "\"Which class handles GitHub authentication?\"",
              "\"What repositories/services relate to User entity?\"",
              "\"Where is this method being used?\""
            ].map((q, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-lg border bg-card p-3.5 text-sm">
                <Search className="size-4 text-primary shrink-0" />
                <span className="font-mono text-xs">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="border-t bg-gradient-to-b from-transparent to-primary/5 py-16 px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <CodeAtlasIcon className="mx-auto size-12 text-primary mb-4" />
          <h2 className="font-heading text-3xl font-bold mb-3">Ready to explore your codebase?</h2>
          <p className="text-muted-foreground mb-6">
            Sign in with GitHub and start asking natural language questions about your repositories.
          </p>
          <a
            href={getGithubLoginUrl()}
            className={cn(buttonVariants({ size: "lg" }), "gap-2.5 font-semibold px-8 shadow-lg shadow-primary/20")}
          >
            <GitHubIcon className="size-5" />
            Get Started with GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <CodeAtlasIcon className="size-4 text-primary" />
            <span className="font-semibold text-foreground">CodeAtlas</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#how-it-works" className="hover:underline">How it Works</a>
            <Link to="/login" className="hover:underline">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
