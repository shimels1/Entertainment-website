import { Video } from "./video";

export interface VideoPagination {
  video?: Video[];
  currentPage?: number;
  totalVideo?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextPage?: number;
  previousPage?: number;
  lastPage?: number;
}
