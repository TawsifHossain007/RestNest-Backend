import { PropertyStatus } from "../../../generated/prisma/enums";

export interface ICreatePropertyPayload {
  categoryId: string;      
  title: string;
  description: string;

  address: string;
  city: string;

  price: number;           

  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: number;

  amenities?: string[];    
  images?: string[];       

  status?: PropertyStatus; 
}

export interface IUpdatePropertyPayload {
  categoryId: string;      
  title: string;
  description: string;

  address: string;
  city: string;

  price: number;           

  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: number;

  amenities?: string[];    
  images?: string[];       

  status?: PropertyStatus; 
}