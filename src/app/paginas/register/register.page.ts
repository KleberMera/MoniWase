import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage   {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);



  async submit() {
    console.log(this.form.value);
    if (this.form.valid) {

      const loading = await this.utilSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async (res) => {
        console.log(res); 
        await this.firebaseSvc.updateUser(this.form.value.name)

      }).catch(error =>{
        console.log(error);

        this.utilSvc.presentToast({
          message: "Correo o Contraseña Incorrecta",
          duration: 2500,
          color: "tertiary",
          position:"middle",
          icon: 'alert-circle-outline'
        });

      }).finally(()=>{
        loading.dismiss();

        
      })
    }
  }

}
