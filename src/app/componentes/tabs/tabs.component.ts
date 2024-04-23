import { Component, Input, OnInit } from '@angular/core';

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

  constructor() {}
}
