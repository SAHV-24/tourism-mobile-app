import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonText,
  IonSpinner,
  IonAvatar,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { QueryService } from '../services/query.service';
import { PlatoPorUsuariosUnicos } from '../models/queries.models';

@Component({
  selector: 'app-platos-por-usuarios-unicos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonText,
    IonSpinner,
    IonAvatar,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="primary">
        <ion-menu-button></ion-menu-button>
        <ion-title>Dishes by Unique Users</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="intro-text">
        <ion-text color="primary">
          <h2>🍽️ Dishes by Unique Users</h2>
        </ion-text>
        <p>
          See which dishes have been tagged or visited by at least
          <b>{{ minUsers }}</b> unique users. Adjust the number below:
        </p>
      </div>
      <ion-item class="input-item">
        <ion-label position="floating">Min. Unique Users</ion-label>
        <ion-input
          type="number"
          [(ngModel)]="minUsers"
          (ngModelChange)="onMinUsersChange($event)"
          min="1"
          [disabled]="loading"
        ></ion-input>
      </ion-item>
      <ion-text color="medium" *ngIf="loading" class="loading-text">
        <ion-spinner name="dots"></ion-spinner> Loading dishes...
      </ion-text>
      <ion-list *ngIf="!loading && dishes.length > 0">
        <ion-item
          *ngFor="let dish of dishes; let i = index"
          class="custom-list-item"
        >
          <ion-avatar slot="start" class="dish-avatar">
            <img src="assets/icon/default.png" alt="dish" />
            <span class="rank-emoji">{{
              i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🍽️'
            }}</span>
          </ion-avatar>
          <ion-label>
            <h3 class="dish-title">{{ dish.nombre }}</h3>
            <p>
              Site: <b>{{ dish.sitio }}</b>
            </p>
            <p>
              Price: <b>{{ dish.precio | currency : 'EUR' }}</b>
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div *ngIf="!loading && dishes.length === 0 && minUsers" class="no-data">
        <ion-text color="danger"
          ><b>No dishes found for this user count.</b></ion-text
        >
      </div>
    </ion-content>
  `,
  styles: [
    `
      .intro-text {
        text-align: center;
        margin-bottom: 1.5em;
      }
      .input-item {
        max-width: 350px;
        margin: 0 auto 1.5em auto;
        border-radius: 12px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
      }
      .custom-list-item {
        margin: 8px 0;
        border-radius: 12px;
        border: 2px solid var(--ion-color-primary);
        background: #fff;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
        align-items: flex-start;
      }
      .dish-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--ion-color-primary);
        margin-bottom: 0.2em;
      }
      .dish-avatar {
        background: #e0e7ef;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .dish-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
      .rank-emoji {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        pointer-events: none;
      }
      .no-data {
        text-align: center;
        margin-top: 2em;
      }
      .loading-text {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 2em 0 1em 0;
        font-size: 1.1em;
      }
    `,
  ],
})
export class PlatosPorUsuariosUnicosComponent implements OnInit {
  dishes: PlatoPorUsuariosUnicos[] = [];
  minUsers: number = 2;
  loading = false;

  constructor(private queryService: QueryService) {}

  ngOnInit() {
    this.fetchDishes();
  }

  onMinUsersChange(n: number) {
    this.minUsers = n;
    this.fetchDishes();
  }

  fetchDishes() {
    if (!this.minUsers || this.minUsers < 1) {
      this.dishes = [];
      return;
    }
    this.loading = true;
    this.queryService.getPlatosPorUsuariosUnicos(this.minUsers).subscribe({
      next: (data) => {
        console.log('Fetched dishes:', data);
        this.dishes = data || [];
        this.loading = false;
      },
      error: () => {
        this.dishes = [];
        this.loading = false;
      },
    });
  }
}
