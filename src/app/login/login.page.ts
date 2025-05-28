import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { AuthService, SignupRequest } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // If already authenticated, redirect to main page
    if (this.authService.currentAuthValue) {
      this.router.navigate(['/folder/inbox']);
      return;
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  async submitForm() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return false;
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authService.login(email, password).subscribe(success => {
        if (success) {
          // Navigate to main page
          this.router.navigate(['/folder/inbox']);
        } else {
          this.showLoginFailedAlert();
        }
      });
      return true;
    }
  }

  async showLoginFailedAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Invalid email or password',
      buttons: ['OK']
    });
    await alert.present();
  }

  async openSignupModal() {
    const alert = await this.alertController.create({
      header: 'Register',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'First Name'
        },
        {
          name: 'apellido',
          type: 'text',
          placeholder: 'Last Name'
        },
        {
          name: 'correo',
          type: 'email',
          placeholder: 'Email'
        },
        {
          name: 'usuario',
          type: 'text',
          placeholder: 'Username'
        },
        {
          name: 'contraseña',
          type: 'password',
          placeholder: 'Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Register',
          handler: (data) => {
            // Add default role
            const signupData: SignupRequest = {
              ...data,
              rol: 'Administrador' // Using the role from the example
            };

            this.authService.signup(signupData).subscribe(success => {
              if (success) {
                this.showRegistrationSuccessAlert();
              } else {
                this.showRegistrationFailedAlert();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showRegistrationSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Registration Successful',
      message: 'You can now login with your credentials',
      buttons: ['OK']
    });
    await alert.present();
  }

  async showRegistrationFailedAlert() {
    const alert = await this.alertController.create({
      header: 'Registration Failed',
      message: 'There was an error during registration. Please try again.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
