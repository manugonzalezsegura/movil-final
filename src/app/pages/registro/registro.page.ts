// src/app/pages/registro/registro.page.ts

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BdfireService } from '../../services/bdfire.service';
import { AuthserviceService } from '../../services/authservice.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  name: string = ''; // Nombre del usuario
  email: string = ''; // Email del usuario
  password: string = ''; // Contraseña del usuario

  constructor(
    private alertController: AlertController,
    private bdfireService: BdfireService,
    private authService: AuthserviceService,
    private router: Router
  ) {}

  ngOnInit() {}

  async register() {
    if (!this.name || !this.email || !this.password) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    try {
      // Registra al usuario utilizando el servicio de autenticación
      const userCredential = await this.authService.register(this.email, this.password, this.name);
      const uid = userCredential.user?.uid;
  
      if (uid) {
        // Crea un objeto User con la información del usuario, incluida la contraseña
        const newUser: User = {
          uid,
          nombre: this.name,
          radioAlcance: 2000, // Valor predeterminado
          password: this.password, // Incluir la contraseña en el objeto
        };
  
        // Guarda los datos del usuario en Firebase
        await this.bdfireService.addUserLocation(newUser, uid);
  
        // Muestra mensaje de éxito
        const alert = await this.alertController.create({
          header: 'Registro Exitoso',
          message: 'Te has registrado correctamente.',
          buttons: ['OK'],
        });
        await alert.present();
  
        // Redirige al usuario a la página deseada
        this.router.navigate(['/home']);
      }
    } catch (error: unknown) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      const alert = await this.alertController.create({
        header: 'Error',
        message: `Error al registrar: ${errorMessage}`,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
