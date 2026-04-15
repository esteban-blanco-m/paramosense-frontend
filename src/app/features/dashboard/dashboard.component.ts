import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../app/shared/components/navbar/ navbar.component.ts";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  syncTime = '09:03';
  userName = 'Ana Martínez';
  currentDate = 'Marzo 4';

  activeSensors = 12;
  totalSensors = 14;
  criticalAlerts = 2;
  inactiveSensors = 2;

  // Mini chart data (bar heights)
  sensorHistory = [12, 13, 12, 12];
  waterHistory = [280, 290, 275, 280];   // will be divided by 4 in template
  alertHistory = [0, 1, 0, 1];           // will be multiplied by 20

  readings = [
    { timestamp: '2025-03-02 08:15', sensorId: 'PS-101', type: 'Nivel de agua', value: 78, unit: '%',     status: 'Normal',      statusClass: 'normal' },
    { timestamp: '2025-03-02 14:40', sensorId: 'PS-204', type: 'Temperatura',   value: 8.4, unit: '°C',   status: 'Advertencia', statusClass: 'warning' },
    { timestamp: '2025-03-02 21:05', sensorId: 'PS-317', type: 'Conectividad',  value: 0,   unit: 'señal', status: 'Offline',      statusClass: 'offline' },
    { timestamp: '2025-03-03 09:20', sensorId: 'PS-118', type: 'Humedad',       value: 86,  unit: '%',    status: 'Normal',      statusClass: 'normal' },
    { timestamp: '2025-03-03 17:55', sensorId: 'PS-233', type: 'Lluvia',        value: 12,  unit: 'mm',   status: 'Info',        statusClass: 'info' },
  ];

  refresh() {
    this.syncTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    console.log('Refreshed at', this.syncTime);
  }
}
