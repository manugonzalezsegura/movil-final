import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc,getFirestore,getDoc } from '@angular/fire/firestore';
import { User } from "../models/user.model";




@Injectable({
  providedIn: 'root'
})
export class BdcloudService {

  constructor(private firestore: Firestore) { }



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
