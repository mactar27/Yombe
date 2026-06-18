# Admin CRUD Implementation Plan

## Goal Description
Create a full admin interface allowing the administrator to **Create, Read, Update, Delete (CRUD)** products, view client information, and manage orders.

## User Review Required
> [!IMPORTANT]
> The data model for **Product**, **Client**, and **Order** needs confirmation. Please review the proposed fields and adjust as needed.

## Open Questions
> [!QUESTION]
> 1. Desired product fields (e.g., name, description, price, image, stock, category)?
> 2. Client fields (e.g., name, email, phone, address)?
> 3. Order fields (e.g., status, total, items list, timestamps)?
> 4. Should the admin be able to upload product images directly?
> 5. Any pagination or search requirements for the product list?

## Proposed Changes
---
### Database Schema (MySQL)
- **products** table: `id`, `name`, `slug`, `description`, `price`, `imageUrl`, `stock`, `categoryId`, `createdAt`, `updatedAt`
- **categories** table (optional): `id`, `name`, `slug`
- **clients** table: `id`, `name`, `email`, `phone`, `address`, `createdAt`
- **orders** table: `id`, `clientId`, `status`, `total`, `createdAt`, `updatedAt`
- **order_items** table: `id`, `orderId`, `productId`, `quantity`, `price`

### API Routes (Next.js App Router)
- `app/api/admin/products/route.ts` – GET (list), POST (create)
- `app/api/admin/products/[id]/route.ts` – GET, PATCH, DELETE
- Similar routes for `clients` and `orders`.

### Front‑End Pages & Components
- **Layout**: `app/admin/layout.tsx` (already created) – provides navigation sidebar.
- **Dashboard**: `app/admin/page.tsx` – overview cards.
- **Products List**: `app/admin/products/page.tsx` – table with edit/delete buttons, pagination, search.
- **Product Form**: `components/admin/ProductForm.tsx` – re‑usable for create & edit, includes image upload (via `next/image` and `uploadthing` or simple `<input type="file">`).
- **Clients Page**: `app/admin/clients/page.tsx` – list client details.
- **Orders Page**: `app/admin/orders/page.tsx` – list orders, view order details.

### Server‑Side Logic
- Use existing `lib/db.ts` pool for MySQL queries.
- Validate inputs with Zod schemas.
- Protect all admin routes with middleware checking session/admin role.

### Styling & UX
- Follow existing design system (tailwind, dark mode, glassmorphism).
- Add micro‑animations on row hover, button press.
- Use consistent color palette (gold accents, dark background).

### Verification Plan
- **Automated**: Write integration tests for API endpoints (Jest + supertest).
- **Manual**: Verify admin can create a product, see it in boutique page, edit, delete; view client list; view order details.

---
