import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: string = 'Cargando...';
  syncTime: string = '--:--';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUserData();
    this.updateClock();
  }

  fetchUserData() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      this.http.get<any>(`http://localhost:3000/api/dashboard/${userEmail}`).subscribe({
        next: (data) => {
          this.userName = data.userName;
        },
        error: () => {
          this.userName = 'Usuario';
        }
      });
    }
  }

  updateClock() {
    this.syncTime = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}
