import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Necesitamos ActivatedRoute para acceder a los parámetros de la URL
import { GmapsService } from '../../services/gmaps.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, OnDestroy {
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;
  googleMaps: any;
  map: any;
  watchId: any;

  constructor(
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private route: ActivatedRoute // Importamos ActivatedRoute
  ) {}

  ngOnInit() {
    // Al iniciar, cargamos el mapa
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

      // Obtener las coordenadas desde los parámetros de la URL
      this.route.queryParams.subscribe(params => {
        const lat = parseFloat(params['lat']);
        const lng = parseFloat(params['lng']);

        if (lat && lng) {
          // Coordenadas del usuario coincidente
          const matchLocation = new this.googleMaps.LatLng(lat, lng);

          // Inicializar el mapa centrado en las coordenadas del "match"
          this.map = new this.googleMaps.Map(mapEl, {
            center: matchLocation,
            zoom: 12,
          });

          // Crear un marcador en las coordenadas del "match"
          new this.googleMaps.Marker({
            position: matchLocation,
            map: this.map,
            title: '¡Match encontrado!',
          });
        } else {
          console.warn('Coordenadas no válidas');
        }
      });

      // Puedes agregar un marcador en la ubicación del usuario, como antes, si lo deseas
      const userLocation = await this.getUserLocation();
      const userLatLng = new this.googleMaps.LatLng(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );

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
