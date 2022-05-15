import { Recipe } from "./types";

const writeGroceryList = (
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

  let content = `## Grocery List\n`;
  allIngredients
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
    .forEach((ingredient) => (content += `- [ ] ${ingredient.ingredient}\n`));

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
  date: string,
  removeSubstrings: string[],
  orderSubstrings: string[]
) => {
  let content = `# Recipes ${date}\n`;
  content += writeGroceryList(recipes, removeSubstrings, orderSubstrings);
  content += writeRecipes(recipes);

  return content;
};

export default {
  getMarkdownPageContent,
};
