import { Component } from '@angular/core';
import {NavController,MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  

  showLogin = false; 
  constructor(private navCtrl: NavController,private menuCtrl: MenuController) { }

  ngOnInit() {}
  toggleLogin() {
    // çocultar el login
    this.showLogin = !this.showLogin;
  }

  closeLogin() {
    this.showLogin = false;
  }

  goToProfile() {
    this.navCtrl.navigateForward('/perfil');
  }

  goToMapa() {
    this.navCtrl.navigateForward('/mapa');
  }

  goToMatch() {
    this.navCtrl.navigateForward('/error');
  }

  goToMatchOtazo() {
    this.navCtrl.navigateForward('/match-gustos');
  }

  goToMatchHomeReal() {
    this.navCtrl.navigateForward('/home-real');
  }
  openMoreMenu() {
    this.menuCtrl.open('more-menu'); // Abre el menú con el id "more-menu"
  }







}
