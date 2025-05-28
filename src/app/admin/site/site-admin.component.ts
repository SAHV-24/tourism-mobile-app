import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { Site } from '../../models/site.model';
import { City } from '../../models/city.model';
import { SiteService } from '../../services/site.service';
import { CityService } from '../../services/city.service';
import { SiteCategoryEnum } from '../../models/enums';

@Component({
  selector: 'app-site-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  template: `
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ isEditing ? 'Edit Site' : 'Add Site' }}</ion-card-title>
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
                    <ion-label position="floating">City</ion-label>
                    <ion-select formControlName="idCity">
                      <ion-select-option *ngFor="let city of cities" [value]="city.idCity">
                        {{ city.name }}
                      </ion-select-option>
                    </ion-select>
                    <ion-note slot="error" *ngIf="form.get('idCity')?.invalid && form.get('idCity')?.touched">
                      City is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Category</ion-label>
                    <ion-select formControlName="category">
                      <ion-select-option *ngFor="let category of categories" [value]="category">
                        {{ category }}
                      </ion-select-option>
                    </ion-select>
                    <ion-note slot="error" *ngIf="form.get('category')?.invalid && form.get('category')?.touched">
                      Category is required
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
                <ion-card-title>Sites</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item *ngIf="isLoading">
                    <ion-label>Loading...</ion-label>
                    <ion-spinner name="dots"></ion-spinner>
                  </ion-item>

                  <ion-item *ngIf="!isLoading && items.length === 0">
                    <ion-label>No sites found</ion-label>
                  </ion-item>

                  <ion-item *ngFor="let site of items">
                    <ion-label>
                      <h2>{{ site.name }}</h2>
                      <p>City: {{ getCityName(site.idCity) }}</p>
                      <p>Category: {{ site.category }}</p>
                      <p>Location: {{ site.latitude }}, {{ site.longitude }}</p>
                    </ion-label>
                    <ion-buttons slot="end">
                      <ion-button (click)="editItem(site)">
                        <ion-icon name="create-outline"></ion-icon>
                      </ion-button>
                      <ion-button (click)="confirmDelete(site)">
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
export class SiteAdminComponent extends BaseAdminComponent<Site> implements OnInit {
  cities: City[] = [];
  categories = Object.values(SiteCategoryEnum);

  constructor(
    protected siteService: SiteService,
    private cityService: CityService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController
  ) {
    super(siteService, fb, alertController, toastController);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadCities();
  }

  loadCities() {
    this.cityService.getAll().subscribe({
      next: (data) => {
        this.cities = data || [];
      },
      error: (error) => {
        console.error('Error loading cities', error);
        this.cities = []; // Ensure cities is initialized even on error
        this.showToast('Error loading cities: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
      },
      complete: () => {
        // Ensure the form is updated with the latest cities
        if (this.form.get('idCity')?.value && !this.cities.some(c => c.idCity === this.form.get('idCity')?.value)) {
          this.form.get('idCity')?.setValue(null);
        }
      }
    });
  }

  getCityName(cityId: number): string {
    const city = this.cities.find(c => c.idCity === cityId);
    return city ? city.name : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      idCity: [null, [Validators.required]],
      category: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]]
    });
  }

  protected populateForm(item: Site): void {
    this.form.patchValue({
      name: item.name,
      idCity: item.idCity,
      category: item.category,
      latitude: item.latitude,
      longitude: item.longitude
    });
  }

  protected getItemId(item: Site): number {
    return item.idSite;
  }
}
