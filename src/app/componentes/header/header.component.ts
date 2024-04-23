import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() customColor: string = 'tertiary'; // Establece un valor predeterminado, en caso de que no se proporcione ningún color desde el componente padre

  constructor() { }

  ngOnInit() {
  }

}
