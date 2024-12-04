import { Component, OnInit } from '@angular/core';
import { User } from "../../../models/user.model";
import { BdfireService } from "../../../services/bdfire.service";
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {


  //@Otazo


  userImage: string | null = null;
  imageUrl: string = '';
  userName: string = '';
  userEmail: string = '';
  userGustos: string = '';
  userLocation: string = '';
  showAccordion: boolean = false;
  newGusto: string = '';
 
  private userSubscription: Subscription | null = null;

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    // Cargar datos del usuario si está autenticado
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this.resetUserData();
      }
    });
  }

  private loadUserData(userId: string) {
    this.userSubscription = this.firestore.collection('users').doc(userId).valueChanges().subscribe((userData: any) => {
      console.log('Datos del usuario:', userData); // Para depuración
  
      if (userData) {
        this.userName = userData.name || 'Usuario';
        this.userEmail = userData.email || 'Correo no disponible';
        this.userImage = userData.image || null;
        this.userGustos = userData.gustos || '';
        
        // Manejo de ubicación
        const latitude = userData.location?.latitude || null;
        const longitude = userData.location?.longitude || null;
  
        if (latitude !== null && longitude !== null) {
          this.userLocation = `Latitud: ${latitude}, Longitud: ${longitude}`;
        } else {
          this.userLocation = ''; // Mantén vacío si no hay coordenadas
        }
      }
    }, error => {
      console.error('Error al cargar los datos del usuario:', error);
    });
  }
  

  private resetUserData() {
    // Restablecer todos los campos de datos
    this.userName = '';
    this.userEmail = '';
    this.userImage = null;
    this.userGustos = 'No especificado'; // Inicializa con un valor
    this.userLocation = '';
    this.imageUrl = '';
  }

  setImageUrl() {
    if (this.imageUrl) {
      this.afAuth.currentUser.then(user => {
        if (user) {
          const userId = user.uid;
          // Guardar la URL de la imagen en Firestore
          this.firestore.collection('users').doc(userId).update({ image: this.imageUrl }).then(() => {
            this.userImage = this.imageUrl; // Actualiza la imagen mostrada
            this.imageUrl = ''; // Limpiar el campo de entrada de URL
          }).catch(error => {
            console.error('Error al guardar la imagen en Firestore:', error);
          });
        }
      });
    }
  }



  uploadImage() {
    console.log("Imagen de perfil seleccionada");
    // Aquí podrías agregar la lógica para seleccionar una imagen del dispositivo
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  addGusto() {
    if (this.newGusto.trim()) {
      if (this.userGustos === 'No especificado') {
        this.userGustos = this.newGusto;
      } else {
        this.userGustos += ', ' + this.newGusto;
      }
      this.afAuth.currentUser.then(user => {
        if (user) {
          const userId = user.uid;
          this.firestore.collection('users').doc(userId).update({ gustos: this.userGustos });
        }
      });
      this.newGusto = ''; // Limpiar campo de nuevo gusto
    }
  }

  logout() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('name');
      this.resetUserData();
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  




}
