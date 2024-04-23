import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LogoComponent } from './logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input/input.component';
import { TabsComponent } from './tabs/tabs.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent, LogoComponent, InputComponent, TabsComponent],
  exports: [
    HeaderComponent,
    LogoComponent,
    InputComponent,
    TabsComponent,

    ReactiveFormsModule,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
})
export class ComponentesModule {}
