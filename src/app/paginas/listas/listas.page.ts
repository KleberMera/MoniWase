import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User2 } from 'src/app/models/user.models';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.page.html',
  styleUrls: ['./listas.page.scss'],
})
export class ListasPage {

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
    for (const key in userData) {
      if (Object.prototype.hasOwnProperty.call(userData, key) && key !== 'uid' && key !== 'email' && key !== 'name') {
        const categoria = {
          nombre: key,
          fecha: new Date(userData[key].fecha.seconds * 1000),
          valor: userData[key].valor
        };
        this.categorias.push(categoria);
      }
    }
  }
}
