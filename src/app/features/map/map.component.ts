import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, GoogleMapsModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  currentDate = new Date().toLocaleDateString('es-CO', { month: 'long', day: 'numeric' });

  locationName = 'Cargando sector...';
  center: google.maps.LatLngLiteral = { lat: 4.6097, lng: -74.0817 };
  zoom = 10;

  searchQuery: string = '';
  allMarkers: any[] = [];
  markers: any[] = [];

  functionalCount = 0;
  criticalCount = 0;
  plannedCount = 0;

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'satellite',
    zoomControl: false,
    rotateControl: true,
    rotateControlOptions: { position: 7 },
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMapData();
  }

  refresh() {
    this.loadMapData();
  }

  loadMapData() {
    const userEmail = localStorage.getItem('userEmail');
    const savedLocation = localStorage.getItem('userLocation'); // Ej. 'guerrero'
    if (!userEmail) {
      console.warn('No hay email guardado. Cargando mapa por defecto o desde LocalStorage.');
      this.loadLocationFromJSON({ assignedLocationId: savedLocation });
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/dashboard/${userEmail}`).subscribe({
      next: (userData) => {
        if (userData.assignedLocationId) {
          localStorage.setItem('userLocation', userData.assignedLocationId);
        }
        this.loadLocationFromJSON(userData);
      },
      error: (err) => {
        console.warn('Usuario nuevo detectado. Cargando el mapa desde el LocalStorage:', savedLocation);
        this.loadLocationFromJSON({ assignedLocationId: savedLocation });
      }
    });
  }

  loadLocationFromJSON(userData: any) {
    const assignedLocationId = userData.assignedLocationId || userData.locationId || localStorage.getItem('userLocation') || 'chingaza';

    this.http.get<any[]>('/assets/data/locations.json').subscribe({
      next: (allLocations) => {
        const myLocation = allLocations.find(loc =>
          loc.locationId === assignedLocationId ||
          (userData.locationName && loc.locationName === userData.locationName)
        ) || allLocations[0];

        this.locationName = myLocation.locationName;
        this.center = myLocation.mapCenter;
        this.zoom = myLocation.mapZoom;

        if (myLocation.sensors && myLocation.sensors.length > 0) {
          this.processDynamicMarkers(myLocation.sensors, userData.readings);
        } else {
          this.markers = [];
          this.allMarkers = [];
          this.calculateStats();
        }
      },
      error: (err) => {
        console.error('ERROR FATAL: No se encontró el archivo src/assets/data/locations.json', err);
        this.locationName = 'Error cargando mapa base';
      }
    });
  }

  processDynamicMarkers(staticSensors: any[], liveReadings?: any[]) {
    const iconGreen = { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' };
    const iconRed = { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' };
    const iconYellow = { url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png' };

    this.allMarkers = [];

    this.allMarkers = staticSensors.map((sensor: any) => {
      const liveData = liveReadings ? liveReadings.find((r: any) => r.sensorId === sensor.sensorId) : null;

      const finalStatusClass = liveData ? liveData.statusClass : sensor.statusClass;
      const finalStatus = liveData ? liveData.status : sensor.status;

      let markerIcon = iconGreen;
      let statusText = 'Funcional';

      if (finalStatusClass === 'critical' || finalStatus === 'Crítico') {
        markerIcon = iconRed;
        statusText = 'CRÍTICO';
      } else if (finalStatusClass === 'planned' || finalStatus === 'Planificado') {
        markerIcon = iconYellow;
        statusText = 'Planificado';
      }

      return {
        position: { lat: sensor.lat, lng: sensor.lng },
        title: `${sensor.sensorId} - ${statusText}`,
        icon: markerIcon
      };
    });

    this.markers = [...this.allMarkers];
    this.calculateStats();
  }

  calculateStats() {
    this.functionalCount = 0;
    this.criticalCount = 0;
    this.plannedCount = 0;

    this.allMarkers.forEach(marker => {
      if (marker.title.includes('CRÍTICO')) {
        this.criticalCount++;
      } else if (marker.title.includes('Planificado')) {
        this.plannedCount++;
      } else {
        this.functionalCount++;
      }
    });
  }

  filterMarkers() {
    if (!this.searchQuery) {
      this.markers = [...this.allMarkers];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.markers = this.allMarkers.filter(m =>
        m.title.toLowerCase().includes(query)
      );

      if (this.markers.length === 1) {
        this.center = this.markers[0].position;
        this.zoom = 18;
      }
    }
  }
}
