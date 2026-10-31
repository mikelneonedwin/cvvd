export function ReadCvLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="6" fill="currentColor" />
      <path
        d="M7 16.5C6.72386 16.5 6.5 16.2761 6.5 16V8C6.5 7.72386 6.72386 7.5 7 7.5H10C12.2091 7.5 14 9.29086 14 11.5C14 13.7091 12.2091 15.5 10 15.5H8V16C8 16.2761 7.77614 16.5 7.5 16.5H7ZM8 14H10C11.3807 14 12.5 12.8807 12.5 11.5C12.5 10.1193 11.3807 9 10 9H8V14ZM14.5 16.5C14.2239 16.5 14 16.2761 14 16V8C14 7.72386 14.2239 7.5 14.5 7.5H15C15.2761 7.5 15.5 7.72386 15.5 8V14.6L17.5 7.7C17.57 7.45 17.8 7.3 18.05 7.35C18.3 7.4 18.45 7.65 18.35 7.9L16 16C15.9 16.3 15.65 16.5 15.35 16.5H14.5Z"
        fill="#ffffff"
      />
    </svg>
  )
}

export function ArrowExternalIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ExploreIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M11.737 7.958a.75.75 0 10-.389 1.45l7.245 1.94A.75.75 0 1018.98 9.9l-7.244-1.94zM10.896 11.098a.75.75 0 00-.389 1.448l7.245 1.942a.75.75 0 00.388-1.45l-7.245-1.94zM9.136 14.767a.75.75 0 01.918-.53l4.83 1.294a.75.75 0 01-.388 1.449l-4.83-1.294a.75.75 0 01-.53-.919z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M16.5 23.987L6.841 21.4a2.75 2.75 0 01-1.944-3.368L8.132 5.957A2.75 2.75 0 0111.5 4.013L21.16 6.6a2.75 2.75 0 011.944 3.368l-3.236 12.074a2.75 2.75 0 01-3.368 1.944zM6.345 18.42a1.25 1.25 0 00.884 1.531l9.66 2.588a1.25 1.25 0 001.53-.883L21.655 9.58a1.25 1.25 0 00-.884-1.531L11.11 5.46a1.25 1.25 0 00-1.53.884L6.345 18.42z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export function OpenRolesIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M11.5 6.5a1 1 0 00-1 1V9h7V7.5a1 1 0 00-1-1h-5zM19 9V7.5A2.5 2.5 0 0016.5 5h-5A2.5 2.5 0 009 7.5V9H8a3 3 0 00-3 3v7a3 3 0 003 3h12a3 3 0 003-3v-7a3 3 0 00-3-3h-1zM8 10.5A1.5 1.5 0 006.5 12v7A1.5 1.5 0 008 20.5h12a1.5 1.5 0 001.5-1.5v-7a1.5 1.5 0 00-1.5-1.5H8z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export function SearchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M14 5.25a3.016 3.016 0 100 6.033 3.016 3.016 0 000-6.033zM9.484 8.266a4.516 4.516 0 119.032 0 4.516 4.516 0 01-9.032 0zM14 15.75c-2.572 0-4.927.92-6.758 2.448a1.342 1.342 0 000 2.078A10.503 10.503 0 0014 22.724c2.572 0 4.927-.92 6.758-2.448a1.342 1.342 0 000-2.078A10.503 10.503 0 0014 15.75zm-7.719 1.297A12.003 12.003 0 0114 14.25c2.936 0 5.629 1.051 7.72 2.797a2.842 2.842 0 010 4.38A12.003 12.003 0 0114 24.224a12.003 12.003 0 01-7.72-2.797 2.842 2.842 0 01.001-4.38z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export function PostsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M11.68 22.696L6.84 21.399a2.75 2.75 0 01-1.944-3.368L8.132 5.957A2.75 2.75 0 0111.5 4.013L21.16 6.6a2.75 2.75 0 011.944 3.368l-1.944 7.253a5.25 5.25 0 01-2.446 3.188l-3.05 1.761a5.25 5.25 0 01-3.984.525zm-5.335-4.277a1.25 1.25 0 00.884 1.531l4.588 1.23.971-3.622a2.75 2.75 0 013.368-1.945l3.622.97 1.877-7.002a1.25 1.25 0 00-.884-1.531L11.11 5.46a1.25 1.25 0 00-1.53.884L6.345 18.42zm12.841-.441l-3.418-.916a1.25 1.25 0 00-1.531.884l-.916 3.418a3.75 3.75 0 001.592-.492l3.051-1.761a3.75 3.75 0 001.222-1.133z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export function SidebarToggleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="1.5" rx="0.5" width="14" x="5" y="6.75" />
      <rect fill="currentColor" height="1.5" rx="0.5" width="14" x="5" y="11.25" />
      <rect fill="currentColor" height="1.5" rx="0.5" width="9" x="5" y="15.75" />
    </svg>
  )
}

export function SupporterHeartIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M3.22 9.204c-.531-.815-.886-1.69-.886-2.577 0-1.794 1.373-3.167 3.167-3.167.703 0 1.324.288 1.82.747l.68.627.678-.627c.497-.46 1.118-.747 1.822-.747 1.793 0 3.166 1.373 3.166 3.167 0 .887-.355 1.763-.885 2.575l-.001.002c-.529.812-1.235 1.564-1.939 2.204a19.99 19.99 0 01-2.81 2.123l-.015.01a.041.041 0 01-.033 0l-.016-.01a19.996 19.996 0 01-2.81-2.12c-.703-.644-1.409-1.396-1.938-2.207z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}
