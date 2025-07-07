export interface IPaginatedResponse<T> {
  pageCount: number;
  data: T[];
}
