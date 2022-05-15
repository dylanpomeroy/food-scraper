import { Recipe, RecipeListItem } from "./types";
import GoodfoodConnector from "./goodfoodConnector";

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
  urls: { source: string; url: string }[]
): Promise<Recipe[]> => {
  const recipes: Recipe[] = [];

  await Promise.all();

  return recipes;
};
