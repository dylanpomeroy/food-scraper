
import { NextApiRequest, NextApiResponse } from 'next'
import goodfoodConnector from '../../utils/goodfoodConnector'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.send(404)

  const input = req.body as {
    recipeUrls: string[]
  }

  const result = await goodfoodConnector.getRecipes(input.recipeUrls)
  res.send(result)
}
