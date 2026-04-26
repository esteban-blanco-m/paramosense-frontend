import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: '',
    telefono: '',
    area: '',
    municipio: ''
  };

  showPass = false;
  showPass2 = false;
  acceptTerms = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.acceptTerms) {
      this.errorMessage = 'Debes aceptar los términos y condiciones para continuar.';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden. Por favor, verifícalas.';
      return;
    }

    if (!this.formData.nombre || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Por favor, completa los campos obligatorios (Nombre, Correo y Contraseña).';
      return;
    }

    const userData = {
      name: `${this.formData.nombre} ${this.formData.apellido}`.trim(),
      email: this.formData.email,
      password: this.formData.password,
      rol: this.formData.rol,
      telefono: this.formData.telefono,
      area: this.formData.area,
      municipio: this.formData.municipio
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        if (this.formData.area) {
          localStorage.setItem('userLocation', this.formData.area);
        }


        this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ocurrió un error al intentar registrarte.';
      }
    });
  }
}
