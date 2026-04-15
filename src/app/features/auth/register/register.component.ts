import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  showPass = false;
  showPass2 = false;
  acceptTerms = false;

  formData = {
    nombre: '',
    apellido: '',
    password: '',
    confirmPassword: '',
    rol: '',
    telefono: '',
    area: '',
    municipio: ''
  };

  onRegister() {
    console.log('Register:', this.formData);
    // TODO: implement registration service
  }
}
