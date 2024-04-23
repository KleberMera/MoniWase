import { Component, OnInit, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage {
  tabs = [
    { icon: 'list-sharp', name: 'Lista', routerLink: '/listas' },
    { icon: 'card-outline', name: 'Gastos', routerLink: '/gastos' },
    { icon: 'analytics-outline', name: 'Grafics', routerLink: '/graficos' },
    {
      icon: 'exit-outline',
      name: 'Salir',
      clickHandler: () => this.confirmarSalir(),
    },
  ];
  



  mostrarCampos: boolean = false;
  nombreGasto: string = '';
  valor: string = '';
  fecha: string = ''; // Cambiado a una variable de tipo Date
  botones = [
    { icon: 'gift-outline', nombreGasto: 'Regalos' },
    { icon: 'fitness-outline', nombreGasto: 'Gastos de Salud' },
    { icon: 'airplane-outline', nombreGasto: 'Viaje' },
    { icon: 'cart-outline', nombreGasto: 'Compras' },
    { icon: 'card-outline', nombreGasto: 'Tarjeta de Crédito' },
    { icon: 'help-circle-outline', nombreGasto: 'Otros' },
    { icon: 'game-controller-outline', nombreGasto: 'Juegos' },
    { icon: 'shirt-outline', nombreGasto: 'Ropa y accesorios' },
    { icon: 'logo-amazon', nombreGasto: 'Compra en Línea' },
    { icon: 'bus-outline', nombreGasto: 'Transporte' },
    { icon: 'water-outline', nombreGasto: 'Servicios básicos' },
    { icon: 'construct-outline', nombreGasto: 'Reparación / Mantenimiento' }
  ];
  nombreUsuario: string;

  firebaseSvc = inject(FirebaseService);
  utilisSvc = inject(UtilsService);
  alertCtrl = inject(AlertController)

  //alertCtrl = inject(AlertController);


  ionViewWillEnter() {
    // Obtener el nombre de usuario del localStorage
    const userData = this.utilisSvc.getFromLocalStorage('user');
    if (userData && userData.name) {
      this.nombreUsuario = userData.name;
    }
  }

  constructor(private toastController: ToastController, private firestore: AngularFirestore) { }



  mostrarCamposSeleccionados(boton: any) {
    this.valor = '';
    this.fecha = ''; // Reiniciar la fecha al seleccionar un nuevo gasto
    this.mostrarCampos = true;
    // Establece el nombre del gasto en el campo de entrada
    this.nombreGasto = boton ? boton.nombreGasto : '';
  }

  async grabarInformacion() {
    if (!this.nombreGasto || !this.valor || !this.fecha) {
      this.mostrarMensajeCampoIncompleto();
      return; // Salir del método si algún campo está incompleto
    }

    try {
      // Obtener una referencia a la colección 'users' donde el campo 'name' sea igual a nombreUsuario
      const querySnapshot = await this.firestore.collection('users', ref => ref.where('name', '==', this.nombreUsuario)).get().toPromise();

      // Actualizar todos los documentos que cumplen con el criterio
      const updatePromises = querySnapshot.docs.map(queryDocumentSnapshot => {
        const docRef = queryDocumentSnapshot.ref; // Obtener la referencia al documento

        const nombreCampoGasto = this.nombreGasto.toLowerCase(); // Convertir a minúsculas
        const nuevoGasto = {};
        nuevoGasto[nombreCampoGasto] = {
          valor: this.valor,
          fecha: new Date(this.fecha) // Convertir la cadena de fecha a tipo Date
        };

        // Actualizar el documento con los nuevos valores
        return updateDoc(docRef, nuevoGasto);
      });

      // Esperar a que todas las actualizaciones se completen
      await Promise.all(updatePromises);

      console.log("Todos los documentos actualizados con el nuevo dato.");
      // Reiniciar los campos después de guardar los datos
      this.nombreGasto = '';
      this.valor = '';
      this.fecha = '';
      this.mostrarCampos = false;
      this.mostrarMensajeExito();
    } catch (error) {
      console.error("Error al actualizar los documentos:", error);
      // Manejar el error adecuadamente
    }
  }
  async mostrarMensajeExito() {
    const toast = await this.toastController.create({
      message: 'Gastos grabados exitosamente',
      duration: 2000,
      position: 'top',
      color: "medium"
    });
    toast.present();
  }
  async mostrarMensajeCampoIncompleto() {
    const toast = await this.toastController.create({
      message: 'Por favor complete todos los campos',
      duration: 2000,
      position: 'top',
      color: "medium"
    });
    toast.present();
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
          },
        },
        {
          text: 'Salir',
          handler: () => {
            this.signOut(); // Llama al método signOut si el usuario confirma salir
          },
        },
      ],
    });

    await alert.present();
  }

  signOut() {
    this.firebaseSvc.signOut();
  }
}





