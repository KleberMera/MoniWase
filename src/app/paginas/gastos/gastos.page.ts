import { Component, OnInit, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
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
  mostrarCampos: boolean = false;
  nombreGasto: string = '';
  valor: string = '';
  mes: string = '';
  ano: string = '';
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
    this.mes = '';
    this.ano = '';
    this.mostrarCampos = true;
    // Establece el nombre del gasto en el campo de entrada
    this.nombreGasto = boton ? boton.nombreGasto : '';
  }

  async grabarInformacion() {
    if (!this.nombreGasto || !this.valor || !this.mes || !this.ano) {
      this.mostrarMensajeCampoIncompleto();
      return; // Salir del método si algún campo está incompleto
    }

    try {
      // Obtener una referencia a la colección 'users' donde el campo 'name' sea igual a nombreUsuario
      const querySnapshot = await this.firestore.collection('users', ref => ref.where('name', '==', this.nombreUsuario)).get().toPromise();

      // Actualizar todos los documentos que cumplen con el criterio
      const updatePromises = querySnapshot.docs.map(queryDocumentSnapshot => {
        const doc = queryDocumentSnapshot.data(); // Obtener los datos del documento
        const docRef = queryDocumentSnapshot.ref; // Obtener la referencia al documento

        const nombreCampoGasto = this.nombreGasto.toLowerCase(); // Convertir a minúsculas
        const nuevoGasto = {};
        nuevoGasto[nombreCampoGasto] = {
          valor: this.valor,
          mes: this.mes,
          ano: this.ano
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
      this.mes = '';
      this.ano = '';
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
}




