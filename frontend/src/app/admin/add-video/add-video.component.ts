import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, NgForm } from "@angular/forms";
import { VideoService } from "../../services/video.service";
import { StaffAuthService } from "../../services/staff-auth.service";
@Component({
  selector: "app-add-video",
  templateUrl: "./add-video.component.html",
  styleUrls: ["./add-video.component.css"],
})
export class AddVideoComponent implements OnInit {
  category: Catagory[] = [
    { value: "news", viewValue: "News" },
    { value: "movie", viewValue: "Movie" },
    { value: "drama", viewValue: "Drama" },
    { value: "comedy", viewValue: "Comedy" },
    { value: "music", viewValue: "Music" },
    { value: "tvshow", viewValue: "TV Show" },
    { value: "sport", viewValue: "Sport" },
    { value: "technology", viewValue: "Technology" },
    { value: "tips", viewValue: "Tips" },
    { value: "others", viewValue: "Other" },
  ];
  error$: String = "";
  success$: String = "";

  selectedFile: File;

  constructor(
    private videoService: VideoService,
    private userAuthService: StaffAuthService
  ) {}

  ngOnInit() {}

  postBtn = true;
  post(form: NgForm) {
    // // console.log(form.value)
    // console.log(this.selectedFile);

    this.postBtn = false;
    const uploadData = new FormData();
    uploadData.append("vid", form.value.vid);
    uploadData.append("catagory", form.value.catagory);
    uploadData.append("discription", form.value.discription);
    uploadData.append("title", form.value.title);
    uploadData.append("uid", this.userAuthService.getUser().email);
    this.videoService.postVideo(uploadData).subscribe(
      (res) => {
        this.postBtn = true;
        if (res["message"] === "true") {
          this.success$ = "Video posted success.";
          this.error$ = "";
          form.resetForm();
        } else {
          this.error$ = res["message"];
          this.success$ = "";
        }
      },
      (err) => {
        this.postBtn = true;
        this.success$ = "Video posted error <br>" + err;
      }
    );
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }
}
export interface Catagory {
  value: string;
  viewValue: string;
}
