'use client'
import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
type Product = { id: number; name: string; description: string | null; price: number; image: string | null; in_stock: number; category: string | null; sizes: any; colors: any; is_new: boolean | number; is_promo: boolean | number; rating: number }
const emptyForm = { name: '', description: '', price: '', image: '', stock: '1', category: 'Homme', sizes: [] as string[], colors: [] as string[], isNew: false, isPromo: false, rating: 0 }
const CATEGORIES = ["Homme", "Femme", "Enfant", "Football", "Accessoires"];
const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const SHOE_SIZES = Array.from({ length: 14 }, (_, i) => String(34 + i));
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const limit = 10
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    const res = await fetch('/api/admin/products?' + params)
    const data = await res.json()
    setProducts(data.data ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [page, search])
  useEffect(() => { fetchProducts() }, [fetchProducts])
  function openCreate() { setEditing(null); setForm(emptyForm); setImageFiles([]); setShowForm(true) }
  function openEdit(p: Product) {
    setEditing(p)
    let parsedSizes = [];
    try { parsedSizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (p.sizes || []) } catch(e){}
    let parsedColors = [];
    try { parsedColors = typeof p.colors === 'string' ? JSON.parse(p.colors) : (p.colors || []) } catch(e){}
    
    setForm({ 
      name: p.name, 
      description: p.description ?? '', 
      price: String(p.price), 
      image: p.image ?? '', 
      stock: String(p.in_stock), 
      category: p.category ?? CATEGORIES[0], 
      sizes: parsedSizes, 
      colors: parsedColors,
      isNew: Boolean(p.isNew ?? p.is_new ?? false),
      isPromo: Boolean(p.isPromo ?? p.is_promo ?? false),
      rating: Number(p.rating ?? 0)
    })
    setImageFiles([]); setShowForm(true)
  }
  
  function toggleSize(size: string) {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
    }))
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      let uploadedUrls: string[] = []
      
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fd = new FormData(); fd.append('file', file)
          const up = await fetch('/api/upload', { method: 'POST', body: fd })
          const upData = await up.json();
          if (!up.ok) {
            throw new Error(`Erreur upload: ${upData.error || 'inconnue'}`);
          }
          if (upData.url) uploadedUrls.push(upData.url)
        }
      }
      
      let finalColors = [...form.colors, ...uploadedUrls]
      let finalImage = finalColors.length > 0 ? finalColors[0] : form.image
      let finalSizes = form.sizes

      const body = { 
        name: form.name, 
        description: form.description || null, 
        price: Number(form.price), 
        stock: Number(form.stock), 
        category: form.category || null, 
        image: finalImage || null, 
        sizes: finalSizes, 
        colors: finalColors,
        isNew: form.isNew,
        isPromo: form.isPromo,
        rating: form.rating
      }
      let res;
      if (editing) {
        res = await fetch('/api/admin/products/' + editing.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      } else {
        res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Erreur HTTP ${res.status}`)
      }
      setShowForm(false); fetchProducts()
    } catch (err: any) {
      setSubmitError(err.message || 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }
  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce produit ?')) return
    await fetch('/api/admin/products/' + id, { method: 'DELETE' }); fetchProducts()
  }
  const totalPages = Math.ceil(total / limit)
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Produits</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} produit{total !== 1 ? 's' : ''} au total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#c8a25d' }}>
          <Plus className="size-4" /> Ajouter
        </button>
      </div>
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Rechercher…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#c8a25d] transition" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#f6f4ef' }}>
            <tr>
              {['Produit','Catégorie','Prix','Stock','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Chargement…</td></tr>
            : products.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Aucun produit.</td></tr>
            : products.map(p => (
              <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image ? <img src={p.image} alt={p.name} className="size-10 rounded-lg object-cover border border-border" /> : <div className="size-10 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: '#f3ecdd' }}>📦</div>}
                    <div><p className="font-medium text-foreground">{p.name}</p>{p.description && <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category ?? '—'}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: '#c8a25d' }}>{Number(p.price).toLocaleString('fr-FR')} FCFA</td>
                <td className="px-4 py-3"><span className={'rounded-full px-2 py-0.5 text-xs font-medium ' + (p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>{p.in_stock ? 'En stock' : 'Rupture'}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"><Pencil className="size-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition"><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} / {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="rounded-lg border border-border p-2 disabled:opacity-40 hover:bg-muted transition"><ChevronLeft className="size-4" /></button>
            <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className="rounded-lg border border-border p-2 disabled:opacity-40 hover:bg-muted transition"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">{editing ? 'Modifier' : 'Nouveau produit'}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-muted transition"><X className="size-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="mb-1 block text-sm font-medium">Nom *</label><input required type="text" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#c8a25d] transition" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1 block text-sm font-medium">Prix (FCFA) *</label><input required type="number" min="0" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#c8a25d] transition" /></div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Disponibilité *</label>
                  <select required value={form.stock} onChange={e => setForm(f=>({...f,stock:e.target.value}))} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#c8a25d] transition">
                    <option value="1">En stock</option>
                    <option value="0">Rupture</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.isNew} onChange={e => setForm(f=>({...f, isNew: e.target.checked}))} className="rounded border-border" /> Nouveauté</label>
                <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.isPromo} onChange={e => setForm(f=>({...f, isPromo: e.target.checked}))} className="rounded border-border" /> En promotion</label>
                <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.rating === 5} onChange={e => setForm(f=>({...f, rating: e.target.checked ? 5 : 0}))} className="rounded border-border" /> Populaire</label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Catégorie</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#c8a25d] transition">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Tailles sélectionnées</label>
                  <div className="flex flex-wrap gap-1.5 min-h-[38px] items-center">
                    {form.sizes.length === 0 ? <span className="text-xs text-muted-foreground">Aucune taille</span> : form.sizes.map(s => (
                      <span key={s} className="rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-xs font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-3 rounded-xl border border-border bg-muted/30">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Vêtements</label>
                  <div className="flex flex-wrap gap-2">
                    {CLOTHING_SIZES.map(s => (
                      <button type="button" key={s} onClick={() => toggleSize(s)} className={`rounded-md border px-3 py-1 text-xs font-medium transition ${form.sizes.includes(s) ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary bg-background'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Pointures</label>
                  <div className="flex flex-wrap gap-2">
                    {SHOE_SIZES.map(s => (
                      <button type="button" key={s} onClick={() => toggleSize(s)} className={`rounded-md border px-2 py-1 text-xs font-medium transition ${form.sizes.includes(s) ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary bg-background'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div><label className="mb-1 block text-sm font-medium">Description</label><textarea rows={2} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#c8a25d] transition" /></div>
              <div>
                <label className="mb-1 block text-sm font-medium">Images (Couleurs / Vues)</label>
                <input type="file" multiple accept="image/*" onChange={e => setImageFiles(Array.from(e.target.files || []))} className="w-full cursor-pointer rounded-xl border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-1 file:text-xs file:font-medium" />
                {imageFiles.length > 0 && <p className="text-xs text-muted-foreground mt-2">{imageFiles.length} fichier(s) sélectionné(s)</p>}
                {form.colors.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {form.colors.map((c, i) => (
                      <div key={i} className="relative size-12 shrink-0 rounded-md border border-border overflow-hidden">
                        <img src={c} alt="" className="size-full object-cover" />
                        <button type="button" onClick={() => setForm(f=>({...f,colors:f.colors.filter((_,idx)=>idx!==i)}))} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md p-0.5" title="Supprimer">
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {submitError && <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">{submitError}</p>}
              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition">Annuler</button>
                <button type="submit" disabled={submitting} className="rounded-xl px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: '#c8a25d' }}>{submitting ? 'Enregistrement...' : (editing ? 'Enregistrer' : 'Créer')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
