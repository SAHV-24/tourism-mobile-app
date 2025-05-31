import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { Tag } from '../../models/tag.model';
import { TagService } from '../../services/tag.service';
import { UserService } from '../../services/user.service';
import { FamousService } from '../../services/famous.service';
import { User } from '../../models/user.model';
import { Famous } from '../../models/famous.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tag-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './tag-admin.component.html',
  styleUrls: ['./tag-admin.component.scss']
})
export class TagAdminComponent extends BaseAdminComponent<Tag> implements OnInit {
  users: User[] = [];
  famousPeople: Famous[] = [];

  constructor(
    protected tagService: TagService,
    private userService: UserService,
    private famousService: FamousService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController,
    protected override authService: AuthService
  ) {
    super(tagService, fb, alertController, toastController, authService);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadUsers();
    this.loadFamousPeople();
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

  loadFamousPeople() {
    this.famousService.getAll().subscribe({
      next: (data) => {
        this.famousPeople = data || [];
      },
      error: (error) => {
        console.error('Error loading famous people', error);
        this.famousPeople = []; // Ensure famousPeople is initialized even on error
        this.showToast('Error loading famous people: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
      }
    });
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u._id === userId);
    return user ? user.nombre : 'Unknown';
  }

  getFamousName(famousId: string): string {
    const famous = this.famousPeople.find(f => f._id === famousId);
    return famous ? famous.nombre : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      idUser: [null, [Validators.required]],
      idFamous: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      photoUrl: ['', [Validators.required]],
      comment: ['']
    });
  }

  protected populateForm(item: Tag): void {
    const date = item.fecha;

    this.form.patchValue({
      idUser: item.usuario._id,
      idFamous: item.famoso._id,
      latitude: item.latitud,
      longitude: item.longitud,
      date: date,
      photoUrl: item.fotoUrl,
      comment: item.comentario
    });
  }

  protected getItemId(item: Tag): string {
    return item._id;
  }
}
