import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { addIcons } from 'ionicons';
var swiper = new Swiper('.mySwiper', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, IonicModule],
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public queryCards = [
    {
      title: 'Top 10 Most Visited Sites',
      description: 'See the top 10 most visited sites by country.',
      route: '/queries/top-sites',
    },
    {
      title: 'Most Tagged Famous People',
      description: 'See the most tagged famous people in the system.',
      route: '/queries/most-tagged-famous',
    },
    {
      title: 'Users with Most Visits',
      description: 'See the users with the most visits.',
      route: '/queries/users-most-visits',
    },
    {
      title: 'Dishes by Unique Users',
      description: 'See dishes tagged/visited by more than N unique users.',
      route: '/queries/dishes-by-unique-users',
    },
    {
      title: 'Dishes by Country & City',
      description: 'See dishes tagged by country and city.',
      route: '/queries/dishes-by-location',
    },
  ];

  constructor() {
    addIcons({arrowForwardOutline: 'arrow-forward-outline', arrowBackOutline: 'arrow-back-outline'});
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
