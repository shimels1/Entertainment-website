import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Video } from "../model/video";
import { VideoPagination } from "../model/VideoPagination";

@Injectable({
  providedIn: "root",
})
export class VideoService {
  // url = "https://tesfatube.com/api/video";
  url = "http://localhost:3000/api/video";
  constructor(private _http: HttpClient) {}

  getVideo(id) {
    return this._http.get<Video>(this.url + "/getOne/" + id);
  }
  getVideoInformation(id) {
    return this._http.get<any>(this.url + "/getVideoInformation/" + id);
  }
  getAllVideo() {
    return this._http.get<Video[]>(this.url + "/getAll");
  }
  getVideoByCategory(cat, page, itemNumber, passVideoId) {
    if (passVideoId === "") {
      passVideoId = "null";
    }
    return this._http.get<VideoPagination>(
      this.url +
        "/category/" +
        cat +
        "/" +
        page +
        "/" +
        itemNumber +
        "/" +
        passVideoId
    );
  }
  getEditorialPike(page, itemNumber, passVideoId) {
    if (passVideoId === "") {
      passVideoId = "null";
    }
    return this._http.get<VideoPagination>(
      this.url +
        "/getEditorialPike/" +
        page +
        "/" +
        itemNumber +
        "/" +
        passVideoId
    );
  }
  AdmingetAllVideo(page, itemNumber) {
    return this._http.get<VideoPagination>(
      this.url + "/adminGetAllVideo/" + page + "/" + itemNumber
    );
  }
  getAdminAllVideo() {
    return this._http.get<Video[]>(this.url + "/adminGetAll");
  }
  postVideo(uploadData) {
    return this._http.post(this.url + "/post", uploadData);
  }

  activaDiactive(id) {
    return this._http.put(this.url + "/changeStatus/" + id, {});
  }

  editorialPickSwitcher(id) {
    return this._http.put(this.url + "/editorialPickSwitcher/" + id, {});
  }
  likeVideo(vid, email) {
    return this._http.post(this.url + "/like/" + vid + "/" + email, {});
  }
  dislikeVideo(vid, email) {
    return this._http.post(this.url + "/dislike/" + vid + "/" + email, {});
  }
  getTotalLike(vid, email) {
    return this._http.get(this.url + "/like/" + vid + "/" + email, {});
  }
  getTotalDisLike(vid, email) {
    return this._http.get(this.url + "/dislike/" + vid + "/" + email, {});
  }

  countCatagoryVideos(cat) {
    return this._http.get(this.url + "/countCategory/" + cat, {});
  }
  deleteVideo(id) {
    return this._http.delete(this.url + "/delete/" + id, {});
  }

  countCatagoryVideosEP() {
    return this._http.get(this.url + "/countCategoryEP", {});
  }

  updateVideoDiscription(uploadData) {
    return this._http.put(this.url + "/updateDiscription/", uploadData);
  }
}
