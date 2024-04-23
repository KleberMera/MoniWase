import { Component, OnInit, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
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

  alertCtrl = inject(AlertController);


  // Función para cerrar sesión

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

  async confirmarSalir() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'tertiary',
          handler: () => {
            console.log('Cancelar');
          }
        }, {
          text: 'Salir',
          handler: () => {
            this.signOut(); // Llama al método signOut si el usuario confirma salir
          }
        }
      ]
    });
  
    await alert.present();
  }



 
}
