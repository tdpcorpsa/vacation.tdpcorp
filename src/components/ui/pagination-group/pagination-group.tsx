'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { usePagination } from './use-pagination'

interface PaginationGroupProps {
  total: number
  pageSize: number
  disabled?: boolean
  siblingCount?: number
  queryKey?: string
}

export function PaginationGroup({
  total,
  pageSize,
  disabled,
  siblingCount = 1,
  queryKey = 'page',
}: PaginationGroupProps) {
  const { page, setPage } = usePagination({ queryKey })

  const pageCount = Math.ceil(total / pageSize)
  const currentPage = page ?? 1

  // Helper to generate page numbers
  const generatePagination = () => {
    // If pageCount is 0 or 1, maybe show just 1 or nothing?
    // Assuming pageCount >= 1
    if (pageCount <= 1) return [1]

    const totalNumbers = siblingCount + 5 // siblingCount + first + last + current + 2*dots
    // simplified logic

    // Case 1: If the number of pages is less than the page numbers we want to show in our
    // paginationComponent, we return the range [1..totalPageCount]
    if (totalNumbers >= pageCount) {
      return range(1, pageCount)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, pageCount)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < pageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = pageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, 'dots', pageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(pageCount - rightItemCount + 1, pageCount)
      return [firstPageIndex, 'dots', ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, 'dots', ...middleRange, 'dots', lastPageIndex]
    }

    return range(1, pageCount)
  }

  const pages = generatePagination()

  const handlePrevious = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < pageCount) {
      setPage(currentPage + 1)
    }
  }

  const handlePageChange = (p: number) => {
    setPage(p)
  }

  return (
    <ButtonGroup>
      <Button
        variant="link"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage <= 1 || disabled}
        aria-label="Previous page"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        <span>Anterior</span>
      </Button>

      {pages.map((p, i) => {
        if (p === 'dots') {
          return (
            <Button
              key={`dots-${i}`}
              variant="link"
              size="icon-sm"
              disabled
              className="cursor-default"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )
        }

        return (
          <Button
            key={p}
            variant={p === currentPage ? 'default' : 'ghost'}
            size="icon-sm"
            onClick={() => handlePageChange(p as number)}
            disabled={disabled}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Button>
        )
      })}

      <Button
        variant="link"
        size="sm"
        onClick={handleNext}
        disabled={currentPage >= pageCount || disabled}
        aria-label="Next page"
      >
        <span>Siguiente</span>
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </ButtonGroup>
  )
}

function range(start: number, end: number) {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
}
