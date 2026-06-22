'use client'
import { useEffect, useState, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Trash2, User } from 'lucide-react'
type Client = { id: number; name: string; email: string; phone: string | null; address: string | null; display_address?: string }
export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const limit = 10
  const fetchClients = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    const res = await fetch('/api/admin/clients?' + params)
    const data = await res.json()
    setClients(data.data ?? []); setTotal(data.total ?? 0); setLoading(false)
  }, [page, search])
  useEffect(() => { fetchClients() }, [fetchClients])
  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce client ?')) return
    await fetch('/api/admin/clients/' + id, { method: 'DELETE' }); fetchClients()
  }
  const totalPages = Math.ceil(total / limit)
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">{total} client{total !== 1 ? 's' : ''} au total</p>
      </div>
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Rechercher…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#c8a25d] transition" />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm min-w-[800px]">
          <thead style={{ backgroundColor: '#f6f4ef' }}>
            <tr>
              {['Client','Email','Téléphone','Adresse','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Chargement…</td></tr>
            : clients.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Aucun client.</td></tr>
            : clients.map(c => (
              <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#c8a25d' }}>{c.name[0]?.toUpperCase()}</div>
                    <p className="font-medium text-foreground">{c.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={c.display_address ?? c.address ?? ''}>{c.display_address ?? c.address ?? '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(c.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition"><Trash2 className="size-4" /></button>
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
    </div>
  )
}
