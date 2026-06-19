'use client'

import { useEffect, useState } from 'react'
import { ImagePlus, Save, Loader2, Info } from 'lucide-react'
import Image from 'next/image'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [heroImage1, setHeroImage1] = useState('')
  const [heroImage2, setHeroImage2] = useState('')

  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        setHeroImage1(data.hero_image_1 || '/placeholder.svg?height=640&width=480')
        setHeroImage2(data.hero_image_2 || '/placeholder.svg?height=640&width=480')
        setLoading(false)
      })
      .catch(() => {
        setError('Erreur lors du chargement des paramètres.')
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      let finalImg1 = heroImage1
      let finalImg2 = heroImage2

      // Upload file 1 if selected
      if (file1) {
        const fd = new FormData()
        fd.append('file', file1)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('Erreur upload Image 1')
        const data = await res.json()
        finalImg1 = data.url
        setHeroImage1(data.url)
      }

      // Upload file 2 if selected
      if (file2) {
        const fd = new FormData()
        fd.append('file', file2)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('Erreur upload Image 2')
        const data = await res.json()
        finalImg2 = data.url
        setHeroImage2(data.url)
      }

      // Save settings
      const saveRes = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_image_1: finalImg1,
          hero_image_2: finalImg2,
        }),
      })

      if (!saveRes.ok) throw new Error('Erreur lors de la sauvegarde.')

      setSuccess('Paramètres enregistrés avec succès.')
      setFile1(null)
      setFile2(null)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setSaving(false)
    }
  }

  const preview1 = file1 ? URL.createObjectURL(file1) : heroImage1
  const preview2 = file2 ? URL.createObjectURL(file2) : heroImage2

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez la configuration générale du site.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm max-w-4xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Images de l'Accueil (Hero)
        </h2>
        
        <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
          <Info className="size-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Ces deux images s'affichent sur la bannière de la page d'accueil. <br />
            <strong>Format recommandé :</strong> Ratio vertical (ex: 480x640 ou 1080x1440).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image 1 */}
          <div>
            <label className="block text-sm font-medium mb-3">Image 1 (Vêtements)</label>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted group flex items-center justify-center">
              {preview1 ? (
                <Image src={preview1} alt="Preview 1" fill className="object-cover" />
              ) : (
                <ImagePlus className="size-8 text-muted-foreground opacity-50" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">Changer l'image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile1(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>

          {/* Image 2 */}
          <div>
            <label className="block text-sm font-medium mb-3">Image 2 (Sport)</label>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted group flex items-center justify-center">
              {preview2 ? (
                <Image src={preview2} alt="Preview 2" fill className="object-cover" />
              ) : (
                <ImagePlus className="size-8 text-muted-foreground opacity-50" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">Changer l'image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile2(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || (!file1 && !file2)}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition"
            style={{ backgroundColor: '#c8a25d' }}
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </div>
  )
}
