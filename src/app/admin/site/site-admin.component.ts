import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { Site } from '../../models/site.model';
import { City } from '../../models/city.model';
import { SiteService } from '../../services/site.service';
import { CityService } from '../../services/city.service';
import { SiteCategoryEnum } from '../../models/enums';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-site-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './site-admin.component.html',
  styleUrls: ['./site-admin.component.scss']
})
export class SiteAdminComponent extends BaseAdminComponent<Site> implements OnInit {
  cities: City[] = [];
  categories = Object.values(SiteCategoryEnum);

  constructor(
    protected siteService: SiteService,
    private cityService: CityService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController,
    protected override authService: AuthService
  ) {
    super(siteService, fb, alertController, toastController, authService);
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
        if (this.form.get('_id')?.value && !this.cities.some(c => c._id === this.form.get('_id')?.value)) {
          this.form.get('_id')?.setValue(null);
        }
      }
    });
  }

  getCityName(cityId: string): string {
    const city = this.cities.find(c => c._id === cityId);
    return city ? city.nombre : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      ciudad: [null, [Validators.required]],
      tipoSitio: [null, [Validators.required]],
      ubicacion: [null, [Validators.required]]
    });
  }

  protected populateForm(item: Site): void {
    this.form.patchValue({
      nombre: item.nombre,
      ciudad: item.ciudad._id, // Usar el _id de la ciudad
      tipoSitio: item.tipoSitio,
      ubicacion: item.ubicacion
    });
  }

  protected getItemId(item: Site): string {
    return item._id;
  }
}
