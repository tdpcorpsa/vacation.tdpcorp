import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SkeletonList } from '@/components/ui/skeleton-list'

describe('SkeletonList', () => {
  it('renders list variant with given count', () => {
    const { container } = render(<SkeletonList variant="list" count={3} />)
    const root = container.querySelector(
      '[data-slot="skeleton-list"][data-variant="list"]'
    )
    expect(root).toBeTruthy()
    const items = container.querySelectorAll('[data-slot="item"]')
    expect(items.length).toBe(3)
  })
  it('renders card variant grid with given count', () => {
    const { container } = render(<SkeletonList variant="card" count={4} />)
    const cards = container.querySelectorAll('[data-slot="card"]')
    expect(cards.length).toBe(4)
  })
  it('renders table variant with header and rows', () => {
    const { container } = render(
      <SkeletonList variant="table" count={5} columns={3} />
    )
    const rows = container.querySelectorAll('[data-slot="table-row"]')
    expect(rows.length).toBe(6)
    const heads = container.querySelectorAll('[data-slot="table-head"]')
    expect(heads.length).toBe(3)
  })
})
