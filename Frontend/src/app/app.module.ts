import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app.component';
import { appRouting } from './app-routing.module';
import { authInterceptorFn } from './services/auth.interceptor';
import { environment } from '../environments/environment';

// Bootstrap the standalone AppComponent
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(BrowserModule, IonicModule.forRoot()),
    provideHttpClient(
      withInterceptors([authInterceptorFn])
    ),
    ...appRouting
  ]
});
