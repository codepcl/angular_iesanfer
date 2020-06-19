import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.styl']
})
export class TopNavComponent implements OnInit {

  @Output() sideNavToggled = new EventEmitter<void>();

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.sideNavToggled.emit();
  }

  onLoggedout() {
    localStorage.removeItem('isLoggedin');
    window.sessionStorage.removeItem('ApiToken');
    this.router.navigate(['/login']);
  }

}
