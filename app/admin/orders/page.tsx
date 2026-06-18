'use client'
import { useEffect, useState, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
type Order = { id: number; client_id: number; status: string; total: number; created_at: string; client_name?: string }
const STATUS_LABELS: Record<string,string> = { pending:'En attente', paid:'Payée', shipped:'Expédiée', delivered:'Livrée', cancelled:'Annulée' }
const STATUS_COLORS: Record<string,string> = { pending:'bg-yellow-100 text-yellow-700', paid:'bg-blue-100 text-blue-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-600' }
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const limit = 10
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    const res = await fetch('/api/admin/orders?' + params)
    const data = await res.json()
    setOrders(data.data ?? []); setTotal(data.total ?? 0); setLoading(false)
  }, [page, search])
  useEffect(() => { fetchOrders() }, [fetchOrders])
  async function updateStatus(id: number, status: string) {
    await fetch('/api/admin/orders/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetchOrders()
  }
  const totalPages = Math.ceil(total / limit)
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Commandes</h1>
        <p className="mt-1 text-sm text-muted-foreground">{total} commande{total !== 1 ? 's' : ''} au total</p>
      </div>
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Rechercher…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#c8a25d] transition" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#f6f4ef' }}>
            <tr>
              {['#','Client','Total','Statut','Date','Action'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Chargement…</td></tr>
            : orders.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Aucune commande.</td></tr>
            : orders.map(o => (
              <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono text-muted-foreground">#{o.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">{o.client_name ?? 'Client #' + o.client_id}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: '#c8a25d' }}>{Number(o.total).toLocaleString('fr-FR')} FCFA</td>
                <td className="px-4 py-3"><span className={'rounded-full px-2 py-0.5 text-xs font-medium ' + (STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600')}>{STATUS_LABELS[o.status] ?? o.status}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:border-[#c8a25d] transition">
                    {Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
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
