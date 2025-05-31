import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { Dish } from '../../models/dish.model';
import { DishService } from '../../services/dish.service';
import { SiteService } from '../../services/site.service';
import { Site } from '../../models/site.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dish-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  template: `
    <div class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ isEditing ? 'Edit Dish' : 'Add Dish' }}</ion-card-title>
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
                    <ion-label position="floating">Price</ion-label>
                    <ion-input formControlName="price" type="number" step="0.01"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('price')?.invalid && form.get('price')?.touched">
                      Price is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Photo URL</ion-label>
                    <ion-input formControlName="photoUrl" type="text"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('photoUrl')?.invalid && form.get('photoUrl')?.touched">
                      Photo URL is required
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
                <ion-card-title>Dishes</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item *ngIf="isLoading">
                    <ion-label>Loading...</ion-label>
                    <ion-spinner name="dots"></ion-spinner>
                  </ion-item>

                  <ion-item *ngIf="!isLoading && items.length === 0">
                    <ion-label>No dishes found</ion-label>
                  </ion-item>

                  <ion-item *ngFor="let dish of items">
                    <ion-label>
                      <h2>{{ dish.name }}</h2>
                      <p>Site: {{ getSiteName(dish.idSite) }}</p>
                      <p>Price: {{ dish.price | currency }}</p>
                    </ion-label>
                    <ion-buttons slot="end">
                      <ion-button (click)="editItem(dish)">
                        <ion-icon name="create-outline"></ion-icon>
                      </ion-button>
                      <ion-button (click)="confirmDelete(dish)">
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
    </div>
  `
})
export class DishAdminComponent extends BaseAdminComponent<Dish> {
  sites: Site[] = [];

  constructor(
    protected dishService: DishService,
    private siteService: SiteService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController,
    protected override authService: AuthService
  ) {
    super(dishService, fb, alertController, toastController, authService);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadSites();
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
      },
      complete: () => {
        // Ensure the form is updated with the latest sites
        if (this.form.get('idSite')?.value && !this.sites.some(s => s.idSite === this.form.get('idSite')?.value)) {
          this.form.get('idSite')?.setValue(null);
        }
      }
    });
  }

  getSiteName(siteId: number): string {
    const site = this.sites.find(s => s.idSite === siteId);
    return site ? site.name : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      idSite: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      photoUrl: ['', [Validators.required]]
    });
  }

  protected populateForm(item: Dish): void {
    this.form.patchValue({
      name: item.name,
      idSite: item.idSite,
      price: item.price,
      photoUrl: item.photoUrl
    });
  }

  protected getItemId(item: Dish): number {
    return item.idDish;
  }
}
