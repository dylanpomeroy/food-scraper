import { Recipe } from "./types";

export const getGroceryList = (
  recipes: Recipe[],
  removeSubstrings: string[],
  orderSubstrings: string[]
) => {
  const allIngredients: string[] = [];
  const removedIngredients: string[] = [];

  const orderSubstringWeights: [string, number][] = [];
  for (let i = 0; i < orderSubstrings.length; i++) {
    orderSubstringWeights.push([orderSubstrings[i], i]);
  }

  recipes.forEach((recipe) =>
    recipe.ingredients.forEach((ingredient) => {
      if (
        new RegExp(removeSubstrings.join("|")).test(
          ingredient.nameFull.toLowerCase()
        )
      )
        removedIngredients.push(ingredient.nameFull);
      else allIngredients.push(ingredient.nameFull);
    })
  );

  const sortedIngredients = allIngredients
    .map((ingredient: string): { ingredient: string; weight: number } => {
      let weight = Number.MAX_VALUE;
      const relevantSubstringsAndWeights = orderSubstringWeights.filter(
        (substringAndWeight) =>
          ingredient.toLowerCase().includes(substringAndWeight[0])
      );

      if (relevantSubstringsAndWeights.length != 0)
        weight = relevantSubstringsAndWeights[0][1];

      return { ingredient, weight };
    })
    .sort((a, b) => a.weight - b.weight)
    .map((ingredientInfo) => ingredientInfo.ingredient);

  return sortedIngredients;
};

const writeGroceryList = (groceryListItems: string[]) => {
  let content = `## Grocery List\n`;
  groceryListItems.forEach(
    (ingredient) => (content += `- [ ] ${ingredient}\n`)
  );

  return `${content}\n`;
};

const writeRecipes = (recipes: Recipe[]) => {
  let content = `## Recipes\n`;
  recipes.forEach((recipe) => {
    content += `### [${recipe.name}](${recipe.url})\n`;
    recipe.ingredients.forEach(
      (ingredient) => (content += ` * ${ingredient.nameFull}\n`)
    );
  });

  return `${content}`;
};

const getMarkdownPageContent = (
  recipes: Recipe[],
  groceryListItems: string[],
  date: string
) => {
  let content = `# Recipes ${date}\n`;
  content += writeGroceryList(groceryListItems);
  content += writeRecipes(recipes);

  return content;
};

export default {
  getMarkdownPageContent,
  getGroceryList,
};
