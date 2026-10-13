import { Layers, ShieldCheck, Database, Route as RouteIcon } from "lucide-react"

export const STARTER_PROMPTS = [
  {
    icon: Layers,
    title: "Architecture Overview",
    description: "Explain the high-level architecture and folder structure.",
    prompt: "Provide a detailed overview of this repository's architecture, key components, and design patterns.",
  },
  {
    icon: ShieldCheck,
    title: "Authentication Flow",
    description: "How are security and permissions configured?",
    prompt: "Explain how authentication and security filters are configured in this project.",
  },
  {
    icon: Database,
    title: "Data Models & Storage",
    description: "Explore database tables, entities, and schemas.",
    prompt: "List the database entities and explain the data models used in this repository.",
  },
  {
    icon: RouteIcon,
    title: "API Endpoints",
    description: "List the REST controllers and request flow.",
    prompt: "What are the primary REST API endpoints available in this codebase and what do they do?",
  },
]

export function StarterPromptCards({ onSelectPrompt }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 w-full mt-8 text-left">
      {STARTER_PROMPTS.map((card) => {
        const Icon = card.icon
        return (
          <button
            key={card.title}
            type="button"
            onClick={() => onSelectPrompt(card.prompt)}
            className="group flex flex-col gap-1.5 rounded-2xl border border-border/70 bg-card/60 p-4 text-left transition-all hover:border-primary/50 hover:bg-card hover:shadow-md backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <Icon className="size-4" />
              </div>
              <span className="font-heading text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {card.title}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          </button>
        )
      })}
    </div>
  )
}

export default StarterPromptCards
