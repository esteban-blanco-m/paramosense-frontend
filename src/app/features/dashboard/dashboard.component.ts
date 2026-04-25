import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

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
  userEmail: string;
  locationName: string;
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
  environmentalSummary?: {
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
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  isLoading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading = true;
    this.error = '';
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      this.error = 'No se encontró sesión de usuario.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const apiUrl = `http://localhost:3000/api/dashboard/${userEmail}`;

    this.http.get<DashboardData>(apiUrl).subscribe({
      next: (data) => {
        this.dashboardData = data;

        if (this.dashboardData) {
          this.dashboardData.syncTime = new Date().toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error conectando al servidor:', err);
        this.error = 'No se encontraron datos. Mostrando panel por defecto.';

        this.dashboardData = {
          userEmail: userEmail,
          locationName: 'Ubicación desconocida',
          syncTime: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }),
          userName: 'Usuario',
          currentDate: new Date().toLocaleDateString('es-CO', { month: 'long', day: 'numeric' }),
          activeSensors: 0,
          totalSensors: 0,
          criticalAlerts: 0,
          inactiveSensors: 0,
          sensorHistory: [0, 0, 0, 0],
          waterHistory: [0, 0, 0, 0],
          alertHistory: [0, 0, 0, 0],
          environmentalSummary: {
            temperature: 0,
            humidity: 0,
            waterLevel: 0,
            status: 'Desconectado',
          },
          readings: [],
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  refresh() {
    this.fetchDashboardData();
  }

  get waterChartPath(): string {
    if (!this.dashboardData?.waterHistory?.length) return 'M0,35 L100,35';

    const data = this.dashboardData.waterHistory;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;

    return data
      .map((val, i) => {
        const x = (i / (data.length - 1 || 1)) * 100;
        const normalized = (val - min) / range;
        const y = 35 - normalized * 30;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  get waterChartArea(): string {
    return `${this.waterChartPath} L100,40 L0,40 Z`;
  }

  get chartYLabels(): number[] {
    if (!this.dashboardData?.waterHistory?.length) return [100, 75, 50, 25, 0];

    const data = this.dashboardData.waterHistory;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min === 0 ? 100 : max - min;

    return [max, min + range * 0.75, min + range * 0.5, min + range * 0.25, min].map((v) =>
      Math.round(v),
    );
  }

  get chartXLabels(): string[] {
    if (!this.dashboardData?.readings?.length) {
      return ['08:00', '09:00', '10:00', '11:00', '12:00'];
    }
    return this.dashboardData.readings
      .map((r) => r.timestamp)
      .slice(0, 6)
      .reverse();
  }
}
