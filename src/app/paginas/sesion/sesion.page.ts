import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.page.html',
  styleUrls: ['./sesion.page.scss'],
})
export class SesionPage  {

  
  firebaseSvc = inject(FirebaseService);
  utilisSvc = inject(UtilsService);

  signOut(){
    this.firebaseSvc.signOut();
  }
}
