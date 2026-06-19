"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect")
  const [tab, setTab] = useState("connexion")

  // Login state
  const [identifier, setIdentifier] = useState("")
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
        body: JSON.stringify({ identifier, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setLoginError(data.error || "Erreur de connexion")
      } else {
        if (data.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push(redirectUrl || "/compte")
        }
        router.refresh()
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

    if (!regPhone && !regEmail) {
      setRegError("Veuillez renseigner un numéro de téléphone ou un email.")
      return
    }

    if (regPassword !== regConfirm) {
      setRegError("Les mots de passe ne correspondent pas.")
      return
    }

    if (regPassword.length < 6) {
      setRegError("Le mot de passe doit contenir au moins 6 caractères.")
      return
    }

    setRegLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          phone: regPhone || undefined,
          email: regEmail || undefined,
          password: regPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRegError(data.error || "Erreur lors de l'inscription")
      } else {
        router.push(redirectUrl || "/compte")
        router.refresh()
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

        {/* ───── CONNEXION ───── */}
        <TabsContent value="connexion">
          <form
            onSubmit={handleLogin}
            className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-identifier">Email ou numéro de téléphone</Label>
              <Input
                id="login-identifier"
                type="text"
                required
                placeholder="ex: 77 351 91 28 ou vous@exemple.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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

        {/* ───── INSCRIPTION ───── */}
        <TabsContent value="inscription">
          <form
            onSubmit={handleSignup}
            className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-name">Nom complet *</Label>
              <Input id="reg-name" required placeholder="Votre nom" value={regName} onChange={e => setRegName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-phone">Numéro de téléphone</Label>
              <Input
                id="reg-phone"
                type="tel"
                placeholder="+221 77 000 00 00 ou +33 6 12 34 56 78"
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="vous@exemple.com"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground -mt-2">Au moins un téléphone ou un email est requis.</p>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-password">Mot de passe *</Label>
              <Input id="reg-password" type="password" required placeholder="••••••••" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-confirm">Confirmation du mot de passe *</Label>
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
