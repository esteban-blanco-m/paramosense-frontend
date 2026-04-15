import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  syncTime = '09:03';
  userName = 'Ana Martínez';
  currentDate = 'Marzo 4';

  refresh() {
    this.syncTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }
}
