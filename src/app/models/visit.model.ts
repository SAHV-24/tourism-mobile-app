export interface Visit {
  idVisit: number;
  idUser: number; // Foreign key to User
  idSite: number; // Foreign key to Site
  latitude: number;
  longitude: number;
  date: Date;
  time: string; // Using string for LOCALDATE as specified
}
