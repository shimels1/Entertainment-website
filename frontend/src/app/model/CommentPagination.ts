import { Comment } from "./Comment";
export interface CommentPagination {
  comment: Comment[];
  currentPage: number;
  totalVideo: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
  lastPage: number;
}
