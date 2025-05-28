import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserRoleEnum } from '../../models/enums';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  template: `
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ isEditing ? 'Edit User' : 'Add User' }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <form [formGroup]="form" (ngSubmit)="isEditing ? updateItem() : createItem()">
                  <ion-item>
                    <ion-label position="floating">Name</ion-label>
                    <ion-input formControlName="name" type="text"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
                      Name is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Username</ion-label>
                    <ion-input formControlName="username" type="text"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('username')?.invalid && form.get('username')?.touched">
                      Username is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Email</ion-label>
                    <ion-input formControlName="email" type="email"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
                      Valid email is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Password</ion-label>
                    <ion-input formControlName="password" type="password"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
                      Password is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Role</ion-label>
                    <ion-select formControlName="role">
                      <ion-select-option *ngFor="let role of roles" [value]="role">
                        {{ role }}
                      </ion-select-option>
                    </ion-select>
                    <ion-note slot="error" *ngIf="form.get('role')?.invalid && form.get('role')?.touched">
                      Role is required
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
                <ion-card-title>Users</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item *ngIf="isLoading">
                    <ion-label>Loading...</ion-label>
                    <ion-spinner name="dots"></ion-spinner>
                  </ion-item>

                  <ion-item *ngIf="!isLoading && items.length === 0">
                    <ion-label>No users found</ion-label>
                  </ion-item>

                  <ion-item *ngFor="let user of items">
                    <ion-label>
                      <h2>{{ user.name }}</h2>
                      <p>Username: {{ user.username }}</p>
                      <p>Email: {{ user.email }}</p>
                      <p>Role: {{ user.role }}</p>
                    </ion-label>
                    <ion-buttons slot="end">
                      <ion-button (click)="editItem(user)">
                        <ion-icon name="create-outline"></ion-icon>
                      </ion-button>
                      <ion-button (click)="confirmDelete(user)">
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
export class UserAdminComponent extends BaseAdminComponent<User> {
  roles = Object.values(UserRoleEnum);

  constructor(
    protected userService: UserService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController
  ) {
    super(userService, fb, alertController, toastController);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: [UserRoleEnum.USER, [Validators.required]]
    });
  }

  protected populateForm(item: User): void {
    this.form.patchValue({
      name: item.name,
      username: item.username,
      email: item.email,
      password: item.password,
      role: item.role
    });
  }

  protected getItemId(item: User): number {
    return item.idUser;
  }
}
