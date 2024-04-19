import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LogoComponent } from './logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input/input.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    InputComponent

  ],
  exports: [
    HeaderComponent,
    LogoComponent,
    InputComponent

  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule

    
  ]
})
export class ComponentesModule { }
