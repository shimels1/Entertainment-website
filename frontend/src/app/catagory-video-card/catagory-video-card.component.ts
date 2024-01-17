import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-catagory-video-card',
  templateUrl: './catagory-video-card.component.html',
  styleUrls: ['./catagory-video-card.component.css']
})
export class CatagoryVideoCardComponent implements OnInit {

  @Input() data:String;
  constructor() { }

  ngOnInit() {
  }

}
