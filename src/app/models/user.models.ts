// user.models.ts

export interface User {
    uid: string;
    email: string;
    password: string;
    name: string;
  }
  
  export interface User2 {
    uid: string;
    email: string;
    name: string;
  }
  
  export interface CategoryData {
    fechas: string[];
    valores: string[];
  }
  
  export interface UserCategories {
    [categoria: string]: CategoryData;
  }
  