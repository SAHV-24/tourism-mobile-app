import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { Famous } from '../../models/famous.model';
import { FamousService } from '../../services/famous.service';
import { CityService } from '../../services/city.service';
import { City } from '../../models/city.model';
import { ActivityEnum } from '../../models/enums';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-famous-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './famous-admin.component.html',
  styleUrls: ['./famous-admin.component.scss']
})
export class FamousAdminComponent extends BaseAdminComponent<Famous> implements OnInit {
  cities: City[] = [];
  activities = Object.values(ActivityEnum);

  constructor(
    protected famousService: FamousService,
    private cityService: CityService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController,
    protected override authService: AuthService
  ) {
    super(famousService, fb, alertController, toastController, authService);
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
        this.cities = [];
        this.showToast('Error loading cities: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
      },
      complete: () => {
        if (this.form.get('idCity')?.value && !this.cities.some(c => c._id === this.form.get('idCity')?.value)) {
          this.form.get('idCity')?.setValue(null);
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
      ciudadNacimiento: [null, [Validators.required]],
      actividad: [null, [Validators.required]],
      foto: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    });
  }

  protected populateForm(item: Famous): void {
    this.form.patchValue({
      nombre: item.nombre,
      ciudadNacimiento: item.ciudadNacimiento,
      actividad: item.actividad,
      foto: item.foto, // item.foto es el campo correcto
      descripcion: item.descripcion
    });
  }

  protected getItemId(item: Famous): string {
    return item._id;
  }
}



