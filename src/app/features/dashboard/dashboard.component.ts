import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
// Importar HttpClient para hacer la petición HTTP (Asegúrate de tener HttpClientModule en app.config.ts)
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Variable que contendrá todos los datos dinámicos
  dashboardData: any = null; // Lo ideal es usar la interfaz DashboardData que definimos arriba
  isLoading = true;
  error = '';

  // Inyectamos HttpClient
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading = true;
    // AQUÍ PONES LA RUTA DE TU API DE NODE.JS/EXPRESS QUE CONECTA CON MONGO
    const apiUrl = 'http://tu-api-backend.com/api/dashboard';

    this.http.get(apiUrl).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando datos de Mongo:', err);
        this.error = 'No se pudieron cargar los datos del servidor.';
        this.isLoading = false;
      }
    });
  }

  refresh() {
    this.fetchDashboardData();
  }
}
