export interface Country {
  _id: string;
  nombre: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;

  // Compatibility properties
  idCountry?: number;
  name?: string;
}
