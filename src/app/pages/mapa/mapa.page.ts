import { Component, OnInit ,ElementRef,ViewChild,Renderer2,OnDestroy} from '@angular/core';
import {GmapsService} from '../../services/gmaps.service'
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit,OnDestroy {
 
 //@Manu
 
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;
  googleMaps: any;
  map: any;
  watchId: any;
  constructor(
    private gmaps: GmapsService,
    private renderer: Renderer2,
    
  
  ) { }
  
  ngOnInit() {

    this.loadMap();

  }
  ngOnDestroy(): void {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }
    


  initializeMap(mapEl: HTMLElement, position: GeolocationPosition) {
    const location = new this.googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map = new this.googleMaps.Map(mapEl, {
      center: location,
      zoom: 12,
    });
    this.renderer.addClass(mapEl, 'visible');
  }



  

  async loadMap() {
    try {
      // Cargar la API de Google Maps
      this.googleMaps = await this.gmaps.loadGoogleMaps();
      const mapEl = this.mapElementRef.nativeElement;

      // Coordenadas de ejemplo (centro del mapa en Ciudad de México)
      const userLocation = await this.getUserLocation();

      const userLatLng = new this.googleMaps.LatLng(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
      // Inicializar el mapa
      this.map = new this.googleMaps.Map(mapEl, {
        center: userLatLng,
        zoom: 12,
      });


      new this.googleMaps.Marker({
        position: userLatLng,
        map: this.map,
        title: '¡Estás aquí!',
      });



    } catch (e) {
      console.error('Error al cargar el mapa:', e);
    }
  }


  async getUserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject('Geolocalización no soportada');
      }
    });
  }



}
