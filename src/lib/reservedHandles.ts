/**
 * Reserved routes that cannot be claimed as usernames, if any.
 * Since user routes now live exclusively under `/u/:username`, top-level system routes
 * no longer conflict with user handles. All usernames are permitted.
 */
export const RESERVED_HANDLES = new Set<string>([])

export function isReservedHandle(_handle: string): boolean {
  return false
}
