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
  templateUrl: './visit-admin.component.html'
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

  getUserName(userId: number): string {
    const user = this.users.find(u => u.idUser === userId);
    return user ? user.name : 'Unknown';
  }

  getSiteName(siteId: number): string {
    const site = this.sites.find(s => s.idSite === siteId);
    return site ? site.name : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      idUser: [null, [Validators.required]],
      idSite: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      time: [new Date().toTimeString().split(' ')[0].substring(0, 5), [Validators.required]]
    });
  }

  protected populateForm(item: Visit): void {
    const date = item.date instanceof Date
      ? item.date.toISOString().split('T')[0]
      : new Date(item.date).toISOString().split('T')[0];

    this.form.patchValue({
      idUser: item.idUser,
      idSite: item.idSite,
      latitude: item.latitude,
      longitude: item.longitude,
      date: date,
      time: item.time
    });
  }

  protected getItemId(item: Visit): number {
    return item.idVisit;
  }
}
