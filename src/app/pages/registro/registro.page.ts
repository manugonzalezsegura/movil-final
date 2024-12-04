import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { BdfireService } from 'src/app/services/bdfire.service';
import { AuthserviceService } from '../../services/authservice.service'; // Ajusta la ruta según la ubicación real del archivo
import { Router } from '@angular/router';
import { User } from "../../models/user.model";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  constructor(private alertController: AlertController,private bdfireService:BdfireService,private authService: AuthserviceService, private router: Router) { }

  
  name: string = ''; // Para almacenar el nombre
  email: string = ''; // Para almacenar el email
  password: string = ''; // Para almacenar la contraseña


  userLocation: User  = {
    uid:'', 
    nombre:'',
    
  }


  ngOnInit() {
  }


  async register() {
    try {
      // Validar que todos los campos estén completos
      if (!this.name || !this.email || !this.password) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Por favor completa todos los campos.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      // Llama al método register del AuthService
      const userCredential = await this.authService.register(this.email, this.password, this.name);

      // Verifica si userCredential.user no es null
      if (userCredential.user) {
        // Extrae el UID del usuario
        const uid = userCredential.user.uid;

        // Guarda el nombre y el UID en localStorage
        localStorage.setItem('name', this.name);
        localStorage.setItem('uid', uid);

        // Muestra mensaje de éxito y redirige
        const alert = await this.alertController.create({
          header: 'Registro Exitoso',
          message: 'Registro exitoso, redirigiendo a /match',
          buttons: ['OK']
        });
        await alert.present();

        // Redirige al usuario a la página de match
        this.router.navigate(['/match']);
      } else {
        // Si user es null, muestra un error
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un problema con el registro. Inténtalo de nuevo.',
          buttons: ['OK']
        });
        await alert.present();
      }

    } catch (error: unknown) {
      // Manejo de errores mejorado
      let errorMessage = 'Ocurrió un error inesperado.';
      
      if (error instanceof Error) {
        errorMessage = error.message; // Si el error es una instancia de Error, obtenemos el mensaje
      }

      const alert = await this.alertController.create({
        header: 'Error',
        message: `Error de registro: ${errorMessage}`,
        buttons: ['OK']
      });
      await alert.present();
      console.error('Error de registro: ', error);
    }
  }


}
