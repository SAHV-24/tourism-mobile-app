export interface Tag {
  idTag: number;
  idUser: number; // Foreign key to User
  idFamous: number; // Foreign key to Famous
  latitude: number;
  longitude: number;
  date: Date;
  photoUrl: string;
  comment: string | null; // Nullable field
}
