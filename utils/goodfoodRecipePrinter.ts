import { GoodfoodRecipe } from "./types"

const writeGroceryList = (recipes: GoodfoodRecipe[]) => {
  const allIngredients: string[] = []
  const removedIngredients: string[] = []

  const removeSubstrings = [
    'spice blend',
    'garlic clove',
    'vinegar',
    'jasmine rice',
    'demi-glace',
    'ginger',
    'vinaigrette',
    'mirin',
    'soy sauce',
    'peanuts',
    'rice',
    'pine nut',
  ]

  const substringSortWeights: [string, number][] = [
    [ 'dough', 1000],
    [ 'rigatoni', 2000],
    [ 'spinach', 3000 ],
    [ 'lettuce', 4000 ],
    [ 'lemon', 4500 ],
    [ 'apple', 4750 ],
    [ '1 tomato', 5000 ],
    [ '2 tomato', 6000 ],
    [ 'brussels', 7000 ],
    [ 'radishes', 8000 ],
    [ 'chives', 9000 ],
    [ 'scallion', 10000 ],
    [ 'cilantro', 11000 ],
    [ 'celery', 11500 ],
    [ 'cucumber', 12000 ],
    [ 'kale', 12500 ],
    [ 'broccoli', 13000 ],
    [ 'cherry tomatoes', 14000 ],
    [ 'shallot', 15000 ],
    [ 'onion', 16000 ],
    [ 'potato', 16250 ],
    [ 'squash', 16500 ],
    [ 'carrot', 17000 ],
    [ 'peppers', 18000 ],
    [ 'mushroom', 19000 ],
    [ 'cauliflower', 20000 ],
    [ 'string bean', 20500 ],
    [ 'choy', 21000 ],
    [ 'salmon', 22000 ],
    [ 'tofu', 22500 ],
    [ 'mignons', 22500 ],
    [ 'beef', 23000 ],
    [ 'pork', 24000 ],
    [ 'chicken', 25000 ],
    [ 'cheddar', 26000 ],
    [ 'sour cream', 27000 ],
    [ 'cream', 28000 ],
    [ 'milk', 29000 ],
    [ 'labneh', 30000 ],
    [ 'tomato paste', 31000 ],
    [ 'peas', 32000 ],
  ]

  recipes.forEach(recipe => recipe.ingredients.forEach(ingredient => {
    if (new RegExp(removeSubstrings.join("|")).test(ingredient.nameFull.toLowerCase()))
      removedIngredients.push(ingredient.nameFull)
    else
      allIngredients.push(ingredient.nameFull)
  }))

  let content = `## Grocery List\n`
  allIngredients
    .map((ingredient: string): { ingredient: string, weight: number } => {
      let weight = 100000
      const relevantSubstringsAndWeights = substringSortWeights
        .filter(substringAndWeight => ingredient.toLowerCase().includes(substringAndWeight[0]))

      if (relevantSubstringsAndWeights.length != 0)
        weight = relevantSubstringsAndWeights[0][1]

      return { ingredient, weight }
    })
    .sort((a, b) => a.weight - b.weight)
    .forEach(ingredient => content += `- [ ] ${ingredient.ingredient} - ${ingredient.weight}\n`)
  
  return `${content}\n`
}

const writeRecipes = (recipes: GoodfoodRecipe[]) => {
  let content = `## Recipes\n`
  recipes.forEach(recipe => {
    content += `### [${recipe.name}](${recipe.url})\n`
    recipe.ingredients.forEach(ingredient => content += ` * ${ingredient.nameFull}\n`)
  })

  return `${content}`
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