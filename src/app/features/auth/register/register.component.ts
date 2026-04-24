import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importamos Router
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service'; // Importamos el servicio

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  agreeTerms = false;

  // Inyectamos el AuthService y el Router
  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.agreeTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    // Llamamos al backend
    this.authService.register(userData).subscribe({
      next: (response) => {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']); // Te envía al login
      },
      error: (err) => {
        alert('Error: ' + err.error.message);
      }
    });
  }
}
