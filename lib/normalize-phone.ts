/**
 * Normalise un numéro de téléphone sénégalais en +221XXXXXXXXX
 * Accepte :
 *   77 000 00 00 | 77 000 0000 | 770000000 | +221 77 000 00 00 | 221770000000
 */
export function normalizePhone(raw: string): string {
  // Remove all spaces, dashes, dots, parentheses
  let n = raw.replace(/[\s\-\.\(\)]/g, '')

  // Remove leading +
  if (n.startsWith('+')) n = n.slice(1)

  // Remove country code if present
  if (n.startsWith('221')) n = n.slice(3)

  // Now n should be 9 digits (Senegalese local number)
  if (!/^\d{9}$/.test(n)) {
    // Return as-is normalized for the DB to handle
    return '+221' + n
  }

  return '+221' + n
}
