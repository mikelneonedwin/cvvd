import { CheckCircle2 } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'

export function Toast() {
  const { toastMessage } = useProfile()

  if (!toastMessage) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-mono shadow-xl dark:bg-neutral-100 dark:text-neutral-950 border border-neutral-700/50 dark:border-neutral-300/50">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  )
}
