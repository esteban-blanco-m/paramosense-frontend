import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './system-status.component.html',
  styleUrls: ['./system-status.component.css']
})
export class SystemStatusComponent implements OnInit {
  dashboardData: any = null;
  locationName: string = 'Cargando ubicación...';

  totalSensors: number = 0;
  functionalCount: number = 0;
  warningCount: number = 0;
  criticalCount: number = 0;

  isLoading = true;
  error = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchSystemData();
  }

  fetchSystemData() {
    const userEmail = localStorage.getItem('userEmail');
    const savedLocation = localStorage.getItem('userLocation');

    if (!userEmail) {
      this.error = 'No se encontró sesión activa.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/dashboard/${userEmail}`).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.dashboardData.syncTime = new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit', minute: '2-digit', hour12: false
        });

        this.loadLocationSensors(data.locationId || savedLocation || 'chingaza');
      },
      error: (err) => {
        this.loadLocationSensors(savedLocation || 'chingaza');
      }
    });
  }

  loadLocationSensors(locationId: string) {
    this.http.get<any[]>('/assets/data/locations.json').subscribe({
      next: (locations) => {
        const myLocation = locations.find(loc => loc.locationId === locationId) || locations[0];

        this.locationName = myLocation.locationName;
        this.totalSensors = myLocation.sensors ? myLocation.sensors.length : 0;

        this.functionalCount = 0;
        this.warningCount = 0;
        this.criticalCount = 0;

        if (myLocation.sensors) {
          myLocation.sensors.forEach((sensor: any) => {
            if (sensor.statusClass === 'critical') {
              this.criticalCount++;
            } else if (sensor.statusClass === 'warning' || sensor.statusClass === 'planned') {
              this.warningCount++;
            } else {
              this.functionalCount++;
            }
          });
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error cargando el archivo de sensores (JSON).';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get systemStatusText(): string {
    if (this.criticalCount > 0) return 'Estado Crítico - Revisión Urgente';
    if (this.warningCount > 0) return 'Mantenimiento Sugerido';
    return 'Sistema Operativo y Estable';
  }

  get systemStatusClass(): string {
    if (this.criticalCount > 0) return 'status-critical';
    if (this.warningCount > 0) return 'status-warning';
    return 'status-ok';
  }
}
