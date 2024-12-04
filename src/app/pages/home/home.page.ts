import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userName: string = ''; 
  zoomed: boolean = false;
  userImage: string | null = null;
  isAuthenticated: boolean = false; // Añadir esta propiedad para el estado de autenticación


  constructor(
    private alertController: AlertController,
    private router: Router,
  
  ) {}



  private resetUserData() {
    this.userName = 'Usuario';
    this.userImage = null; // Restablece `userImage` para prevenir imágenes incorrectas
  }

  async showWelcomeAlert() {
    const alert = await this.alertController.create({
      header: 'Bienvenido',
      message: `¡Hola, ${this.userName}! Estamos contentos de verte en la aplicación.`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  zoomImage() {
    const cardImage = document.querySelector('.card-image') as HTMLElement;
    if (this.zoomed) {
      cardImage.classList.remove('zoom'); 
    } else {
      cardImage.classList.add('zoom'); 
    }
    this.zoomed = !this.zoomed; 
  }



  




}
