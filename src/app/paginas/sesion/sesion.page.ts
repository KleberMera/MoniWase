import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.page.html',
  styleUrls: ['./sesion.page.scss'],
})
export class SesionPage  {
  nombreUsuario: string;
  
  firebaseSvc = inject(FirebaseService);
  utilisSvc = inject(UtilsService);

  signOut(){
    this.firebaseSvc.signOut();
  }

  ionViewWillEnter() {
    // Obtener el nombre de usuario del localStorage
    const userData = this.utilisSvc.getFromLocalStorage('user');
    if (userData && userData.name) {
      this.nombreUsuario = userData.name;
    }
  }

 
}
