import { SiteCategoryEnum } from './enums';

export interface Site {
  idSite: number;
  idCity: number; // Foreign key to City
  name: string;
  category: SiteCategoryEnum;
  latitude: number;
  longitude: number;
}
