import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/home', icon: 'home' },
    { title: 'Admin', url: '/admin', icon: 'settings' },
  ];

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
