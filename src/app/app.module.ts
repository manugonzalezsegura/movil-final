import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from "../environments/environment";
import { AngularFireModule } from '@angular/fire/compat'; // Importa el módulo de compatibilidad
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Módulo de autenticación
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Módulo de Firestore
import { SharedModule } from "./shared/shared.module";

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    AngularFireAuthModule, 
    AngularFirestoreModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    SharedModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
