import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

interface GeneratedReport {
  name: string;
  date: string;
  type: string;
  size: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  currentDate = new Date().toLocaleDateString('es-CO', { month: 'long', day: 'numeric' });
  isGenerating = false;
  dashboardData: any = null;
  availableSectors: string[] = ['Todos los sectores'];
  availableTypes: string[] = ['Todas las variables'];
  selectedSector = 'Todos los sectores';
  selectedType = 'Todas las variables';
  recentReports: GeneratedReport[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDynamicData();
  }

  fetchDynamicData() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    this.http.get<any>(`http://localhost:3000/api/dashboard/${userEmail}`).subscribe({
      next: (data) => {
        this.dashboardData = data;

        if (data.locationName) {
          this.availableSectors.push(data.locationName);
        }

        if (data.readings && data.readings.length > 0) {
          const uniqueTypes = new Set(data.readings.map((r: any) => r.type));
          this.availableTypes = [...this.availableTypes, ...Array.from(uniqueTypes)] as string[];
        }
      },
      error: (err) => console.error('Error cargando datos para reportes', err)
    });
  }

  quickDownload(type: string) {
    if (type === 'Datos Excel') {
      this.exportToExcel(this.dashboardData?.readings, 'Exportacion_Completa');
    } else {
      alert(`La generación del formato ${type} estará disponible pronto.`);
    }
  }

  generateCustomReport() {
    if (!this.dashboardData || !this.dashboardData.readings) {
      alert('No hay datos en la base de datos para filtrar.');
      return;
    }

    this.isGenerating = true;

    setTimeout(() => {

      let filteredData = this.dashboardData.readings;

      if (this.selectedType !== 'Todas las variables') {
        filteredData = filteredData.filter((r: any) => r.type === this.selectedType);
      }

      this.exportToExcel(filteredData, 'Reporte_Personalizado');
      this.isGenerating = false;
    }, 1000);
  }

  exportToExcel(dataToExport: any[], fileNamePrefix: string) {
    if (!dataToExport || dataToExport.length === 0) {
      alert('No se encontraron registros con los filtros seleccionados.');
      return;
    }

    const excelData = dataToExport.map((r: any) => ({
      'Hora': r.timestamp,
      'Sensor ID': r.sensorId,
      'Tipo': r.type,
      'Valor': r.value,
      'Unidad': r.unit,
      'Estado': r.status
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };

    const finalName = `${fileNamePrefix}_${new Date().getTime()}.xlsx`;

    XLSX.writeFile(workbook, finalName);

    const fileSize = `${(excelData.length * 0.12).toFixed(2)} KB`;
    const today = new Date().toLocaleDateString('es-CO');

    this.recentReports.unshift({
      name: finalName,
      date: today,
      type: 'Excel',
      size: fileSize
    });
  }
}
