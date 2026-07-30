export interface IPropertyQuery {
  searchTerm?: string;
  address?: string;
  city?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}