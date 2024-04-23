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

          this.utilSvc.presentToast({
            message: 'Correo Enviado con Éxito',
            duration: 1500,
            color: 'tertiary',
            position: 'middle',
            icon: 'mail-outline',
          });

          this.utilSvc.routerLink('/login');
          this.form.reset();
        })
        .catch((error) => {
          console.log(error);

          this.utilSvc.presentToast({
            message: 'El Correo Ingresado no Existe',
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
