import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage implements OnInit {
  mostrarCampos: boolean = false;
  nombreGasto: string = '';
  valor: string = '';
  mes: string = '';
  ano: string = '';
  botones = [
    { icon: 'gift-outline', nombreGasto: 'Regalos' },
    { icon: 'fitness-outline', nombreGasto: 'Gastos de Salud' },
    { icon: 'airplane-outline', nombreGasto: 'Viaje' },
    { icon: 'cart-outline', nombreGasto: 'Compras' },
    { icon: 'card-outline', nombreGasto: 'Tarjeta de Crédito' },
    { icon: 'help-circle-outline', nombreGasto: 'Otros' },
    { icon: 'game-controller-outline', nombreGasto: 'Juegos' },
    { icon: 'shirt-outline', nombreGasto: 'Ropa y accesorios' },
    { icon: 'logo-amazon', nombreGasto: 'Compra en Línea' },
    { icon: 'bus-outline', nombreGasto: 'Transporte' },
    { icon: 'water-outline', nombreGasto: 'Servicios básicos' },
    { icon: 'construct-outline', nombreGasto: 'Reparación / Mantenimiento' }
  ];



  constructor(private toastController: ToastController) { }

  ngOnInit() {
  }

  mostrarCamposSeleccionados(boton: any) {
    this.valor = '';
    this.mes = '';
    this.ano = '';
    this.mostrarCampos = true;
    // Establece el nombre del gasto en el campo de entrada
    this.nombreGasto = boton ? boton.nombreGasto : '';
  }

  grabarInformacion() {
    if (!this.nombreGasto || !this.valor || !this.mes || !this.ano) {
      this.mostrarMensajeCampoIncompleto();
      return; // Salir del método si algún campo está incompleto
    }else{
      console.log('Gasto:', this.nombreGasto);
      console.log('Valor:', this.valor);
      console.log('Mes:', this.mes);
      console.log('Año:', this.ano);
  
      this.nombreGasto = '';
      this.valor = null;
      this.mes = '';
      this.ano = null;
      this.mostrarCampos = false;
      this.mostrarMensajeExito();
    } 
  }
  async mostrarMensajeExito() {
    const toast = await this.toastController.create({
      message: 'Gastos grabados exitosamente',
      duration: 2000,
      position: 'top',
      color: "medium"
    });
    toast.present();
  }
  async mostrarMensajeCampoIncompleto() {
    const toast = await this.toastController.create({
      message: 'Por favor complete todos los campos',
      duration: 2000,
      position: 'top',
      color: "medium"
    });
    toast.present();
  }
    
}
