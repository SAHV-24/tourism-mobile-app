import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TagService } from 'src/app/services/tag.service';
import { FamousService } from 'src/app/services/famous.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Famous } from 'src/app/models/famous.model';

@Component({
  selector: 'app-create-tag',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Create Tag</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <ion-list lines="full">
          <ion-item>
            <ion-label position="floating">Famous</ion-label>
            <ion-select formControlName="famoso" required interface="popover">
              <ion-select-option *ngFor="let famous of famousList" [value]="famous._id">
                {{ famous.nombre }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Latitude</ion-label>
            <ion-input type="number" formControlName="latitud" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Longitude</ion-label>
            <ion-input type="number" formControlName="longitud" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Photo URL</ion-label>
            <ion-input formControlName="fotoUrl" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Date</ion-label>
            <ion-input type="date" formControlName="fecha" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Comment</ion-label>
            <ion-textarea formControlName="comentario"></ion-textarea>
          </ion-item>
        </ion-list>
        <ion-button expand="block" type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Saving...' : 'Create Tag' }}
        </ion-button>
      </form>
    </ion-content>
  `,
  styles: [
    `ion-content { font-size: 1.1em; }
     form { max-width: 420px; margin: 0 auto; }
     ion-button { margin-top: 18px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTagComponent implements OnInit {
  form: FormGroup;
  loading = false;
  famousList: Famous[] = [];
  private tagService = inject(TagService);
  private famousService = inject(FamousService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastController);
  private router = inject(Router);

  constructor() {
    this.form = this.fb.group({
      famoso: ['', Validators.required],
      latitud: [null, [Validators.required]],
      longitud: [null, [Validators.required]],
      fotoUrl: ['', Validators.required],
      fecha: ['', Validators.required],
      comentario: [''],
    });
  }

  ngOnInit() {
    this.famousService.getAll().subscribe({
      next: (famous) => (this.famousList = famous),
      error: () => (this.famousList = []),
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const userId = this.authService.currentUserId;
    if (!userId) {
      this.loading = false;
      const t = await this.toast.create({ message: 'User not authenticated', color: 'danger', duration: 2000 });
      t.present();
      return;
    }
    const tagData = { ...this.form.value, usuario: userId };
    this.tagService.create(tagData).subscribe({
      next: async () => {
        this.loading = false;
        const t = await this.toast.create({ message: 'Tag created!', color: 'success', duration: 1800 });
        t.present();
        this.router.navigate(['/tags']);
      },
      error: async () => {
        this.loading = false;
        const t = await this.toast.create({ message: 'Error creating tag', color: 'danger', duration: 2000 });
        t.present();
      }
    });
  }
}
