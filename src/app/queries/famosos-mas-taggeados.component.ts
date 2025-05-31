import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FamosoTaggeado } from '../models/queries.models';
import { QueryService } from '../services/query.service';

@Component({
  selector: 'app-famosos-mas-taggeados',
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="home-title">🌟 Most Tagged Famous People</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2 style="text-align:center;font-size:1.5rem;">🌟 Most Tagged Famous People</h2>
      <p style="text-align:center;">Here you can see the famous people who have been tagged the most by users.</p>
      <ion-list *ngIf="famousList.length > 0; else loadingOrEmpty">
        <ng-container *ngFor="let famous of famousList; let i = index">
          <ion-item class="custom-list-item">
            <ion-avatar slot="start" style="background:#e0e7ef;">
              <img *ngIf="famous.famoso.foto" [src]="famous.famoso.foto" alt="famous photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
              <span style="position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem;pointer-events:none;">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '' }}</span>
            </ion-avatar>
            <ion-label>
              <h3>{{ famous.famoso.nombre }}</h3>
              <p>Tags: <b>{{ famous.totalTags }}</b></p>
            </ion-label>
          </ion-item>
        </ng-container>
      </ion-list>
      <ng-template #loadingOrEmpty>
        <ion-spinner *ngIf="loading"></ion-spinner>
        <p *ngIf="!loading">No data found.</p>
      </ng-template>
    </ion-content>
  `,
  styles: [`
    .custom-list-item {
      margin: 6px 0;
      border-radius: 12px;
      border: 2px solid var(--ion-color-primary);
      background: #fff;
      box-shadow: 0 1px 6px rgba(0,0,0,0.04);
    }
  `]
})
export class FamososMasTaggeadosComponent implements OnInit {
  famousList: FamosoTaggeado[] = [];
  loading = true;
  constructor(private queryService: QueryService) {}
  ngOnInit() {
    this.queryService.getFamososMasTaggeados().subscribe({
      next: (data) => {
        this.famousList = data;
        this.loading = false;
      },
      error: () => {
        this.famousList = [];
        this.loading = false;
      }
    });
  }
}
