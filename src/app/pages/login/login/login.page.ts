import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {GeoserviceService}from '../../../services/geoservice.service';
import {AuthserviceService  } from "../../../services/authservice.service";
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  email: string = '';
  password: string = '';
  errorMessage: string = '';
  

  //@Otazo
  constructor(private authService:AuthserviceService,private router: Router,private geoservice:GeoserviceService,private alertCtrl: AlertController) { }

  ngOnInit() {
  }


  async login() {
    try {
      // Intenta iniciar sesión con el email y la contraseña proporcionados
      const userCredential = await this.authService.login(this.email, this.password);
      const user = userCredential.user;

      if (!user) {
        throw new Error('No se pudo obtener el usuario después del inicio de sesión.');
      }

      const uid = user.uid;

      // Almacenar el UID en localStorage
      localStorage.setItem('uid', uid);

      // Iniciar el rastreo de ubicación
      //await this.geoservice.startLocationTracking(uid);
      console.log('Sesión iniciada correctamente');

      // Redirigir al usuario al home
      this.router.navigate(['/home']);
    } catch (error: any) {
      // Manejo de errores
      this.errorMessage = error.message || 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.';
    }
  }

  navigateToRegister() {
    this.router.navigate(['/registro']);
  }


  


  
}






