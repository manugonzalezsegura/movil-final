import { Component, OnInit } from '@angular/core';
import {NavController,MenuController } from '@ionic/angular';



@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss'],
})
export class ButtonBarComponent  implements OnInit {
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

  goToHome() {
    this.navCtrl.navigateForward('/home');
  }

  goToMatch() {
    this.navCtrl.navigateForward('/match');
  }

  goToMatchOtazo() {
    this.navCtrl.navigateForward('/match-gustos');
  }

  goToMatchHomeReal() {
    this.navCtrl.navigateForward('/home');
  }
  openMoreMenu() {
    this.menuCtrl.open('more-menu'); // Abre el menú con el id "more-menu"
  }

}
