import { cn } from "@/lib/utils"

type Props = {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  dark?: boolean
}

export function SectionHeading({ eyebrow, title, description, align = "center", dark }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
      )}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance font-serif text-3xl font-bold sm:text-4xl",
          dark ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty leading-relaxed",
            dark ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
