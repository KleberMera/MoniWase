// data-models.ts

export interface CategoryData {
    fechas: string[];
    valores: string[];
  }
  
  export interface UserCategories {
    [categoria: string]: CategoryData;
  }
  