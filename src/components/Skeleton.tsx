interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-[var(--grey5)] dark:bg-neutral-800 ${className}`}
      {...props}
    />
  )
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] flex">
      {/* Desktop Persistent Sidebar Skeleton */}
      <aside className="no-print hidden lg:flex fixed top-0 bottom-0 left-0 z-40 w-[240px] bg-[var(--backgroundColor)] border-r border-[var(--secondaryBorderColor)] flex-col justify-between py-6 px-5">
        <div className="space-y-6">
          {/* Logo mark */}
          <div className="flex items-center gap-2.5 px-2">
            <Skeleton className="w-6 h-6 rounded-md" />
            <Skeleton className="w-12 h-4 rounded" />
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-24 h-4 rounded" />
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--secondaryBorderColor)]" />

          {/* CV Controls */}
          <div className="space-y-2">
            <Skeleton className="w-18 h-2.5 rounded ml-2" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Bottom switcher skeleton */}
        <div className="pt-4 border-t border-[var(--secondaryBorderColor)] flex items-center justify-between px-2">
          <Skeleton className="w-20 h-3.5 rounded" />
          <Skeleton className="w-7 h-7 rounded-lg" />
        </div>
      </aside>

      {/* Main Profile Canvas Skeleton */}
      <main className="w-full flex justify-center py-10 sm:py-14 px-4 sm:px-8 lg:pl-[240px]">
        <div className="readcv-container layout-editorial w-full max-w-[540px] space-y-10">
          {/* Authentic Editorial Hero Skeleton matching ProfileHero.tsx */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 mb-8">
            <Skeleton className="w-[92px] h-[92px] rounded-full shrink-0" />
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-6 w-44 rounded-md" />
              <Skeleton className="h-4 w-64 rounded" />
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>

          {/* About Section Skeleton */}
          <div className="readcv-section space-y-3 border-t border-[var(--secondaryBorderColor)] pt-6">
            <Skeleton className="h-4 w-16 rounded" />
            <div className="space-y-2 sm:ml-[100px]">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          </div>

          {/* Work Experience Section Skeleton */}
          <div className="readcv-section space-y-4 border-t border-[var(--secondaryBorderColor)] pt-6">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="space-y-6 sm:ml-[100px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section Skeleton */}
          <div className="readcv-section space-y-4 border-t border-[var(--secondaryBorderColor)] pt-6">
            <Skeleton className="h-4 w-20 rounded" />
            <div className="space-y-5 sm:ml-[100px]">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-3 w-14 rounded" />
                  </div>
                  <Skeleton className="h-3.5 w-5/6 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
