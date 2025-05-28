import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { Tag } from '../../models/tag.model';
import { TagService } from '../../services/tag.service';
import { UserService } from '../../services/user.service';
import { FamousService } from '../../services/famous.service';
import { User } from '../../models/user.model';
import { Famous } from '../../models/famous.model';

@Component({
  selector: 'app-tag-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  template: `
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ isEditing ? 'Edit Tag' : 'Add Tag' }}</ion-card-title>
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
                    <ion-label position="floating">Famous Person</ion-label>
                    <ion-select formControlName="idFamous">
                      <ion-select-option *ngFor="let famous of famousPeople" [value]="famous.idFamous">
                        {{ famous.name }}
                      </ion-select-option>
                    </ion-select>
                    <ion-note slot="error" *ngIf="form.get('idFamous')?.invalid && form.get('idFamous')?.touched">
                      Famous person is required
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
                    <ion-label position="floating">Photo URL</ion-label>
                    <ion-input formControlName="photoUrl" type="text"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('photoUrl')?.invalid && form.get('photoUrl')?.touched">
                      Photo URL is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Comment</ion-label>
                    <ion-textarea formControlName="comment" rows="3"></ion-textarea>
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
                <ion-card-title>Tags</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item *ngIf="isLoading">
                    <ion-label>Loading...</ion-label>
                    <ion-spinner name="dots"></ion-spinner>
                  </ion-item>

                  <ion-item *ngIf="!isLoading && items.length === 0">
                    <ion-label>No tags found</ion-label>
                  </ion-item>

                  <ion-item *ngFor="let tag of items">
                    <ion-label>
                      <h2>Tag #{{ tag.idTag }}</h2>
                      <p>User: {{ getUserName(tag.idUser) }}</p>
                      <p>Famous Person: {{ getFamousName(tag.idFamous) }}</p>
                      <p>Location: {{ tag.latitude }}, {{ tag.longitude }}</p>
                      <p>Date: {{ tag.date | date:'mediumDate' }}</p>
                      <p *ngIf="tag.comment">Comment: {{ tag.comment }}</p>
                    </ion-label>
                    <ion-buttons slot="end">
                      <ion-button (click)="editItem(tag)">
                        <ion-icon name="create-outline"></ion-icon>
                      </ion-button>
                      <ion-button (click)="confirmDelete(tag)">
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
export class TagAdminComponent extends BaseAdminComponent<Tag> implements OnInit {
  users: User[] = [];
  famousPeople: Famous[] = [];

  constructor(
    protected tagService: TagService,
    private userService: UserService,
    private famousService: FamousService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController
  ) {
    super(tagService, fb, alertController, toastController);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadUsers();
    this.loadFamousPeople();
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

  loadFamousPeople() {
    this.famousService.getAll().subscribe({
      next: (data) => {
        this.famousPeople = data || [];
      },
      error: (error) => {
        console.error('Error loading famous people', error);
        this.famousPeople = []; // Ensure famousPeople is initialized even on error
        this.showToast('Error loading famous people: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
      }
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.idUser === userId);
    return user ? user.name : 'Unknown';
  }

  getFamousName(famousId: number): string {
    const famous = this.famousPeople.find(f => f.idFamous === famousId);
    return famous ? famous.name : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      idUser: [null, [Validators.required]],
      idFamous: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      photoUrl: ['', [Validators.required]],
      comment: ['']
    });
  }

  protected populateForm(item: Tag): void {
    const date = item.date instanceof Date
      ? item.date.toISOString().split('T')[0]
      : new Date(item.date).toISOString().split('T')[0];

    this.form.patchValue({
      idUser: item.idUser,
      idFamous: item.idFamous,
      latitude: item.latitude,
      longitude: item.longitude,
      date: date,
      photoUrl: item.photoUrl,
      comment: item.comment
    });
  }

  protected getItemId(item: Tag): number {
    return item.idTag;
  }
}
