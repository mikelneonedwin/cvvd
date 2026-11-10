/**
 * Reserved routes and handles that cannot be claimed by users.
 * Matches top-level router paths, API routes, system keywords, and assets.
 */
export const RESERVED_HANDLES = new Set([
  'about',
  'account',
  'admin',
  'api',
  'auth',
  'cvvd',
  'dashboard',
  'edit',
  'editor',
  'explore',
  'login',
  'logout',
  'pricing',
  'profile',
  'settings',
  'signin',
  'signout',
  'signup',
  'studio',
  'trpc',
  'user',
  'users',
])

export function isReservedHandle(handle: string): boolean {
  if (!handle) return false
  const clean = handle
    .toLowerCase()
    .trim()
    .replace(/^cvvd\//, '')
    .replace(/^@/, '')
  return RESERVED_HANDLES.has(clean)
}
