import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  async submit() {
    console.log(this.form.value);
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signIn(this.form.value as User)
        .then((res) => {
          console.log(res);

          this.getUserInfo(res.user.uid);
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

  async getUserInfo(uid: string) {
    console.log(this.form.value);
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc
        .getDocument(path)
        .then((user: User) => {
          this.utilSvc.saveInLocalStorage('user', user);

          this.utilSvc.routerLink('/sesion');
          this.form.reset();

          this.utilSvc.presentToast({
            message: `Te damos la Bienvenida ${user.name}`,
            duration: 1500,
            color: 'tertiary',
            position: 'top',
            icon: 'person-circle-outline',
          });
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
