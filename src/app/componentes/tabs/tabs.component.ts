import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  @Input() tabs: {
    icon: string;
    name: string;
    routerLink?: string;
    clickHandler?: () => void;
  }[] = [];

  activePage: string;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activePage = event.url;
      }
    });
  }
}
