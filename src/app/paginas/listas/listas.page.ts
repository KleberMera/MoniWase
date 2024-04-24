import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { User2 } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { saveAs } from 'file-saver';
import { CategoryData, UserCategories } from 'src/app/models/user.models';


@Component({
  selector: 'app-listas',
  templateUrl: './listas.page.html',
  styleUrls: ['./listas.page.scss'],
})

export class ListasPage {
  firebaseSvc = inject(FirebaseService);
  utilisSvc = inject(UtilsService);
  alertCtrl = inject(AlertController);

  user: User2 | null = null;
  userData: UserCategories | null = null;


  

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || '',
        };
        console.log('Usuario conectado:', this.user);
        this.getUserData(user.uid);
      } else {
        console.log('No hay usuario conectado');
      }
    });
  }

  getUserData(uid: string) {
    this.firestore
      .collection('users')
      .doc(uid)
      .valueChanges()
      .subscribe((data: UserCategories) => {
        if (data) {
          this.userData = data;
          this.processUserData(this.userData);
        } else {
          console.log('No se encontraron datos del usuario');
        }
      });
      
  }

  ionViewWillEnter() {
    // Obtener userCategories del localStorage
    const userCategories = this.utilisSvc.getFromLocalStorage('userCategories');
    if (userCategories) {
      this.userData = userCategories;
    }
  }
  

  processUserData(userData: any) {
    const userCategories: {
      [userid: string]: {
        categorias: {
          [categoria: string]: { fechas: string[]; valores: string[] };
        };
      };
    } = {};

    for (const key in userData) {
      if (
        Object.prototype.hasOwnProperty.call(userData, key) &&
        key !== 'uid' &&
        key !== 'email' &&
        key !== 'name'
      ) {
        const category = userData[key];
        const categoryName = key;

        if (!userCategories[this.user!.uid]) {
          userCategories[this.user!.uid] = { categorias: {} };
        }

        if (!userCategories[this.user!.uid].categorias[categoryName]) {
          userCategories[this.user!.uid].categorias[categoryName] = {
            fechas: [],
            valores: [],
          };
        }

        const fechaFormatted = new Date(
          category.fecha.seconds * 1000
        ).toLocaleDateString('es-ES');
        const valorFormatted = category.valor.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'USD',
        });

        userCategories[this.user!.uid].categorias[categoryName].fechas.push(
          fechaFormatted
        );
        userCategories[this.user!.uid].categorias[categoryName].valores.push(
          valorFormatted
        );
      }
    }

    const jsonData = JSON.stringify(userCategories, null, 2);
    console.log(jsonData); // Imprimir el JSON en la consola
   
  }



}
