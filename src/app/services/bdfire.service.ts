// src/app/services/bdfire.service.ts

import { Injectable } from '@angular/core';
import { ref, set, get, update, remove, getDatabase } from 'firebase/database'; // nueva forma de usar firebase
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { User } from "../models/user.model";

const app = initializeApp(environment.firebaseConfig); // Inicializa Firebase
const database = getDatabase(app);

@Injectable({
  providedIn: 'root'
})
export class BdfireService {

  constructor() { }

  // Método para guardar la información del usuario, incluyendo la contraseña
  async addUserLocation(userLocation: User, uid: string) {
    await set(ref(database, 'users/' + uid), {
      uid: userLocation.uid,
      nombre: userLocation.nombre,
      radioAlcance: userLocation.radioAlcance,
      ubicacion: userLocation.ubicacion || null,
      imageUrls: userLocation.imageUrls || '',
      password: userLocation.password || '', // Guardar la contraseña
    });
  }

  async updateUserLocation(userLocation: Partial<User>, uid: string) {
    const userRef = ref(database, 'users/' + uid);
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
    await update(userRef, { imageUrl });
  }

  async deleteUser(uid: string) {
    const userRef = ref(database, 'users/' + uid);
    await remove(userRef);
  }
}
