/**
 * Normalise un numéro de téléphone en supprimant les espaces et tirets.
 * Ne suppose AUCUN indicatif par défaut — l'utilisateur peut être n'importe où.
 * Exemples :
 *   "77 351 91 28"   → "773519128"
 *   "+221 77 351 91 28" → "+221773519128"
 *   "+33 6 12 34 56 78" → "+33612345678"
 *   "06 12 34 56 78"  → "0612345678"
 */
export function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-\.\(\)]/g, '')
}
