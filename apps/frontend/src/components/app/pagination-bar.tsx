import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

function getDisplayablePages(
  currentPage: number,
  totalPages: number,
): number[] {
  const displayablePages = [currentPage];
  let left = currentPage - 1;
  let right = currentPage + 1;
  while (displayablePages.length < 3 && (left > 0 || right <= totalPages)) {
    if (left > 0) {
      displayablePages.unshift(left);
      left -= 1;
    }
    if (displayablePages.length < 3 && right <= totalPages) {
      displayablePages.push(right);
      right += 1;
    }
  }
  return displayablePages;
}

function showStartingEllipsis(
  currentPage: number,
  totalPages: number,
): boolean {
  return currentPage > 2 && totalPages > 4;
}

function showEndingEllipsis(currentPage: number, totalPages: number): boolean {
  return currentPage < totalPages - 1 && totalPages > 4;
}

function PaginationBar({ page, setPage, totalPages }: PaginationProps) {
  const safeSetPage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    } else if (newPage > totalPages) {
      setPage(totalPages);
    } else if (newPage < 1) {
      setPage(1);
    }
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst short onClick={() => safeSetPage(1)} />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious short onClick={() => safeSetPage(page - 1)} />
        </PaginationItem>
        {showStartingEllipsis(page, totalPages) && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => safeSetPage(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {getDisplayablePages(page, totalPages).map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              onClick={() => safeSetPage(pageNumber)}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        {showEndingEllipsis(page, totalPages) && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => safeSetPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext short onClick={() => safeSetPage(page + 1)} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast short onClick={() => safeSetPage(totalPages)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationBar;
