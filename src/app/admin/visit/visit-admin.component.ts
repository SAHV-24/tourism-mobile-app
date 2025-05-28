import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { Visit } from '../../models/visit.model';
import { VisitService } from '../../services/visit.service';
import { UserService } from '../../services/user.service';
import { SiteService } from '../../services/site.service';
import { User } from '../../models/user.model';
import { Site } from '../../models/site.model';

@Component({
  selector: 'app-visit-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  template: `
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ isEditing ? 'Edit Visit' : 'Add Visit' }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <form [formGroup]="form" (ngSubmit)="isEditing ? updateItem() : createItem()">
                  <ion-item>
                    <ion-label position="floating">User</ion-label>
                    <ion-select formControlName="idUser">
                      <ion-select-option *ngFor="let user of users" [value]="user.idUser">
                        {{ user.name }}
                      </ion-select-option>
                    </ion-select>
                    <ion-note slot="error" *ngIf="form.get('idUser')?.invalid && form.get('idUser')?.touched">
                      User is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Site</ion-label>
                    <ion-select formControlName="idSite">
                      <ion-select-option *ngFor="let site of sites" [value]="site.idSite">
                        {{ site.name }}
                      </ion-select-option>
                    </ion-select>
                    <ion-note slot="error" *ngIf="form.get('idSite')?.invalid && form.get('idSite')?.touched">
                      Site is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Latitude</ion-label>
                    <ion-input formControlName="latitude" type="number" step="0.000001"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('latitude')?.invalid && form.get('latitude')?.touched">
                      Latitude is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Longitude</ion-label>
                    <ion-input formControlName="longitude" type="number" step="0.000001"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('longitude')?.invalid && form.get('longitude')?.touched">
                      Longitude is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Date</ion-label>
                    <ion-input formControlName="date" type="date"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('date')?.invalid && form.get('date')?.touched">
                      Date is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Time</ion-label>
                    <ion-input formControlName="time" type="time"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('time')?.invalid && form.get('time')?.touched">
                      Time is required
                    </ion-note>
                  </ion-item>

                  <div class="ion-padding-top">
                    <ion-button type="submit" expand="block" [disabled]="form.invalid || isLoading">
                      {{ isEditing ? 'Update' : 'Create' }}
                    </ion-button>
                    <ion-button *ngIf="isEditing" type="button" expand="block" fill="outline"
                                (click)="cancelEdit()" [disabled]="isLoading">
                      Cancel
                    </ion-button>
                  </div>
                </form>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Visits</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item *ngIf="isLoading">
                    <ion-label>Loading...</ion-label>
                    <ion-spinner name="dots"></ion-spinner>
                  </ion-item>

                  <ion-item *ngIf="!isLoading && items.length === 0">
                    <ion-label>No visits found</ion-label>
                  </ion-item>

                  <ion-item *ngFor="let visit of items">
                    <ion-label>
                      <h2>Visit #{{ visit.idVisit }}</h2>
                      <p>User: {{ getUserName(visit.idUser) }}</p>
                      <p>Site: {{ getSiteName(visit.idSite) }}</p>
                      <p>Location: {{ visit.latitude }}, {{ visit.longitude }}</p>
                      <p>Date: {{ visit.date | date:'mediumDate' }} at {{ visit.time }}</p>
                    </ion-label>
                    <ion-buttons slot="end">
                      <ion-button (click)="editItem(visit)">
                        <ion-icon name="create-outline"></ion-icon>
                      </ion-button>
                      <ion-button (click)="confirmDelete(visit)">
                        <ion-icon name="trash-outline"></ion-icon>
                      </ion-button>
                    </ion-buttons>
                  </ion-item>
                </ion-list>

                <ion-button expand="block" (click)="loadItems()" [disabled]="isLoading">
                  <ion-icon name="refresh-outline"></ion-icon>
                  Refresh
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class VisitAdminComponent extends BaseAdminComponent<Visit> implements OnInit {
  users: User[] = [];
  sites: Site[] = [];

  constructor(
    protected visitService: VisitService,
    private userService: UserService,
    private siteService: SiteService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController
  ) {
    super(visitService, fb, alertController, toastController);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadUsers();
    this.loadSites();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data || [];
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.users = []; // Ensure users is initialized even on error
        this.showToast('Error loading users: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
      }
    });
  }

  loadSites() {
    this.siteService.getAll().subscribe({
      next: (data) => {
        this.sites = data || [];
      },
      error: (error) => {
        console.error('Error loading sites', error);
        this.sites = []; // Ensure sites is initialized even on error
        this.showToast('Error loading sites: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
      }
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.idUser === userId);
    return user ? user.name : 'Unknown';
  }

  getSiteName(siteId: number): string {
    const site = this.sites.find(s => s.idSite === siteId);
    return site ? site.name : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      idUser: [null, [Validators.required]],
      idSite: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      time: [new Date().toTimeString().split(' ')[0].substring(0, 5), [Validators.required]]
    });
  }

  protected populateForm(item: Visit): void {
    const date = item.date instanceof Date
      ? item.date.toISOString().split('T')[0]
      : new Date(item.date).toISOString().split('T')[0];

    this.form.patchValue({
      idUser: item.idUser,
      idSite: item.idSite,
      latitude: item.latitude,
      longitude: item.longitude,
      date: date,
      time: item.time
    });
  }

  protected getItemId(item: Visit): number {
    return item.idVisit;
  }
}
