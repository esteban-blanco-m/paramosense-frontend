import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

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
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, ingresa tu correo y contraseña.';
      return;
    }

    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('userEmail', response.email);
        this.successMessage = '¡Inicio de sesión exitoso! Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al iniciar sesión: Verifica tu correo o contraseña.';
      }
    });
  }
}
