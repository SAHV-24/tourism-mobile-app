import { Component } from '@angular/core';
import { AuthService } from './services';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/home', icon: 'home' },
    { title: 'Admin', url: '/admin', icon: 'settings' },
    { title: 'Tags', url: '/tags', icon: 'pricetag' },
    { title: 'Sites', url: '/user/sites', icon: 'location' },
    { title: 'Favorites', url: '/user/favorites', icon: 'heart' },
    { title: 'Routes', url: '/user/routes', icon: 'map' },
  ];

  constructor(public authService: AuthService) {}

  public get filteredAppPages() {
    if (this.authService.isAdmin()) {
      return this.appPages;
    }
    return this.appPages.filter(page => page.url !== '/admin');
  }

  logout() {
    this.authService.logout();
  }
}
