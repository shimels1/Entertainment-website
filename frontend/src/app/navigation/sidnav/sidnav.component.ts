import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app2-sidnav',
  templateUrl: './sidnav.component.html',
  styleUrls: ['./sidnav.component.css']
})
export class SidnavComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>();
  constructor(@Inject(WINDOW) private window: Window, ) { }

  ngOnInit() {
  }

  sidenavOnToggle() {
 

    // if(window.innerWidth <= 1279){
      this.sidenavToggle.emit();
    // }else{
      // this.menu=false;
    // }
  }


}
