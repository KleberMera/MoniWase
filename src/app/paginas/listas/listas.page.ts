import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { User2 } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.page.html',
  styleUrls: ['./listas.page.scss'],
})
export class ListasPage {
  tabs = [
    { icon: 'list-sharp', name: 'Lista',  routerLink: '/listas' },
    { icon: 'card-outline', name: 'Gastos', routerLink: '/gastos' },
    { icon: 'home-outline', name: 'Home', routerLink: '/sesion' },
    { icon: 'analytics-outline', name: 'Grafics',  routerLink: '/graficos' },
    { icon: 'exit-outline', name: 'Salir', clickHandler: () => this.confirmarSalir() },
  ];
  firebaseSvc = inject(FirebaseService);
  utilisSvc = inject(UtilsService);
  alertCtrl = inject(AlertController)

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
  

  user: User2 | null = null;
  userData: any | null = null;
  categorias: any[] = [];

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || ''
        };
        console.log('Usuario conectado:', this.user);
        this.getUserData(user.uid);
      } else {
        console.log('No hay usuario conectado');
      }
    });
  }

  getUserData(uid: string) {
    this.firestore.collection('users').doc(uid).valueChanges().subscribe(data => {
      if (data) {
        this.userData = data;
        this.processUserData(this.userData);
      } else {
        console.log('No se encontraron datos del usuario');
      }
    });
  }

  processUserData(userData: any) {
    const categoriasMap = new Map<string, any>();
  
    for (const key in userData) {
      if (Object.prototype.hasOwnProperty.call(userData, key) && key !== 'uid' && key !== 'email' && key !== 'name') {
        const nombreCategoria = key.replace(/\d+$/, ''); // Eliminar números al final del nombre de la categoría
        const fecha = new Date(userData[key].fecha.seconds * 1000);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
        const valor = userData[key].valor.toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
  
        // Verificar si ya existe la categoría en el mapa
        if (categoriasMap.has(nombreCategoria)) {
          // Si existe, agregar los datos a la categoría existente
          const categoriaExistente = categoriasMap.get(nombreCategoria);
          categoriaExistente.datos.push({ fecha: fechaFormateada, valor });
        } else {
          // Si no existe, crear una nueva entrada en el mapa
          categoriasMap.set(nombreCategoria, { nombre: nombreCategoria, datos: [{ fecha: fechaFormateada, valor }] });
        }
      }
    }
  
    // Convertir el mapa a un arreglo para usarlo en el HTML
    this.categorias = Array.from(categoriasMap.values());
    console.log('Categorías para mostrar:', this.categorias);
  }
  
  
  
}
