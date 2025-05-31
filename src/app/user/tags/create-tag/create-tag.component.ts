import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TagService } from 'src/app/services/tag.service';
import { FamousService } from 'src/app/services/famous.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Famous } from 'src/app/models/famous.model';
import { Camera } from '@capacitor/camera';

@Component({
  selector: 'app-create-tag',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTagComponent implements OnInit {
  form: FormGroup;
  loading = false;
  famousList: Famous[] = [];
  latitud: number | null = null;
  longitud: number | null = null;
  photoUrl: string | null = null;
  photoFile: File | null = null;
  private tagService = inject(TagService);
  private famousService = inject(FamousService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastController);
  private router = inject(Router);

  constructor() {
    this.form = this.fb.group({
      famoso: ['', Validators.required],
      fotoUrl: ['', Validators.required],
      fecha: ['', Validators.required],
      comentario: [''],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.famousService.getAll().subscribe({
      next: (famous) => (this.famousList = famous),
      error: () => (this.famousList = []),
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitud = pos.coords.latitude;
          this.longitud = pos.coords.longitude;
          this.loading = false;
        },
        () => {
          this.latitud = null;
          this.longitud = null;
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
  }

  async pickPhoto() {
    try {
      const result = await Camera.pickImages({
        quality: 80,
        limit: 1,
        // resultType: CameraResultType.Uri (default)
      });
      if (result.photos && result.photos.length > 0) {
        this.photoUrl = result.photos[0].webPath || null;
        // Fetch the file from the webPath (works on web/Android/iOS)
        if (this.photoUrl) {
          const response = await fetch(this.photoUrl);
          const blob = await response.blob();
          // Try to get a filename from the path, fallback to 'photo.jpg'
          const filename = result.photos[0].path?.split('/').pop() || 'photo.jpg';
          this.photoFile = new File([blob], filename, { type: blob.type });
        } else {
          this.photoFile = null;
        }
        this.form.patchValue({ fotoUrl: this.photoUrl });
      }
    } catch (e) {
      this.photoUrl = null;
      this.photoFile = null;
    }
  }

  async onSubmit() {
    if (this.form.invalid || this.latitud === null || this.longitud === null || !this.photoFile) return;
    this.loading = true;
    const userId = this.authService.currentUserId;
    if (!userId) {
      this.loading = false;
      const t = await this.toast.create({
        message: 'User not authenticated',
        color: 'danger',
        duration: 2000,
      });
      t.present();
      return;
    }
    // Build FormData for multipart/form-data
    const formData = new FormData();
    formData.append('usuario', userId.toString());
    formData.append('famoso', this.form.value.famoso);
    formData.append('latitud', this.latitud.toString());
    formData.append('longitud', this.longitud.toString());
    formData.append('comentario', this.form.value.comentario || '');
    formData.append('fecha', this.form.value.fecha);
    formData.append('foto', this.photoFile);
    this.tagService.create(formData).subscribe({
      next: async () => {
        this.loading = false;
        const t = await this.toast.create({
          message: 'Tag created!',
          color: 'success',
          duration: 1800,
        });
        t.present();
        this.router.navigate(['/tags']);
      },
      error: async () => {
        this.loading = false;
        const t = await this.toast.create({
          message: 'Error creating tag',
          color: 'danger',
          duration: 2000,
        });
        t.present();
      },
    });
  }
}
