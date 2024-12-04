import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {


  //@Manu

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    
  }

  // Método para iniciar sesión
  async login(email: string, password: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      throw error; // Lanza el error para que pueda ser manejado en el componente
    }
  }

  // Método para registrarse
  async register(email: string, password: string, name: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    
    // Guarda el usuario en Firestore
    await this.firestore.collection('users').doc(userCredential.user?.uid).set({
      email: email,
      name: name,
    });

    return userCredential;
  }

  // Método para cerrar sesión recordar que devol actualizar funcion que guarda los datos de perfil 
  logout() {
    localStorage.removeItem('user');
    return this.afAuth.signOut();
  }

  // afAuth es privado y no puedo acceder a el fuera del servicio asique creo funcion para acceder a el get authState()

  get authState() {
    return this.afAuth.authState; // Devuelve el observable de authState
  }


  isAuthenticated(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtener el usuario
    return !!user.uid; // Verificar si existe el UID
  }

  // Obtener el UID del usuario desde localStorage
  getUserId(): string | null {
    return localStorage.getItem('uid');
  }


  
  async sendPasswordResetEmail(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }
  


}
