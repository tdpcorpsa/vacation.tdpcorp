import { PaginationGroup } from '@/components/ui/pagination-group'
import { PageHeader } from '@/components/ui/page-header'
import { Suspense } from 'react'

export default function DemoPaginationGroup() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagination Group"
        description="A pagination component based on ButtonGroup using nuqs for state."
        withSidebar={false}
      />

      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">Interactive Demo</h2>
        <p className="text-sm text-muted-foreground">
          This component syncs with the URL query parameter `?page=...`. Try
          clicking the buttons.
        </p>
        <div className="flex justify-center">
          <Suspense fallback={<div>Loading...</div>}>
            <PaginationGroup total={200} pageSize={10} />
          </Suspense>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">States</h2>
        <div className="space-y-2">
          <p className="text-sm font-medium">Disabled</p>
          <div className="flex justify-center">
            <Suspense fallback={<div>Loading...</div>}>
              <PaginationGroup total={100} pageSize={10} disabled />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
