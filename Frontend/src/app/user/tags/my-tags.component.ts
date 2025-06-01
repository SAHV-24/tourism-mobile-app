import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TagService } from 'src/app/services/tag.service';
import { AuthService } from 'src/app/services/auth.service';
import { Tag } from 'src/app/models/tag.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-tags',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>My Tags</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button expand="block" color="secondary" size="large" routerLink="/tags/create" style="margin-bottom: 1.2em; font-size: 1.15em; font-weight: 600; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.10);">
        <ion-icon name="add" slot="start"></ion-icon>
        Create
      </ion-button>
      <ion-list *ngIf="tags.length; else noTags">
        <ion-item *ngFor="let tag of tags" [routerLink]="['/tag', tag._id]" routerLinkActive="router-link-active">
          <ion-label>
            <h2>Tag #{{ tag._id }}</h2>
            <p><b>Famous:</b> {{ tag.famoso.nombre }}</p>
            <p><b>Location:</b> {{ tag.latitud }}, {{ tag.longitud }}</p>
            <p><b>Date:</b> {{ tag.fecha | date : 'mediumDate' }}</p>
            <p *ngIf="tag.comentario"><b>Comment:</b> {{ tag.comentario }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ng-template #noTags>
        <ion-text color="medium">You have no tags yet.</ion-text>
      </ng-template>
    </ion-content>
  `,
  styles: [
    `
      ion-content {
        font-size: 1.1em;
      }
    `,
  ],
})
export class MyTagsComponent implements OnInit {
  tags: Tag[] = [];
  private tagService = inject(TagService);
  private authService = inject(AuthService);

  ngOnInit() {
    const userId = this.authService.currentUserId;
    if (userId) {
      this.tagService.getByUserId(userId).subscribe({
        next: (tags) => (this.tags = tags),
        error: () => (this.tags = []),
      });
    }
  }
}
