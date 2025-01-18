export interface RecipeData {
  title: string;
  tagged_ingredients: Ingredient[];
  instructions: string[];
  recipe_id: string;
}

export interface Ingredient {
  quantity: string;
  range_end: string;
  unit: string;
  name: string;
  comment: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  created_at: string;
}

export interface DirectionEditorProps {
  index: number;
  direction: string;
  onDirectionChange: (newDirection: string) => void;
  onDelete: (index: number) => void;
}

export interface IngredientEditorProps {
  index: number;
  ingredient: Ingredient;
  onIngredientChange: (ingredient: Ingredient) => void;
  onDelete: (index: number) => void;
}

export interface RecipeEditorProps {
  recipeData: RecipeData;
  onRecipeChange: (updatedRecipe: RecipeData) => void;
}
