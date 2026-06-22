'use client'
import { useEffect, useState, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"

type Order = { id: number; client_id: number; status: string; total: number; created_at: string; client_name?: string }
type OrderDetails = {
  order: { id: number; client_id: number; status: string; total: number; created_at: string; client_name: string; client_email: string; delivery_address: string; phone: string; }
  items: { id: number; order_id: number; product_id: string; quantity: number; size: string; price_at_purchase: number; product_name: string; product_image: string; }[]
}

const STATUS_LABELS: Record<string,string> = { pending:'En attente', paid:'Payée', shipped:'Expédiée', delivered:'Livrée', cancelled:'Annulée' }
const STATUS_COLORS: Record<string,string> = { pending:'bg-yellow-100 text-yellow-700', paid:'bg-blue-100 text-blue-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-600' }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

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

  async function viewDetails(id: number) {
    setDialogOpen(true)
    setDetailsLoading(true)
    try {
      const res = await fetch('/api/admin/orders/' + id + '?_t=' + Date.now())
      const data = await res.json()
      if (res.ok) setSelectedOrder(data)
    } catch (e) {
      console.error(e)
    } finally {
      setDetailsLoading(false)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Commandes</h1>
        <p className="mt-1 text-sm text-muted-foreground">{total} commande{total !== 1 ? 's' : ''} au total</p>
      </div>
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Rechercher…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#c8a25d] transition" />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm min-w-[800px]">
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
                <td className="px-4 py-3 flex items-center gap-2">
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:border-[#c8a25d] transition">
                    {Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <button onClick={() => viewDetails(o.id)} className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-xs hover:bg-muted transition" title="Voir détails">
                    <Eye className="size-3.5" />
                  </button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-[#c8a25d]">
              Détails de la commande #{selectedOrder?.order?.id}
            </DialogTitle>
            <DialogDescription>
              Passée le {selectedOrder?.order?.created_at ? new Date(selectedOrder.order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="py-12 text-center text-muted-foreground">Chargement des détails...</div>
          ) : selectedOrder ? (
            <div className="mt-4 flex flex-col gap-6">
              
              {/* Infos Client & Livraison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-xl border border-border bg-muted/30 p-5 text-sm">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground mb-2">Client</h3>
                  <p className="font-medium text-foreground">{selectedOrder.order.client_name}</p>
                  <p className="text-muted-foreground break-all">{selectedOrder.order.client_email}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground mb-2">Livraison</h3>
                  <p className="font-medium text-foreground">{selectedOrder.order.phone}</p>
                  <p className="text-muted-foreground break-words">{selectedOrder.order.delivery_address}</p>
                </div>
              </div>

              {/* Articles */}
              <div>
                <h3 className="font-semibold mb-3">Articles commandés</h3>
                <div className="flex flex-col gap-3">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex gap-4 items-center rounded-lg border border-border p-3">
                      <div className="relative size-16 shrink-0 rounded-md bg-muted overflow-hidden">
                        {item.product_image && (
                          <Image src={item.product_image} alt={item.product_name || 'Produit'} fill className="object-cover" sizes="64px" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        {item.size && <p className="text-xs text-muted-foreground">Taille : {item.size}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.quantity} x {Number(item.price_at_purchase).toLocaleString('fr-FR')} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end pt-4 border-t border-border">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Total à payer</p>
                  <p className="font-heading text-2xl font-bold text-[#c8a25d]">
                    {Number(selectedOrder.order.total).toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">Impossible de charger la commande.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
