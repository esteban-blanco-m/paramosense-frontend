import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importamos Router
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service'; // Importamos el servicio

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;

  // Inyectamos el AuthService y el Router
  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Si el login es correcto, guardamos el nombre del usuario y vamos al dashboard
        console.log('Bienvenido', response.userName);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Error al iniciar sesión: Verifica tu correo o contraseña');
      }
    });
  }
}
