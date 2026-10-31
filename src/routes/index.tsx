import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '../components/Sidebar'
import { CVProfile } from '../components/CVProfile'
import { ProfileEditor } from '../components/ProfileEditor'
import { PrintPreviewModal } from '../components/PrintPreviewModal'
import { Toast } from '../components/Toast'
import { useProfile } from '../context/ProfileContext'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const {
    isEditing,
    setIsEditing,
    isPreviewingPrint,
    setIsPreviewingPrint,
    triggerPrint,
  } = useProfile()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        triggerPrint()
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        setIsEditing(!isEditing)
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsEditing(true)
      }

      if (e.key === 'Escape') {
        if (isEditing) setIsEditing(false)
        if (isPreviewingPrint) setIsPreviewingPrint(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, isPreviewingPrint, setIsEditing, setIsPreviewingPrint, triggerPrint])

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] text-[var(--grey1)] transition-colors">
      <Sidebar />
      <div className="lg:pl-[240px] transition-all">
        <CVProfile />
      </div>
      <ProfileEditor />
      <PrintPreviewModal />
      <Toast />
    </div>
  )
}
