import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { AuthService, SignupRequest } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isSubmitted = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // If already authenticated, redirect to main page
    if (this.authService.currentAuthValue) {
      this.router.navigate(['/folder/inbox']);
      return;
    }

    this.initForm();

    // Subscribe to logout event to reset form
    this.subscription.add(
      this.authService.getLogoutEvent().subscribe(() => {
        this.initForm();
      })
    );
  }

  /**
   * Initialize the login form with empty values
   */
  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.isSubmitted = false;
  }

  /**
   * Clean up subscriptions when component is destroyed
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  async submitForm() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return false;
    } else {
      // Show loading indicator
      const loading = await this.loadingController.create({
        message: 'Logging in...',
        spinner: 'circles',
        cssClass: 'loading-indicator'
      });
      await loading.present();

      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      this.authService.login(username, password).subscribe(
        success => {
          // Hide loading indicator
          loading.dismiss();

          if (success) {
            // Navigate to main page
            this.router.navigate(['/folder/inbox']);
          } else {
            this.showLoginFailedAlert();
          }
        },
        error => {
          // Hide loading indicator in case of error
          loading.dismiss();
          this.showLoginFailedAlert();
        }
      );
      return true;
    }
  }

  async showLoginFailedAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Invalid username or password',
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
              rol: 'UsuarioDefault' // Using the role from the example
            };

            // Show loading indicator
            this.loadingController.create({
              message: 'Registering...',
              spinner: 'circles',
              cssClass: 'loading-indicator'
            }).then(loading => {
              loading.present();

              this.authService.signup(signupData).subscribe(
                success => {
                  // Hide loading indicator
                  loading.dismiss();

                  if (success) {
                    this.showRegistrationSuccessAlert();
                  } else {
                    this.showRegistrationFailedAlert();
                  }
                },
                error => {
                  // Hide loading indicator in case of error
                  loading.dismiss();
                  this.showRegistrationFailedAlert();
                }
              );
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
