import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Comment } from "../model/Comment";
import { CommentPagination } from "../model/CommentPagination";
@Injectable({
  providedIn: "root",
})
export class CommentService {
  // url = 'https://tesfatube.com/api/comment';
  url = "http://localhost:3000/api/comment";
  constructor(private _http: HttpClient) {}

  getAllComment(id, filter, page, itemPerPage) {
    return this._http.get<CommentPagination>(
      this.url +
        "/getComment/" +
        id +
        "/" +
        filter +
        "/" +
        page +
        "/" +
        itemPerPage
    );
  }

  postComment(postComment) {
    return this._http.post(this.url + "/postComment/", postComment);
  }
  getCommentCount(vid) {
    return this._http.get<number>(this.url + "/count/" + vid);
  }
  likeComment(cid, email) {
    return this._http.post(this.url + "/like/" + cid + "/" + email, {});
  }
  getLike(cid, email) {
    return this._http.get(this.url + "/countlike/" + cid + "/" + email, {});
  }
}
