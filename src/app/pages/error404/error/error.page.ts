import { Component, OnInit } from '@angular/core';
import {AuthserviceService  } from "../../../services/authservice.service";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage implements OnInit {


  email: string = '';
  errorMessage: string = '';

  constructor(private alertCtrl: AlertController,private authService:AuthserviceService) { }

  ngOnInit() {
  }


async recoverPassword() {
  if (!this.email.trim()) {
    this.errorMessage = 'Por favor, introduce un correo electrónico válido.';
    return;
  }

  try {
    await this.authService.sendPasswordResetEmail(this.email);
    const alert = await this.alertCtrl.create({
      header: 'Éxito',
      message: 'Si el correo electrónico está registrado, recibirás instrucciones para restablecer tu contraseña.',
      buttons: ['OK']
    });
    await alert.present();
  } catch (error: unknown) {
    if (error instanceof Error) {
      this.errorMessage = error.message || 'Ocurrió un error al intentar restablecer la contraseña. Por favor, inténtalo de nuevo.';
    } else {
      this.errorMessage = 'Ocurrió un error desconocido.';
    }
  }
  
}

}
