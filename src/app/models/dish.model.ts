export interface Dish {
  idDish: number;
  idSite: number; // Foreign key to Site
  name: string;
  price: number;
  photoUrl: string;
}
