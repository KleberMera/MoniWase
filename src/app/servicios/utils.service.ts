import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  router = inject(Router);

  constructor() {}

  loading() {
    return this.loadingController.create({ spinner: 'crescent' });
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  //Enruta a paginas disponibles
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // Guardar datos de manea local
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //Obtiene el dato local
  /*getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key))
  }*/

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  // Suma todos los valores numéricos dentro de un objeto
  sumarValores(obj: any): number {
    let suma = 0;
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        suma += this.sumarValores(obj[key]); // Si es un objeto, llamamos a la función recursivamente
      } else if (key === 'valor' && typeof obj[key] === 'number') {
        suma += obj[key]; // Si es un número bajo la clave 'valor', lo sumamos
      }
    }
    return suma;
  }

  sumarValoresDeUsuario() {
    const userData = this.getFromLocalStorage('user');
    if (userData) {
      return this.sumarValores(userData);
    } else {
      return 0; // Retorna 0 si no se encuentra userData o no hay valores numéricos
    }
  }
  
}
