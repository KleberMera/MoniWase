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
