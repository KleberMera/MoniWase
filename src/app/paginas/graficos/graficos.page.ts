import { Component, OnInit, inject } from '@angular/core';
import Chart from 'chart.js/auto';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {

  tabs = [
    { icon: 'list-sharp', name: 'Lista',  routerLink: '/listas' },
    { icon: 'card-outline', name: 'Gastos', routerLink: '/gastos' },
    { icon: 'home-outline', name: 'Home', routerLink: '/sesion' },
    { icon: 'analytics-outline', name: 'Grafics',  routerLink: '/graficos' },
    { icon: 'exit-outline', name: 'Salir', clickHandler: () => this.confirmarSalir() },
  ];

  firebaseSvc = inject(FirebaseService);
  utilisSvc = inject(UtilsService);
  alertCtrl = inject(AlertController)


  categorias: any[] = [];
  fechas: any[] = [];
  chartCategorias: Chart;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.getUserData(user.uid);
      } else {
        console.log('No hay usuario conectado');
      }
    });
  }

  getUserData(uid: string) {
    this.firestore.collection('users').doc(uid).valueChanges().subscribe(data => {
      if (data) {
        this.processUserData(data);
        this.generateCharts();
      } else {
        console.log('No se encontraron datos del usuario');
      }
    });
  }

  processUserData(userData: any) {
    const categoriasMap = new Map<string, number>();
    const fechasMap = new Map<string, number>();
  
    for (const key in userData) {
      if (Object.prototype.hasOwnProperty.call(userData, key) && key !== 'uid' && key !== 'email' && key !== 'name') {
        const nombreCategoria = key.replace(/\d+$/, ''); // Eliminar números al final del nombre de la categoría
        const fecha = new Date(userData[key].fecha.seconds * 1000);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
        const valor = userData[key].valor;

        // Sumar el valor al total de la categoría
        if (categoriasMap.has(nombreCategoria)) {
          const total = categoriasMap.get(nombreCategoria);
          categoriasMap.set(nombreCategoria, total + valor);
        } else {
          categoriasMap.set(nombreCategoria, valor);
        }

        // Contar el valor por fecha
        if (fechasMap.has(fechaFormateada)) {
          const total = fechasMap.get(fechaFormateada);
          fechasMap.set(fechaFormateada, total + valor);
        } else {
          fechasMap.set(fechaFormateada, valor);
        }
      }
    }
  
    // Convertir el mapa de categorías a un arreglo para usarlo en el HTML
    this.categorias = Array.from(categoriasMap.entries()).map(([nombre, total]) => ({ nombre, total }));
    console.log('Categorías con gastos totales:', this.categorias);

    // Convertir el mapa de fechas a un arreglo para usarlo en el HTML
    this.fechas = Array.from(fechasMap.entries()).map(([fecha, total]) => ({ fecha, total }));
    console.log('Fechas con gastos totales:', this.fechas);
  }

  generateCharts() {
    // Generar gráfico de gastos por categoría
    const labelsCategorias = this.categorias.map(categoria => categoria.nombre);
    const valoresCategorias = this.categorias.map(categoria => categoria.total);

    const ctxCategorias = document.getElementById('chartCategorias') as HTMLCanvasElement;
    if (this.chartCategorias) {
      this.chartCategorias.destroy(); // Destruir el gráfico existente si hay uno
    }
    this.chartCategorias = new Chart(ctxCategorias, {
      type: 'bar',
      data: {
        labels: labelsCategorias,
        datasets: [{
          label: 'Gastos por categoría',
          data: valoresCategorias,
          backgroundColor: this.getRandomColors(valoresCategorias.length),
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total de gastos'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Categoría'
            }
          }
        }
      }
    });

    // Generar gráfico de gastos por fecha
    const labelsFechas = this.fechas.map(fecha => fecha.fecha);
    const valoresFechas = this.fechas.map(fecha => fecha.total);

    const ctxFechas = document.getElementById('chartFechas') as HTMLCanvasElement;
    const chartFechas = new Chart(ctxFechas, {
      type: 'bar',
      data: {
        labels: labelsFechas,
        datasets: [{
          label: 'Gastos por fecha',
          data: valoresFechas,
          backgroundColor: this.getRandomColors(valoresFechas.length),
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total de gastos'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Fecha'
            }
          }
        }
      }
    });
  }

  selectCategory(event: any) {
    const selectedCategory = event.detail.value;
    if (selectedCategory === 'todos') {
      // Si se selecciona "Todos", generamos los gráficos con todas las categorías
      this.generateCharts();
    } else {
      // Si se selecciona una categoría específica, generamos el gráfico solo para esa categoría
      const selectedCategoryData = this.categorias.find(categoria => categoria.nombre === selectedCategory);
      if (selectedCategoryData) {
        const ctxCategorias = document.getElementById('chartCategorias') as HTMLCanvasElement;
        if (this.chartCategorias) {
          this.chartCategorias.destroy(); // Destruir el gráfico existente si hay uno
        }

        // Generar el nuevo gráfico solo para la categoría seleccionada
        const labels = [selectedCategoryData.nombre];
        const valores = [selectedCategoryData.total];

        this.chartCategorias = new Chart(ctxCategorias, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Gastos por categoría',
              data: valores,
              backgroundColor: this.getRandomColors(valores.length),
            }],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Total de gastos'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Categoría'
                }
              }
            }
          }
        });
      }
    }
  }

  // Función para obtener colores aleatorios
  getRandomColors(numColors: number) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    return colors;
  }

  async confirmarSalir() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'tertiary',
          handler: () => {
            console.log('Cancelar');
          },
        },
        {
          text: 'Salir',
          handler: () => {
            this.signOut(); // Llama al método signOut si el usuario confirma salir
          },
        },
      ],
    });

    await alert.present();
  }

  signOut() {
    this.firebaseSvc.signOut();
  }
}