import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any = null;
  isLoading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDashboardData();
  }
  fetchDashboardData() {
    this.isLoading = true;
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      this.error = 'No se encontró sesión de usuario.';
      this.isLoading = false;
      return;
    }

    const apiUrl = `http://localhost:3000/api/dashboard/${userEmail}`;

    this.http.get(apiUrl).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('🚨 Error conectando al servidor:', err);
        this.error = 'No se encontraron datos. Mostrando panel por defecto.';

        this.dashboardData = {
          userEmail: userEmail,
          syncTime: "--:--",
          userName: "Usuario",
          currentDate: new Date().toLocaleDateString('es-CO', { month: 'long', day: 'numeric' }),
          locationName: "Buscando ubicación...",
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
