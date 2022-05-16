import { Recipe, RecipeListItem } from "./types";
import GoodfoodConnector from "./adapters/goodfood";

export interface RecipeSourceConnector {
  getRecipesList: (
    recipeSubstringsDenyList: string[]
  ) => Promise<RecipeListItem[]>;
  getRecipe: (urls: string) => Promise<Recipe>;
}

const recipeSources: { [key: string]: RecipeSourceConnector } = {
  goodfood: GoodfoodConnector,
};

export const getRecipesList = async (
  sources: string[],
  recipeSubstringsDenyList: string[]
): Promise<{ [key: string]: RecipeListItem[] }> => {
  const recipesLists: { [key: string]: RecipeListItem[] } = {};

  await Promise.all(
    sources
      .filter((source) => source in recipeSources)
      .map(async (source) => {
        const recipesList = await recipeSources[source].getRecipesList(
          recipeSubstringsDenyList
        );

        recipesLists[source] = recipesList;
      })
  );

  return recipesLists;
};

export const getRecipes = async (
  urlInfos: { source: string; url: string }[]
): Promise<Recipe[]> =>
  await Promise.all(
    urlInfos
      .filter((urlInfo) => urlInfo.source in recipeSources && urlInfo.url)
      .map(
        async (urlInfo) =>
          await recipeSources[urlInfo.source].getRecipe(urlInfo.url)
      )
  );
