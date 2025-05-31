import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { Country } from '../../models';
import { CountryService } from '../../services';
import { AuthService } from '../../services';

@Component({
  selector: 'app-country-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './country-admin.component.html'
})
export class CountryAdminComponent extends BaseAdminComponent<Country> {
  constructor(
    protected countryService: CountryService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController,
    protected override authService: AuthService
  ) {
    super(countryService, fb, alertController, toastController, authService);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]]
    });
  }

  protected populateForm(item: Country): void {
    this.form.patchValue({
      nombre: item.nombre
    });
  }

  protected getItemId(item: Country): string {
    return item._id;
  }
}
