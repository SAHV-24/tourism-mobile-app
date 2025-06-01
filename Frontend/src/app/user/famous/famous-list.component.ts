import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FamousService } from 'src/app/services/famous.service';

@Component({
  selector: 'app-famous-list',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './famous-list.component.html',
  styleUrls: ['./famous-list.component.scss']
})
export class FamousListComponent implements OnInit {
  famousList: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private famousService: FamousService) {}

  ngOnInit() {
    this.famousService.getAll().subscribe({
      next: (famous) => {
        this.famousList = famous;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading famous people.';
        this.loading = false;
      }
    });
  }
}
