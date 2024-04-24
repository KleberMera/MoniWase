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

  firebaseSvc = inject(FirebaseService);
  utilisSvc = inject(UtilsService);
  alertCtrl = inject(AlertController)

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

  user: User2 | null = null;
  userData: any | null = null;

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
    const categories: { [key: string]: { fecha: Date[], valor: number[] } } = {};

    for (const key in userData) {
      if (Object.prototype.hasOwnProperty.call(userData, key) && key !== 'uid' && key !== 'email' && key !== 'name') {
        const category = userData[key];
        const categoryName = key;

        if (!categories[categoryName]) {
          categories[categoryName] = {
            fecha: [new Date(category.fecha.seconds * 1000)],
            valor: [category.valor]
          };
        } else {
          categories[categoryName].fecha.push(new Date(category.fecha.seconds * 1000));
          categories[categoryName].valor.push(category.valor);
        }
      }
    }

    for (const categoryName in categories) {
      if (Object.prototype.hasOwnProperty.call(categories, categoryName)) {
        console.log('Categoria:', categoryName);
        for (let i = 0; i < categories[categoryName].fecha.length; i++) {
          console.log('Fecha:', categories[categoryName].fecha[i]);
          console.log('Valor:', categories[categoryName].valor[i]);
          console.log('-------------------------');
        }
      }
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
