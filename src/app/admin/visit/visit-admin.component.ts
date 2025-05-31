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

  getUserName(userId: string): string {
    const user = this.users.find(u => u._id === userId);
    return user ? user.nombre : 'Unknown';
  }

  getSiteName(siteId: string): string {
    const site = this.sites.find(s => s._id === siteId);
    return site ? site.nombre : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      idUser: [null, [Validators.required]],
      idSite: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      time: [null, [Validators.required]]
    });
  }

  protected populateForm(item: Visit): void {
    const dateTime = item.fechaYHora;
    let date = null;
    let time = null;
    if (dateTime) {
      const dt = new Date(dateTime);
      date = dt.toISOString().split('T')[0];
      time = dt.toISOString().split('T')[1]?.substring(0,5) || null;
    }
    this.form.patchValue({
      idUser: item.usuario,
      idSite: item.sitio,
      latitude: item.latitud,
      longitude: item.longitud,
      date: date,
      time: time
    });
  }

  protected getItemId(item: Visit): string {
    return item._id;
  }
}
