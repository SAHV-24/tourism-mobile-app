import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/models/tag.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>All Tags</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="tags-header">
        <h1 class="tags-title">TAGS</h1>
        <p class="tags-desc">
          A tag is a record of a user tagging a famous person at a specific location and date, optionally with a comment and photo. Tags help track and share memorable encounters!
        </p>
        <div class="my-tags-card ion-padding ion-text-center" (click)="goToMyTags()">
          <ion-icon name="pricetag" size="large" ></ion-icon>
          <div class="my-tags-title">My Tags</div>
        </div>
        <ion-item class="search-bar">
          <ion-label position="floating">Search by user name</ion-label>
          <ion-input [(ngModel)]="search" (ionInput)="filterTags()" clearInput></ion-input>
        </ion-item>
      </div>
      <ion-list *ngIf="filteredTags.length; else noTags">
        <ion-item
          *ngFor="let tag of filteredTags"
          [routerLink]="['/tag', tag._id]"
          routerLinkActive="router-link-active"
        >
          <ion-label>
            <h2>Tag #{{ tag._id }}</h2>
            <p>
              <b>User:</b> {{ tag.usuario.nombre }} {{ tag.usuario.apellido }}
            </p>
            <p><b>Famous:</b> {{ tag.famoso.nombre }}</p>
            <p><b>Location:</b> {{ tag.latitud }}, {{ tag.longitud }}</p>
            <p><b>Date:</b> {{ tag.fecha | date : 'mediumDate' }}</p>
            <p *ngIf="tag.comentario">
              <b>Comment:</b> {{ tag.comentario }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ng-template #noTags>
        <ion-text color="medium">No tags found.</ion-text>
      </ng-template>
    </ion-content>
  `,
  styles: [
    `
      .tags-header { margin-bottom: 1.5rem; }
      .tags-title { font-size: 2.3rem; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 0.5em 0 0.2em 0; }
      .tags-desc { text-align: center; color: #666; font-size: 1.08rem; margin-bottom: 1.2em; }
      .my-tags-card { background: linear-gradient(90deg, var(--ion-color-primary), #4dd0e1); border-radius: 18px; color: #fff; margin: 0 auto 1.2em auto; max-width: 340px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); display: flex; flex-direction: column; align-items: center; transition: box-shadow 0.2s; cursor: pointer; }
      .my-tags-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.13); }
      .my-tags-title { font-size: 1.3rem; font-weight: 600; margin-top: 0.3em; letter-spacing: 1px; }
      .search-bar { margin: 0.5em 0 1.2em 0; border-radius: 12px; background: #f6f8fa; }
      ion-content { font-size: 1.1em; }
    `,
  ],
})
export class TagListComponent implements OnInit {
  tags: Tag[] = [];
  filteredTags: Tag[] = [];
  search = '';
  private tagService = inject(TagService);
  private router = inject(Router);

  ngOnInit() {
    this.tagService.getAll().subscribe({
      next: (tags: Tag[]) => {
        this.tags = tags;
        this.filteredTags = tags;
      },
      error: () => {
        this.tags = [];
        this.filteredTags = [];
      },
    });
  }

  filterTags() {
    const term = this.search.trim().toLowerCase();
    if (!term) {
      this.filteredTags = this.tags;
      return;
    }
    this.filteredTags = this.tags.filter(tag =>
      (tag.usuario.nombre + ' ' + tag.usuario.apellido).toLowerCase().includes(term)
    );
  }

  goToMyTags() {
    this.router.navigate(['/tags/my-tags']);
  }
}
