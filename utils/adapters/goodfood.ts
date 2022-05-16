import axios from "axios";
import cheerio from "cheerio";
import { Recipe, RecipeListItem, Ingredient } from "../types";
import { RecipeSourceConnector } from "../webRecipeConnector";

const recipeListPage = "https://www.makegoodfood.ca/en/recipes";

const getRecipesList = async (
  recipeSubstringsDenyList: string[]
): Promise<RecipeListItem[]> => {
  const listPageResponse = await axios.get(recipeListPage);

  const $ = cheerio.load(listPageResponse.data);

  const mealLabels = $(
    ".below-classic_meals .col-sm-6 .recipeofweek-box .recipeofweek-title a"
  )
    .toArray()
    // @ts-ignore cheerio broken typing
    .map((x) => x.children[0].data);
  const mealTitles = [];
  const mealDetails = [];
  for (let i = 0; i < mealLabels.length; i += 2) {
    mealTitles.push(mealLabels[i]);
    mealDetails.push(mealLabels[i + 1]);
  }

  const mealImages = $(
    ".below-classic_meals .col-sm-6 .recipeofweek-box .onmenu-link img"
  )
    .toArray()
    .map((x: cheerio.TagElement) => x.attribs["src"]);

  const mealLinks = $(
    ".below-classic_meals .col-sm-6 .recipeofweek-box .onmenu-link"
  )
    .toArray()
    .map((x: cheerio.TagElement) => x.attribs["href"]);

  const meals: { [key: string]: RecipeListItem } = {};
  for (let i = 0; i < mealTitles.length; i++) {
    meals[mealTitles[i]] = {
      title: mealTitles[i],
      detail: mealDetails[i],
      image: mealImages[i],
      link: mealLinks[i],
    };
  }

  const mealsNotInDenyList = {};
  for (const mealKey of Object.keys(meals)) {
    let excludeMeal = false;
    for (const removeSubstring of recipeSubstringsDenyList) {
      if (
        meals[mealKey].title
          .toLowerCase()
          .includes(removeSubstring.toLowerCase()) ||
        meals[mealKey].detail
          .toLowerCase()
          .includes(removeSubstring.toLowerCase())
      ) {
        excludeMeal = true;
        break;
      }
    }

    if (excludeMeal) {
      continue;
    }

    mealsNotInDenyList[mealKey] = meals[mealKey];
  }

  return Object.values(mealsNotInDenyList);
};

const getRecipe = async (url: string): Promise<Recipe> => {
  const response = await axios.get(url);

  // eslint-disable-next-line require-jsdoc
  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }

  const $ = cheerio.load(response.data);

  let name = $("h1").text();
  name = name.substring(0, name.length / 2);

  const ingredients = $(".ingred span")
    .toArray()
    .map((x) => {
      const ingredientText = ($(x)[0] as any).children[0].data;
      const cleanedIngredient = ingredientText
        ?.replace(/\n/g, "")
        .replace(/\s\s+/g, " ")
        .trim();
      return cleanedIngredient;
    })
    .filter(notEmpty);

  const ingredientFrom = (ingredient: string): Ingredient => {
    const splitIngredient = ingredient.split(" ");
    const fallbackIngredient = {
      nameFull: ingredient,
      nameBase: ingredient,
      nameQuantity: undefined,
    };

    if (splitIngredient.length < 2) return fallbackIngredient;

    let quantity = 0;
    let quantityLabel: string | undefined = undefined;
    if (splitIngredient[0].substring(splitIngredient.length - 1) === "g") {
      const supposedNumber = splitIngredient[0].substring(
        0,
        splitIngredient[0].length - 1
      );
      if (Number.isNaN(Number(supposedNumber))) return fallbackIngredient;

      quantity = Number(supposedNumber);
      quantityLabel = splitIngredient[0].substring(splitIngredient.length);
    } else {
      const supposedNumber = splitIngredient[0];
      if (Number.isNaN(Number(supposedNumber))) return fallbackIngredient;

      quantity = Number(supposedNumber);
    }

    return {
      nameFull: ingredient,
      nameBase: splitIngredient.slice(1).join(" "),
      nameQuantity: {
        quantity,
        quantityLabel,
      },
    };
  };

  return {
    name,
    url,
    ingredients: ingredients.map((ingredient) => ingredientFrom(ingredient)),
  };
};

export default {
  getRecipe,
  getRecipesList,
} as RecipeSourceConnector;
