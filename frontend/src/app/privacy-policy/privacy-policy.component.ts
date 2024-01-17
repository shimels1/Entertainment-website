import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';

import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  isBrowser;
  constructor(@Inject(WINDOW) private window: Window, private  meta: Meta,
  @Inject(PLATFORM_ID) private platformId,
  private title:Title) {
    this.isBrowser = isPlatformBrowser(platformId); }

  ngOnInit() {
    
    this.title.setTitle('Privacy Policy - BethTube');

    this.meta.removeTag('property = "og:title"');        
    this.meta.removeTag('property= "og:type"');
    this.meta.removeTag('property = "og:image"');
    this.meta.removeTag('property = "og:description"');

    this.meta.addTags([
      {property: 'og:title', content: "BethTube - Ethiopian entertainment website"},
      {property: 'og:type', content: "website"},
      {property: 'og:image', content: "http://i3.ytimg.com/vi/MRlaU3um2KI/maxresdefault.jpg"},
      {property: 'og:description', content: "BethTube is a reliable source for every information that matters to you all; Entertainment, News Articles, Technology, and so much more from Ethiopia &amp; beyond!"},
   ]);
   if(this.isBrowser){
    this.window.scrollTo(0, 0);
   }

  }

}
