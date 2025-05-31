import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserRoleEnum } from '../../models/enums';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './user-admin.component.html',
})
export class UserAdminComponent extends BaseAdminComponent<User> {
  roles = Object.values(UserRoleEnum);

  constructor(
    protected userService: UserService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController,
    protected override authService: AuthService
  ) {
    super(userService, fb, alertController, toastController, authService);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: [UserRoleEnum.USER, [Validators.required]]
    });
  }

  protected populateForm(item: User): void {
    this.form.patchValue({
      name: item.name,
      username: item.username,
      email: item.email,
      password: item.password,
      role: item.role
    });
  }

  protected getItemId(item: User): number {
    return item.idUser;
  }
}
