import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UsuarioVisitas } from '../models/queries.models';
import { QueryService } from '../services/query.service';

@Component({
  selector: 'app-usuarios-mas-visitas',
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="home-title">👤 Users with Most Visits</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2 style="text-align:center;font-size:1.5rem;">👤 Users with Most Visits</h2>
      <p style="text-align:center;">Here you can see the users who have made the most visits.</p>
      <ion-list *ngIf="userList.length > 0; else loadingOrEmpty">
        <ng-container *ngFor="let user of userList; let i = index">
          <ion-item class="custom-list-item">
            <ion-avatar slot="start" style="background:#e0e7ef;">
              <img [src]="defaultAvatar" alt="avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
              <span style="position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem;pointer-events:none;">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '' }}</span>
            </ion-avatar>
            <ion-label>
              <h3>{{ user.usuario.nombre }} {{ user.usuario.apellido }}</h3>
              <p>Visits: <b>{{ user.totalVisitas }}</b></p>
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
export class UsuariosMasVisitasComponent implements OnInit {
  userList: UsuarioVisitas[] = [];
  loading = true;
  defaultAvatar = 'assets/icon/default.png';
  constructor(private queryService: QueryService) {}
  ngOnInit() {
    this.queryService.getUsuariosMasVisitas().subscribe({
      next: (data) => {
        this.userList = data;
        this.loading = false;
      },
      error: () => {
        this.userList = [];
        this.loading = false;
      }
    });
  }
}
