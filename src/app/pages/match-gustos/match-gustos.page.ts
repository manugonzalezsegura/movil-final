import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getFirestore, doc, setDoc, arrayUnion } from 'firebase/firestore'; // Importación modular
import { Firestore } from '@angular/fire/firestore';

// Interfaces
interface RejectedUsers {
  uids: string[];
}

interface MatchingUser {
  uid: string; // Añadir uid aquí
  name: string;
  gustos: string[];
}

@Component({
  selector: 'app-match-gustos',
  templateUrl: './match-gustos.page.html',
  styleUrls: ['./match-gustos.page.scss'],
})
export class MatchGustosPage implements OnInit {

  matchingImage: string | null = null; // Imagen del usuario coincidente
  matchingUser: MatchingUser | null = null; // Cambiar el tipo a MatchingUser
  matchingCoordinates: { latitude: number; longitude: number } | null = null; // Coordenadas del usuario coincidente
  previousUserIds: string[] = []; // Almacena IDs de usuarios previamente mostrados
  unrejectedUsers: any[] = []; // Almacena usuarios no rechazados

  constructor(
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.presentLocationAlert();
    this.loadUnrejectedUsers(); // Cargar usuarios no rechazados al iniciar
  }

  async presentLocationAlert() {
    const alert = await this.alertController.create({
      header: 'Activar Ubicación',
      message: '¿Quieres buscar a tu bro? Ahora activa la ubicación.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Ubicación no activada');
          }
        },
        {
          text: 'Activar',
          handler: () => {
            console.log('Ubicación activada');
            this.activateLocation();
          }
        }
      ]
    });
    await alert.present();
  }

  private activateLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          console.log('Coordenadas obtenidas:', coordinates);
          this.saveCoordinatesToFirestore(coordinates);
          this.findMatchingPreferences(); // Llama a la función de coincidencias
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          this.handleLocationError(error);
        }
      );
    } else {
      console.error('La geolocalización no es soportada en este navegador.');
    }
  }

  private handleLocationError(error: GeolocationPositionError) {
    console.error('Error de geolocalización:', error);
  }

  private async alertUser(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private saveCoordinatesToFirestore(coordinates: { latitude: number; longitude: number }) {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        const db = getFirestore();
        setDoc(doc(db, 'users', user.uid), {
          location: coordinates
        }, { merge: true }).then(() => {
          console.log('Coordenadas guardadas en Firestore');
          this.findMatchingPreferences(); // Llama a la función de coincidencias después de guardar las coordenadas
        }).catch((error) => {
          console.error('Error guardando coordenadas en Firestore:', error);
        });
      }
    });
  }

  private async loadUnrejectedUsers() {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        const currentUserUid = user.uid;

        // Obtener usuarios rechazados
        this.firestore.collection('rejected').doc<RejectedUsers>(currentUserUid).get().subscribe((rejectedData) => {
          const rejectedUsers = rejectedData.data()?.uids || [];

          // Obtener usuarios no rechazados
          this.firestore.collection('users').get().subscribe((snapshot) => {
            this.unrejectedUsers = []; // Reiniciar la lista de usuarios no rechazados
            snapshot.forEach((doc) => {
              const otherUserUid = doc.id;

              // Asegúrate de no mostrar usuarios rechazados ni el usuario actual
              if (otherUserUid !== currentUserUid && !rejectedUsers.includes(otherUserUid)) {
                this.unrejectedUsers.push(doc.data());
              }
            });
            console.log('Usuarios no rechazados:', this.unrejectedUsers);
          });
        });
      }
    });
  }

  private findMatchingPreferences() {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        const currentUserUid = user.uid;

        // Obtener preferencias del usuario actual
        this.firestore.collection('users').doc(currentUserUid).get().subscribe((userData) => {
          const userPreferencesData = userData.data() as { gustos?: string };
          const currentUserPreferences = userPreferencesData.gustos
            ? userPreferencesData.gustos.split(',').map(g => g.trim())
            : [];

          // Obtener usuarios rechazados
          this.firestore.collection('rejected').doc<RejectedUsers>(currentUserUid).get().subscribe((rejectedData) => {
            const rejectedUsers = new Set(rejectedData.data()?.uids || []); // Usamos un Set para facilitar la búsqueda

            // Buscar coincidencias
            this.firestore.collection('users').get().subscribe((snapshot) => {
              let foundMatch = false;

              snapshot.forEach((doc) => {
                const otherUserUid = doc.id;

                // Asegúrate de no mostrar usuarios rechazados o el usuario actual
                if (otherUserUid !== currentUserUid &&
                  !this.previousUserIds.includes(otherUserUid) &&
                  !rejectedUsers.has(otherUserUid)) {

                  const otherUserData = doc.data() as {
                    gustos?: string;
                    image?: string;
                    name: string;
                    location?: { latitude: number; longitude: number };
                  };
                  const otherUserPreferences = otherUserData.gustos
                    ? otherUserData.gustos.split(',').map(g => g.trim())
                    : [];

                  // Verifica si hay alguna preferencia coincidente
                  const hasMatchingPreference = currentUserPreferences.some((gusto: string) =>
                    otherUserPreferences.includes(gusto)
                  );

                  // Si hay una coincidencia, establece los datos correspondientes
                  if (hasMatchingPreference) {
                    // Aquí puedes decidir cómo manejar múltiples coincidencias
                    this.matchingImage = otherUserData.image || null;
                    this.matchingUser = { uid: otherUserUid, name: otherUserData.name, gustos: otherUserPreferences }; // Asegúrate de incluir el uid

                    // Asignar coordenadas si están disponibles
                    if (otherUserData.location) {
                      this.matchingCoordinates = otherUserData.location;
                    } else {
                      console.warn('El usuario coincidente no tiene coordenadas de ubicación.');
                    }

                    console.log('Coincidencia encontrada:', this.matchingUser);
                    foundMatch = true;
                    return; // Termina el bucle cuando se encuentra una coincidencia
                  }
                }
              });

              if (!foundMatch) {
                console.log('No se encontró ningún usuario coincidente');
                this.matchingUser = null; // Resetear el usuario coincidente si no se encuentra
                this.matchingImage = null; // Resetear la imagen
              }
            });
          });
        });
      }
    });
  }

  async rejectMatch() {
    const user = await this.afAuth.currentUser; // Espera a que se resuelva la promesa
    const currentUserUid = user?.uid; // Asegúrate de que el usuario está autenticado
    
    // Verifica que currentUserUid no sea undefined
    if (!currentUserUid) {
      console.error('El UID del usuario no está disponible.');
      return; // Si no hay UID, salimos de la función
    }
  
    // Verifica que matchingUser no sea null y tiene el UID
    if (this.matchingUser) {
      const rejectedUserUid = this.matchingUser.uid; // Asegúrate de tener el UID del usuario coincidente
  
      // Añadir el UID del usuario rechazado a la colección de rechazados
      const db = getFirestore();
      
      // Verificamos que rejectedUserUid no sea undefined antes de pasarla a arrayUnion
      if (!rejectedUserUid) {
        console.error('UID del usuario rechazado no disponible.');
        return; // Si el UID del usuario rechazado no está disponible, salimos de la función
      }
  
      try {
        await setDoc(doc(db, 'rejected', currentUserUid), {
          uids: arrayUnion(rejectedUserUid)
        }, { merge: true });
  
        console.log(`Usuario ${rejectedUserUid} rechazado y añadido a la lista.`);
        this.matchingUser = null; // Reiniciar el usuario coincidente
        this.matchingImage = null; // Reiniciar la imagen coincidente
        this.previousUserIds.push(rejectedUserUid); // Añadir el UID a los previos para no mostrarlo nuevamente
  
        this.findMatchingPreferences(); // Buscar nuevas coincidencias después de rechazar al usuario
      } catch (error) {
        console.error('Error al actualizar la colección de rechazados:', error);
      }
    } else {
      console.error('No hay un usuario coincidente para rechazar.');
    }
  }

  public redirectToHomeWithCoordinates() {
    if (this.matchingCoordinates) {
      this.router.navigate(['/mapa'], {
        queryParams: { lat: this.matchingCoordinates.latitude, lng: this.matchingCoordinates.longitude }
      });
    } else {
      console.warn('No se pudieron obtener las coordenadas del usuario coincidente.');
    }
  }
  



}
