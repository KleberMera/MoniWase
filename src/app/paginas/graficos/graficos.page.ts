import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { doc, getDoc } from "firebase/firestore";



@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {
  nombreUsuario: string;

  firebaseSvc = inject(FirebaseService);
  utilisSvc = inject(UtilsService);
  alertCtrl = inject(AlertController);


  ionViewWillEnter() {
    // Obtener el nombre de usuario del localStorage
    const userData = this.utilisSvc.getFromLocalStorage('user');
    if (userData && userData.name) {
      this.nombreUsuario = userData.name;
    }
  }
  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.ionViewWillEnter();
    this.getDatos();
  }

  async getDatos() {
    try {
      if (!this.nombreUsuario) {
        console.error("El nombre de usuario es undefined.");
        
      }
  
      const querySnapshot = await this.firestore.collection("users", ref => ref.where('name', '==', this.nombreUsuario)).get().toPromise();
      
      const datosArray = []; // Inicializar un array para almacenar los datos relevantes
      
      querySnapshot.forEach(doc => {
        const data = doc.data(); // Obtener los datos del documento
        if (data) {
          // Iterar sobre las claves del objeto y extraer los datos necesarios
          Object.keys(data).forEach(key => {
            if (key !== 'name' && key !== 'email' && key !== 'uid') {
              const descripcion = key;
              const valor = data[key].valor;
              const fecha = data[key].fecha.toDate(); // Convertir la fecha a formato Date
              
              // Formatear la fecha como "d de MMMM de yyyy"
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
              
              // Construir el objeto con la estructura deseada
              const objetoTransformado = {
                descripcion: descripcion,
                valor: valor,
                fecha: fechaFormateada
              };
              
              datosArray.push(objetoTransformado); // Agregar el objeto transformado al array
            }
          });
        }
      });
      
      console.log("Datos transformados:", datosArray);
      return datosArray; // Devolver el array de datos transformados
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      throw error; // Propagar el error para manejarlo en el lugar donde se llama a esta función
    }
  }
  
  
}
