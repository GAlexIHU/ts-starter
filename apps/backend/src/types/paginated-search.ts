export interface PaginatedSearchResult<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
