import { Injectable } from '@angular/core';
import { ref, set, get, update, remove, getDatabase } from 'firebase/database';//nueva forma de usar firebase
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Firestore, doc, updateDoc,getFirestore,getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from "../models/user.model";









const app = initializeApp(environment.firebaseConfig); // Inicializa Firebase
const database = getDatabase(app);

//@Manu

@Injectable({
  providedIn: 'root'
})
export class BdfireService {

  constructor(private storage: AngularFireStorage,private firestore: Firestore,private db:AngularFirestore) { }



// unificar este servicio  con subir immagen  y separar responsabilidades bien definidas para mentener orden 

async addUserLocation(userLocation: User, uid: string) {
  // Guardar el uid, radioAlcance, ubicación, nombre y imageUrl en la base de datos
  await set(ref(database, 'users/' + uid), {
    uid: userLocation.uid,
    nombre: userLocation.nombre, // Agregando el nombre
    radioAlcance: userLocation.radioAlcance,
    ubicacion: userLocation.ubicacion,
    imageUrl: userLocation.imageUrls || '', // Agregando la URL de la imagen
  });
}

  //User mi modelo unificado ahora 
  async updateUserLocation(userLocation: Partial<User>, uid: string) {
    const userRef = ref(database, 'users/' + uid);
    
    // Solo los campos que estén presentes en el objeto userLocation serán actualizados
    await update(userRef, userLocation);  // Firebase actualizará solo los campos proporcionados
  }


  async getUser(uid: string) { 
    const userRef = ref(database, 'users/' + uid);
    const snapshot = await get(userRef);
    return snapshot.val();
  }

  async getUsers() { 
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    return snapshot.val();
  }


  async updateUserImageUrl(uid: string, imageUrl: string): Promise<void> {
    const userRef = ref(database, 'users/' + uid);
    console.log(`Actualizando URL de imagen para ${uid}:`, imageUrl); 
    await update(userRef, { imageUrl }); // Actualiza solo el campo de la imagen
  }

  async deleteUser(uid: string) {
    const userRef = ref(database, 'users/' + uid);
    await remove(userRef);
  }


  async subirImagen(file: File, uid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `images/${uid}/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            try {
              const url = await fileRef.getDownloadURL().toPromise();
              await this.updateUserLocation({ imageUrls: url }, uid); // Actualiza solo la URL de la imagen
              resolve(url);
            } catch (error) {
              reject(error);
            }
          })
        )
        .subscribe();
    });
  }



  //lo de la mochila 


  async updateUser(uid: string, data: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userDocRef, data); // Actualiza solo los campos proporcionados en `data`
  }


  async getUserData(userId: string): Promise<User | null> {
    try {
      const userDocRef = doc(this.firestore, 'users', userId); // Referencia al documento
      const userDoc = await getDoc(userDocRef); // Obtener el documento de manera asincrónica
  
      if (userDoc.exists()) {
        return userDoc.data() as User; // Si existe, devolver los datos del usuario
      } else {
        console.error('No se encontró el usuario');
        return null; // Si no existe el usuario, devolver null
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return null; // Manejo de errores
    }
  }


  async updateCloudUser(uid: string, data: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`); // Referencia al documento del usuario en Firestore
    await updateDoc(userDocRef, data); // Actualiza los campos proporcionados en 'data' en Firestore
  }
  

  

}
