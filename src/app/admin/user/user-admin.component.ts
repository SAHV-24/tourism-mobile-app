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
  styleUrls: ['./user-admin.component.scss' ]
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
      name: item.nombre,
      username: item.usuario,
      email: item.correo,
      role: item.rol
    });
  }

  protected getItemId(item: User): string {
    return item._id;
  }
}
