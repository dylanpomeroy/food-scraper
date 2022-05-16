import { NextApiRequest, NextApiResponse } from "next";
import { getRecipes, getRecipesList } from "../../utils/webRecipeConnector";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
    const recipeSubstringsDenyList = (
      req.query.recipeSubstringsDenyList as string
    )
      .split(",")
      .filter((substring) => !!substring);

    const recipeSources = (req.query.recipeSources as string).split(",");

    const result = await getRecipesList(
      recipeSources,
      recipeSubstringsDenyList
    );
    res.send(result);
  } else if (req.method == "POST") {
    const input = req.body as {
      urlInfo: { source: string; url: string }[];
    };

    const result = await getRecipes(input.urlInfo);
    res.send(result);
  } else {
    return res.send(404);
  }
};
