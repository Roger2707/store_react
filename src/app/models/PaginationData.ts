export interface PaginationData<T> {
    dataInCurrentPage: T[],
    currentPage: number,
    totalPage: number,
    totalRow: number,
    rowInPage: number,
}