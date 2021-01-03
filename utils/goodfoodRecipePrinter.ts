import { GoodfoodRecipe } from "./types"

const writeGroceryList = (recipes: GoodfoodRecipe[]) => {
  const allIngredients: string[] = []
  const removedIngredients: string[] = []

  const removeSubstrings = [
    'spice blend',
    'garlic clove',
    'balsamic vinegar',
    'wine vinegar',
    'jasmine rice',
    'demi-glace',
    'ginger',
  ]

  recipes.forEach(recipe => recipe.ingredients.forEach(ingredient => {
    if (new RegExp(removeSubstrings.join("|")).test(ingredient.nameFull.toLowerCase()))
      removedIngredients.push(ingredient.nameFull)
    else
      allIngredients.push(ingredient.nameFull)
  }))

  let content = `## Grocery List\n`
  allIngredients
    .forEach(ingredient => content += `- [ ] ${ingredient}\n`)
  removedIngredients
    .forEach(ingredient => content += `- [ ] ~~${ingredient}~~\n`)
  
  return `${content}\n`
}

const writeRecipes = (recipes: GoodfoodRecipe[]) => {
  let content = `## Recipes\n`
  recipes.forEach(recipe => {
    content += `### [${recipe.name}](${recipe.url})\n`
    recipe.ingredients.forEach(ingredient => content += ` * ${ingredient.nameFull}\n`)
  })

  return `${content}/n`
}

const getMarkdownPageContent = (recipes: GoodfoodRecipe[], date: string) => {
  let content = `# Goodfood Recipes ${date}\n`
  content += writeGroceryList(recipes)
  content += writeRecipes(recipes)

  return content;
}

export default {
  getMarkdownPageContent,
}