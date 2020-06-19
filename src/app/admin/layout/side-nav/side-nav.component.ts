import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.styl']
})
export class SideNavComponent implements OnInit {

  showMenu = false;
  showMenu2 = false;

  constructor() { }

  ngOnInit(): void {
  }

}
