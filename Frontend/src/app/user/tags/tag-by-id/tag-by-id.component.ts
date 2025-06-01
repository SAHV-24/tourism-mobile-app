import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/models/tag.model';
import { tap } from 'rxjs';

@Component({
  selector: 'app-tag-by-id',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Publicación</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding post-content">
      <ng-container *ngIf="tag(); else loadingOrError">
        <div class="post-container">
          <!-- Usuario -->
          <div class="post-header">
            <ion-avatar>
              <img
                src="https://ui-avatars.com/api/?name={{
                  tag()?.usuario?.nombre
                }}+{{ tag()?.usuario?.apellido }}"
              />
            </ion-avatar>
            <div class="user-info">
              <div class="user-name">
                {{ tag()?.usuario?.nombre }} {{ tag()?.usuario?.apellido }}
              </div>
              <div class="post-date">{{ tag()?.fecha | date : 'medium' }}</div>
            </div>
          </div>

          <!-- Foto -->
          <img [src]="tag()?.fotoUrl" alt="Tag photo" class="post-image" />

          <!-- Comentario -->
          <div class="post-comment">{{ tag()?.comentario }}</div>

          <!-- Famoso -->
          <div class="post-tagged">
            📸 Etiquetado a: <strong>{{ tag()?.famoso?.nombre }}</strong>
          </div>

          <!-- Ubicación -->
          <div class="post-location">
            <ion-icon name="location-outline" class="location-icon"></ion-icon>
            {{ tag()?.latitud }}, {{ tag()?.longitud }}
          </div>
        </div>
      </ng-container>

      <ng-template #loadingOrError>
        <ion-spinner *ngIf="!error()" />
        <div
          *ngIf="error()"
          class="ion-text-center ion-margin-top ion-color-danger"
        >
          Tag no encontrado.
        </div>
      </ng-template>
    </ion-content>
  `,
  styleUrls: ['./tag-by-id.component.scss'],
})
export class TagByIdComponent implements OnInit {
  tag = signal<Tag | null>(null);
  error = signal(false);

  private tagService = inject(TagService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tagService
        .getById(id)
        .pipe(tap((tag) => console.log('Fetched tag:', tag)))
        .subscribe({
          next: (tag) => {
            if (tag && tag._id) {
              this.tag.set(tag);
            } else {
              this.error.set(true);
            }
          },
          error: () => this.error.set(true),
        });
    } else {
      this.error.set(true);
    }
  }
}
