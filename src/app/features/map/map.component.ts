import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  currentDate = new Date().toLocaleDateString('es-CO', { month: 'long', day: 'numeric' });

  center: google.maps.LatLngLiteral = { lat: 4.6500, lng: -73.7500 };
  zoom = 13;
  markers: any[] = [];

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'terrain',
    zoomControl: false,
    rotateControl: true,
    rotateControlOptions: {
      position: 3
    },
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true
  };

  ngOnInit() {
    this.initSimulatedMarkers();
  }

  refresh() {
    this.initSimulatedMarkers();
  }

  initSimulatedMarkers() {
    const iconGreen = { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' };
    const iconRed = { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' };
    const iconYellow = { url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png' };

    this.markers = [
      { position: { lat: 4.6550, lng: -73.7450 }, title: 'CH-101 - Funcional', icon: iconGreen },
      { position: { lat: 4.6600, lng: -73.7500 }, title: 'CH-102 - Funcional', icon: iconGreen },
      { position: { lat: 4.6450, lng: -73.7550 }, title: 'CH-103 - Funcional', icon: iconGreen },
      { position: { lat: 4.6520, lng: -73.7600 }, title: 'CH-104 - Funcional', icon: iconGreen },
      { position: { lat: 4.6400, lng: -73.7400 }, title: 'CH-107 - Funcional', icon: iconGreen },
      { position: { lat: 4.6650, lng: -73.7420 }, title: 'CH-108 - Funcional', icon: iconGreen },
      { position: { lat: 4.6480, lng: -73.7480 }, title: 'CH-105 - CRÍTICO', icon: iconRed },
      { position: { lat: 4.6580, lng: -73.7650 }, title: 'CH-106 - CRÍTICO', icon: iconRed },
      { position: { lat: 4.6350, lng: -73.7500 }, title: 'Planificado Sur', icon: iconYellow },
      { position: { lat: 4.6700, lng: -73.7350 }, title: 'Planificado Norte', icon: iconYellow }
    ];
  }
}
