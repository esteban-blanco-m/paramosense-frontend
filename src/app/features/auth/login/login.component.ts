import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  // Es vital importar FormsModule para que funcione [(ngModel)]
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // o scss según uses
})
export class LoginComponent {
  // Variables atadas al formulario mediante ngModel
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;

  // Inyectamos el Router para poder navegar entre páginas mediante código
  constructor(private router: Router) {}

  // Función que muestra u oculta la contraseña
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Función que se ejecuta al darle al botón "Iniciar sesión"
  onLogin(): void {
    // Aquí más adelante harás la validación real con tu backend.
    // Por ahora, simulamos el inicio de sesión mandándote al Dashboard.
    console.log('Simulando inicio de sesión con:', this.email);

    // Navegamos al Dashboard
    this.router.navigate(['/dashboard']);
  }
}
