import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="font-serif text-lg animate-pulse">Chargement en cours...</p>
      </div>
    </div>
  )
}
