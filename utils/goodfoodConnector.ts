import axios from 'axios'
import cheerio from 'cheerio'
import { GoodfoodRecipe, Ingredient } from './types'

const getRecipes = async (urls: string[]): Promise<GoodfoodRecipe[]> => {
  const recipes: GoodfoodRecipe[] = []
  await Promise.all(urls.map(async (url) => {
    const response = await axios.get(url)
    function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
      return value !== null && value !== undefined;
    }

    const $ = cheerio.load(response.data)

    let name = $('h1').text()
    name = name.substring(0, name.length/2)

    let ingredients = $('.ingred span').toArray().map((x) => {
      const ingredientText = ($(x)[0] as any).children[0].data
      const cleanedIngredient = ingredientText?.replace(/\n/g, '').replace(/\s\s+/g, ' ').trim()
      return cleanedIngredient
    }).filter(notEmpty)

    const ingredientFrom = (ingredient: string): Ingredient => {
      const splitIngredient = ingredient.split(' ')
      const fallbackIngredient = {
        nameFull: ingredient,
        nameBase: ingredient,
        nameQuantity: undefined,
      }

      if (splitIngredient.length < 2)
        return fallbackIngredient
      
      let quantity = 0
      let quantityLabel: string | undefined = undefined
      if (splitIngredient[0].substring(splitIngredient.length-1) === 'g') {
        const supposedNumber = splitIngredient[0].substring(0, splitIngredient[0].length - 1)
        if (Number.isNaN(Number(supposedNumber)))
          return fallbackIngredient
        
        quantity = Number(supposedNumber)
        quantityLabel = splitIngredient[0].substring(splitIngredient.length)
      } else {
        const supposedNumber = splitIngredient[0]
        if (Number.isNaN(Number(supposedNumber)))
          return fallbackIngredient
        
        quantity = Number(supposedNumber)
      }
           
      return {
        nameFull: ingredient,
        nameBase: splitIngredient.slice(1).join(' '),
        nameQuantity: {
          quantity,
          quantityLabel,
        },
      }
    }

    recipes.push({
      name,
      url,
      ingredients: ingredients.map(ingredient => ingredientFrom(ingredient))
    })
  }))

  return recipes
}

export default {
  getRecipes,
}