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
