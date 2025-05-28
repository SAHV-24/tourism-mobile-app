import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-country-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  template: `
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ isEditing ? 'Edit Country' : 'Add Country' }}</ion-card-title>
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
                <ion-card-title>Countries</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item *ngIf="isLoading">
                    <ion-label>Loading...</ion-label>
                    <ion-spinner name="dots"></ion-spinner>
                  </ion-item>

                  <ion-item *ngIf="!isLoading && items.length === 0">
                    <ion-label>No countries found</ion-label>
                  </ion-item>

                  <ion-item *ngFor="let country of items">
                    <ion-label>{{ country.name }}</ion-label>
                    <ion-buttons slot="end">
                      <ion-button (click)="editItem(country)">
                        <ion-icon name="create-outline"></ion-icon>
                      </ion-button>
                      <ion-button (click)="confirmDelete(country)">
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
export class CountryAdminComponent extends BaseAdminComponent<Country> {
  constructor(
    protected countryService: CountryService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController
  ) {
    super(countryService, fb, alertController, toastController);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  protected populateForm(item: Country): void {
    this.form.patchValue({
      name: item.name
    });
  }

  protected getItemId(item: Country): number {
    return item.idCountry;
  }
}
