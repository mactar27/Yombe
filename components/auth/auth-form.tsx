"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AuthForm() {
  const router = useRouter()
  const [tab, setTab] = useState("connexion")

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)

  // Signup state
  const [regName, setRegName] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirm, setRegConfirm] = useState("")
  const [regError, setRegError] = useState<string | null>(null)
  const [regLoading, setRegLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setLoginError(data.error || "Erreur de connexion")
      } else {
        if (data.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/compte")
        }
      }
    } catch {
      setLoginError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setRegError(null)
    
    if (regPassword !== regConfirm) {
      setRegError("Les mots de passe ne correspondent pas.")
      return
    }

    setRegLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, phone: regPhone, email: regEmail, password: regPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRegError(data.error || "Erreur lors de l'inscription")
      } else {
        router.push("/compte")
      }
    } catch {
      setRegError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-serif text-3xl font-bold">Bienvenue</h1>
        <p className="text-muted-foreground">Connectez-vous ou créez votre compte client.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connexion">Connexion</TabsTrigger>
          <TabsTrigger value="inscription">Inscription</TabsTrigger>
        </TabsList>

        <TabsContent value="connexion">
          <form
            onSubmit={handleLogin}
            className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                required
                placeholder="vous@exemple.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-password">Mot de passe</Label>
              <Input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox id="remember" />
                Se souvenir de moi
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </button>
            </div>
            {loginError && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{loginError}</p>
            )}
            <Button type="submit" size="lg" disabled={loginLoading}>
              {loginLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="inscription">
          <form
            onSubmit={handleSignup}
            className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-name">Nom complet</Label>
              <Input id="reg-name" required placeholder="Votre nom" value={regName} onChange={e => setRegName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-phone">Téléphone</Label>
              <Input id="reg-phone" type="tel" required placeholder="+221 ..." value={regPhone} onChange={e => setRegPhone(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input id="reg-email" type="email" required placeholder="vous@exemple.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-password">Mot de passe</Label>
              <Input id="reg-password" type="password" required placeholder="••••••••" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-confirm">Confirmation du mot de passe</Label>
              <Input id="reg-confirm" type="password" required placeholder="••••••••" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
            </div>
            {regError && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{regError}</p>
            )}
            <Button type="submit" size="lg" disabled={regLoading}>
              {regLoading ? "Création en cours..." : "Créer mon compte"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  )
}


