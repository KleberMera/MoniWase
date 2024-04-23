import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
   
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  async submit() {
    console.log(this.form.value);
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      this.firebaseSvc
        .sendRecoveryEmail(this.form.value.email)
        .then((res) => {
          console.log(res);


         
        })
        .catch((error) => {
          console.log(error);

          this.utilSvc.presentToast({
            message: 'Correo o Contraseña Incorrecta',
            duration: 2500,
            color: 'tertiary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  
}
