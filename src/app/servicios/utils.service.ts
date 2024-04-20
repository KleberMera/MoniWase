import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

 
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);


  loading(){
    return this.loadingController.create({spinner: 'crescent'})
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }
}
