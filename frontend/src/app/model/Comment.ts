import { CLASS_NAME } from "@angular/flex-layout";
import { CommentService } from "../services/comment.service";

export class Comment {
  comment: String;
  date: Date;
  dislike: number;
  idcomment: String;
  like: number;
  email: String;
  videoid: String;
  constructor(private commentService: CommentService) {
    this.commentService.getCommentCount(this.videoid).subscribe((res) => {
      console.log("res");
      if (res["like"]) {
        return res["like"];
      } else {
        return 5;
      }
    });
  }
}
