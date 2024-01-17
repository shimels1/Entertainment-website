import {
  Component,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { OtherService } from "../services/other.service";
import { MatSnackBar } from "@angular/material";
import { WINDOW } from "@ng-toolkit/universal";

import { Meta, Title } from "@angular/platform-browser";
import { isPlatformBrowser } from "@angular/common";
@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.css"],
})
export class ContactUsComponent implements OnInit {
  error$: String = "";

  isMobile = false;
  width = 0;
  isBrowser;
  constructor(
    @Inject(WINDOW) private window: Window,
    private otherService: OtherService,
    private snackBar: MatSnackBar,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId,
    private title: Title
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener("window:resize", ["$event"])
  onresize(event) {
    this.width = this.window.innerWidth;
    if (this.window.innerWidth <= 525) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
  openSnackBar(message: string, dur: number) {
    this.snackBar.open(message, "", {
      duration: dur,
    });
  }

  ngOnInit() {
    this.title.setTitle("Contact us - BethTube");

    this.meta.removeTag('property = "og:title"');
    this.meta.removeTag('property= "og:type"');
    this.meta.removeTag('property = "og:image"');
    this.meta.removeTag('property = "og:description"');

    this.meta.addTags([
      {
        property: "og:title",
        content: "BethTube - Ethiopian entertainment website",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "http://i3.ytimg.com/vi/MRlaU3um2KI/maxresdefault.jpg",
      },
      {
        property: "og:description",
        content:
          "BethTube is a reliable source for every information that matters to you all; Entertainment, News Articles, Technology, and so much more from Ethiopia &amp; beyond!",
      },
    ]);

    if (this.isBrowser) {
      this.width = this.window.innerWidth;
      this.window.scrollTo(0, 0);
      if (this.window.innerWidth <= 525) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }
  }
  message$ = "";
  send(form: NgForm) {
    const uploadData = new FormData();
    uploadData.append("name", form.value.name);
    uploadData.append("email", form.value.email);
    uploadData.append("message", form.value.message);
    this.otherService.sendMessage(uploadData).subscribe(
      (res: any) => {
        if (res["message"]) {
          // this.message$ = 'messsge sent success, Thank you.';
          this.openSnackBar("messsge sent success, Thank you.", 3000);
          form.resetForm();
        }
      },
      (err) => {
        // this.openSnackBar(err['error'],7000);
      }
    );
  }
}
