import { useEffect, useState } from "react";

export interface PaginationOptions {
  page: number;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  setPage: (page: number) => void;
}

export const usePagination = (
  initialPage = 1,
  initialTotalPages = 1,
): PaginationOptions => {
  const [page, unsafeSetPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const safeSetPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      unsafeSetPage(newPage);
    } else if (newPage > totalPages) {
      unsafeSetPage(totalPages);
    } else if (newPage < 1) {
      unsafeSetPage(1);
    }
  };

  useEffect(() => {
    if (page < 1) {
      unsafeSetPage(1);
    } else if (page > totalPages) {
      unsafeSetPage(totalPages);
    }
  }, [page, totalPages]);

  return { page, totalPages, setPage: safeSetPage, setTotalPages };
};
