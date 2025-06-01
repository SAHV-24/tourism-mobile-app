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
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-visit-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './visit-admin.component.html',
  styleUrls: ['./visit-admin.component.scss']
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
    protected override toastController: ToastController,
    protected override authService: AuthService
  ) {
    super(visitService, fb, alertController, toastController, authService);
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

  getUserName(user: any): string {
    if (!user) return 'Unknown';
    if (typeof user === 'string') {
      const found = this.users.find(u => u._id === user);
      return found ? found.nombre : user;
    }
    return user.nombre || 'Unknown';
  }

  getSiteName(site: any): string {
    if (!site) return 'Unknown';
    if (typeof site === 'string') {
      const found = this.sites.find(s => s._id === site);
      return found ? found.nombre : site;
    }
    return site.nombre || 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      idUser: [null, [Validators.required]],
      idSite: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      fechaYHora: [new Date().toISOString(), [Validators.required]]
    });
  }

  protected populateForm(item: Visit): void {
    this.form.patchValue({
      idUser: item.usuario,
      idSite: item.sitio,
      latitude: item.latitud,
      longitude: item.longitud,
      fechaYHora: item.fechaYHora ? new Date(item.fechaYHora).toISOString() : new Date().toISOString()
    });
  }

  protected getItemId(item: Visit): string {
    return item._id ?? '';
  }

  override createItem() {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    const newVisit = {
      usuario: formValue.idUser,
      sitio: formValue.idSite,
      latitud: formValue.latitude,
      longitud: formValue.longitude,
      fechaYHora: formValue.fechaYHora
    };
    this.isLoading = true;
    this.service.create(newVisit).subscribe({
      next: () => {
        this.showToast('Visita creada exitosamente', 'success');
        this.form.reset();
        this.isEditing = false;
        this.loadItems();
        this.isLoading = false;
      },
      error: (error) => {
        this.showToast('Error al crear visita: ' + ((error as any).customMessage || error.message || 'Error desconocido'), 'danger');
        this.isLoading = false;
      }
    });
  }

  override updateItem() {
    if (this.form.invalid || !this.currentItem) return;
    const formValue = this.form.value;
    const updatedVisit = {
      usuario: formValue.idUser,
      sitio: formValue.idSite,
      latitud: formValue.latitude,
      longitud: formValue.longitude,
      fechaYHora: formValue.fechaYHora
    };
    this.isLoading = true;
    this.service.update(this.getItemId(this.currentItem), updatedVisit).subscribe({
      next: () => {
        this.showToast('Visita actualizada exitosamente', 'success');
        this.form.reset();
        this.isEditing = false;
        this.loadItems();
        this.isLoading = false;
      },
      error: (error) => {
        this.showToast('Error al actualizar visita: ' + ((error as any).customMessage || error.message || 'Error desconocido'), 'danger');
        this.isLoading = false;
      }
    });
  }
}
