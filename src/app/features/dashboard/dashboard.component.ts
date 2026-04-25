import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

// 1. INTERFACES ACTUALIZADAS CON LOS CAMPOS FALTANTES
export interface SensorReading {
  _id?: string;
  timestamp: string;
  sensorId: string;
  type: string;
  value: number;
  unit: string;
  status: string;
  statusClass: string;
}

export interface DashboardData {
  _id?: string;
  userEmail: string;         // Faltaba
  locationName: string;      // Faltaba
  syncTime: string;
  userName: string;
  currentDate: string;
  activeSensors: number;
  totalSensors: number;
  criticalAlerts: number;
  inactiveSensors: number;
  sensorHistory: number[];
  waterHistory: number[];
  alertHistory: number[];
  environmentalSummary: {
    temperature: number;
    humidity: number;
    waterLevel: number;
    status: string;
  };
  readings: SensorReading[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // 2. TIPADO ESTRICTO EN LUGAR DE "any"
  dashboardData: DashboardData | null = null;
  isLoading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading = true;
    this.error = ''; // 3. LIMPIAR EL ERROR EN CADA NUEVO INTENTO
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      this.error = 'No se encontró sesión de usuario.';
      this.isLoading = false;
      return;
    }

    const apiUrl = `http://localhost:3000/api/dashboard/${userEmail}`;

    // 4. SE LE INDICA A HTTPCLIENT QUÉ TIPO DE DATO ESPERAR
    this.http.get<DashboardData>(apiUrl).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('🚨 Error conectando al servidor:', err);
        this.error = 'No se encontraron datos. Mostrando panel por defecto.';

        this.dashboardData = {
          userEmail: userEmail,
          locationName: "Ubicación desconocida", // Valor por defecto
          syncTime: "--:--",
          userName: "Usuario",
          currentDate: new Date().toLocaleDateString('es-CO', { month: 'long', day: 'numeric' }),
          activeSensors: 0,
          totalSensors: 0,
          criticalAlerts: 0,
          inactiveSensors: 0,
          sensorHistory: [0, 0, 0, 0],
          waterHistory: [0, 0, 0, 0],
          alertHistory: [0, 0, 0, 0],
          environmentalSummary: { temperature: 0, humidity: 0, waterLevel: 0, status: 'Desconectado' },
          readings: []
        };
        this.isLoading = false;
      }
    });
  }

  refresh() {
    this.fetchDashboardData();
  }
}
