import { PageHeader } from '@/components/ui/page-header'
import { SkeletonList } from '@/components/ui/skeleton-list'

export default function DemoSkeletonList() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Skeleton List"
        description="Placeholder lists for loading states with table, list, and card variants."
        withSidebar={false}
      />

      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">Table</h2>
        <p className="text-sm text-muted-foreground">
          Renders a table-like skeleton with header and rows.
        </p>
        <SkeletonList variant="table" count={5} columns={5} />
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">List</h2>
        <p className="text-sm text-muted-foreground">
          Renders stacked items with media, title and description placeholders.
        </p>
        <SkeletonList variant="list" count={6} />
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">Card Grid</h2>
        <p className="text-sm text-muted-foreground">
          Renders a responsive grid of cards with header, content and footer.
        </p>
        <SkeletonList variant="card" count={6} />
      </div>
    </div>
  )
}
