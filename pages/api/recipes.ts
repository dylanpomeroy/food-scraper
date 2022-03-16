
import { NextApiRequest, NextApiResponse } from 'next'
import goodfoodConnector from '../../utils/goodfoodConnector'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
    const result = await goodfoodConnector.getRecipesList('https://www.makegoodfood.ca/en/recipes')
    res.send(result)
  }
  else if (req.method == 'POST') {
    const input = req.body as {
      recipeUrls: string[]
    }
  
    const result = await goodfoodConnector.getRecipes(input.recipeUrls)
    res.send(result)
  } else {
    return res.send(404)
  }
}