export interface Recipe {
  name: string;
  url: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  nameFull: string;
  nameBase: string;
  nameQuantity: {
    quantity: number;
    quantityLabel: string;
  };
}

export interface RecipeListItem {
  title: string;
  detail: string;
  image: string;
  link: string;
}

export interface SettingsData {
  recipeSubstringsDenyList: string[];
  removeSubstrings: string[];
  orderSubstrings: string[];
}
