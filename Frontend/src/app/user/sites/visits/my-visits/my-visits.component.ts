import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { VisitService } from 'src/app/services/visit.service';
import { AuthService } from 'src/app/services/auth.service';
import { SiteService } from 'src/app/services/site.service';
import { Visit } from 'src/app/models/visit.model';
import { Site } from 'src/app/models/site.model';

@Component({
  selector: 'app-my-visits',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './my-visits.component.html',
  styleUrls: ['./my-visits.component.css'],
})
export class MyVisitsComponent implements OnInit {
  visits: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private visitService: VisitService,
    private authService: AuthService,
    private siteService: SiteService
  ) {}

  ngOnInit() {
    const userId = this.authService.currentUserId;
    if (!userId) {
      this.error = 'No se pudo obtener el usuario actual.';
      this.loading = false;
      return;
    }
    this.visitService.getByUserId(userId).subscribe({
      next: (visits) => {
        if (!visits.length) {
          this.visits = [];
          this.loading = false;
          return;
        }
        // Obtener todos los IDs de sitio únicos
        const siteIds = Array.from(new Set(visits.map(v => v.sitio)));
        this.siteService.getAll().subscribe(sites => {
          // Mapear id de sitio a objeto de sitio
          const siteMap: { [id: string]: Site } = {};
          for (const site of sites) {
            siteMap[site._id!] = site;
          }
          // Adjuntar objeto de sitio a cada visita
          this.visits = visits.map(v => ({
            ...v,
            sitioObj: siteMap[v.sitio] || v.sitio
          }));
          this.loading = false;
        });
      },
      error: () => {
        this.error = 'Error al cargar las visitas.';
        this.loading = false;
      }
    });
  }
}
