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
  templateUrl: './dish-admin.component.html',
  styleUrls: ['./dish-admin.component.scss']
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
        if (this.form.get('idSite')?.value && !this.sites.some(s => s._id === this.form.get('idSite')?.value)) {
          this.form.get('idSite')?.setValue(null);
        }
      }
    });
  }

  getSiteName(siteId: string): string {
    const site = this.sites.find(s => s._id === siteId);
    return site ? site.nombre : 'Unknown';
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
      name: item.nombre,
      idSite: item._id,
      price: item.precio,
      photoUrl: item.foto
    });
  }

  protected getItemId(item: Dish): string {
    return item._id;
  }
}
