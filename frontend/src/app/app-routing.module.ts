import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CategoryViewComponent } from "./category-view/category-view.component";
import { PlayVideoComponent } from "./play-video/play-video.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { MetaGuard } from "@ngx-meta/core";
const routes: Routes = [
  {
    path: "playVideo",
    component: PlayVideoComponent,
  },
  {
    path: "category/:cat/:page",
    component: CategoryViewComponent,
  },
  {
    path: "about",
    component: PrivacyPolicyComponent,
  },
  {
    path: "privacy",
    component: PrivacyPolicyComponent,
  },
  {
    path: "contact",
    component: ContactUsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
