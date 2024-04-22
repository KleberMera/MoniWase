import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

 
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  router = inject(Router);

  constructor() { }


  loading(){
    return this.loadingController.create({spinner: 'crescent'})
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  //Enruta a paginas disponibles
  routerLink(url : string){
    return this.router.navigateByUrl(url)

  }

  // Guardar datos de manea local
  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value))
  }


  //Obtiene el dato local
  /*getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key))
  }*/

  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key) || '{}')
  }

}
