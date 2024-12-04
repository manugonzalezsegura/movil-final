import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoserviceService {

  //@Manu

  constructor() { }

  async getUserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject('Geolocalización no soportada');
      }
    });
  }


  trackUserLocation(uid:string) {
    //const radioAlcance=2000;//podria convertir esto en un servicio y hacerlo configurable 
    if (navigator.geolocation) {
     //deberia usar getPosition en vez de watch para evitar llamadas insesarias  ?
      navigator.geolocation.watchPosition(async(position) => {
        
        
        const userLocation={
          lat: position.coords.latitude,
          lng: position.coords.longitude

        };

       
        console.log('Posición del usuario:', position.coords.latitude, position.coords.longitude); 

       
         try {

          //traer base de datos para actualizar la poscicion del usuario 
          //await this.bdfireService.updateUserLocation({ ubicacion: userLocation}, uid);
          console.log('Ubicación del usuario actualizada en Firebase');
        } catch (error) {
          console.error('Error actualizando la ubicación del usuario en Firebase:', error);
        }

      }, (error) => {
        console.error("Error obteniendo la ubicación del usuario: ", error);
      }, {
        enableHighAccuracy: true, 
        timeout: 10000, // Tiempo para obtener la ubicación
        maximumAge: 0 
      });
    } else {
      console.error("Geolocation no es soportado por este navegador.");
    }

  }



}
