export interface PaginatedResult<T> {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
    data: T[]
  }