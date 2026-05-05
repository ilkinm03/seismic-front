export interface PageState {
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 50;

export const totalPages = (total: number, pageSize: number): number =>
  Math.max(1, Math.ceil(total / pageSize));
