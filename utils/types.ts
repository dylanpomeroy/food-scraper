export interface GoodfoodRecipe {
  name: string
  url: string
  ingredients: Ingredient[]
}

export interface Ingredient {
  nameFull: string
  nameBase: string
  nameQuantity: {
    quantity: number
    quantityLabel: string
  }
}

export interface GoodfoodRecipeListItem {
  title: string
  detail: string
  image: string
  link: string
}

export interface SettingsData {
  removeSubstrings: string[];
  sortSubstrings: [ string, number ][]
}
