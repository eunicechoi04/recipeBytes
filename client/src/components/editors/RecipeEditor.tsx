import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import IngredientEditor from "./IngredientEditor";
import DirectionEditor from "./DirectionEditor";

interface RecipeData {
  title: string;
  tagged_ingredients: Array<{
    quantity: number;
    range_end: number;
    unit: string;
    name: string;
    comment: string;
  }>;
  instructions: string[];
}

interface RecipeEditorProps {
  recipeData: RecipeData;
  onRecipeChange: (updatedRecipe: RecipeData) => void;
}

const RecipeEditor = ({ recipeData, onRecipeChange }: RecipeEditorProps) => {
  const [title, setTitle] = useState(recipeData.title);
  const [ingredients, setIngredients] = useState(recipeData.tagged_ingredients);
  const [directions, setDirections] = useState(recipeData.instructions);

  // handlers
  const handleTitleChange = (e: { target: { value: any } }) => {
    setTitle(e.target.value);
    onRecipeChange({ ...recipeData, title: e.target.value });
  };

  const handleIngredientsChange = useCallback(
    (
      updatedIngredients: {
        quantity: number;
        range_end: number;
        unit: string;
        name: string;
        comment: string;
      }[]
    ) => {
      setIngredients(updatedIngredients);
      onRecipeChange({ ...recipeData, tagged_ingredients: updatedIngredients });
    },
    [recipeData, onRecipeChange]
  );

  const handleAddIngredient = () => {
    const newIngredient = {
      quantity: 0,
      range_end: 0,
      unit: "",
      name: "",
      comment: "",
    };
    handleIngredientsChange([...ingredients, newIngredient]);
  };

  const handleDeleteIngredient = useCallback(
    (index: number) => {
      const newIngredients = [...ingredients].filter((_, i) => i !== index);
      handleIngredientsChange(newIngredients);
    },
    [ingredients, handleIngredientsChange]
  );

  const handleDirectionsChange = (updatedDirections) => {
    setDirections(updatedDirections);
    onRecipeChange({ ...recipeData, instructions: updatedDirections });
  };

  const handleAddDirection = () => {
    const newDirection = "";
    handleDirectionsChange([...directions, newDirection]);
  };

  const handleDeleteDirection = useCallback(
    (index: number) => {
      const newDirections = [...directions].filter((_, i) => i !== index);
      handleDirectionsChange(newDirections);
    },
    [ingredients, handleIngredientsChange]
  );

  return (
    <div className="flex flex-col bg-white items-center gap-2 text-sm rounded-lg px-6 py-6 shadow-md h-full">
      <label className="font-bold text-left w-full text-lg">Title</label>
      <input
        placeholder="Enter recipe title"
        onChange={handleTitleChange}
        value={title}
        className="border rounded p-2 w-full"
      />
      <label className="font-bold text-left w-full text-lg">Ingredients</label>
      <div className="flex flex-col gap-2 border rounded-lg p-2 w-full max-h-[30%] overflow-y-scroll">
        {ingredients.map((ingredient, index) => (
          <IngredientEditor
            key={index}
            index={index}
            ingredient={ingredient}
            onIngredientChange={(updatedIngredient: {
              quantity: number;
              range_end: number;
              unit: string;
              name: string;
              comment: string;
            }) => {
              const newIngredients = [...ingredients];
              newIngredients[index] = updatedIngredient;
              handleIngredientsChange(newIngredients);
            }}
            onDelete={handleDeleteIngredient}
          />
        ))}
      </div>
      <button
        className="p-2 px-6 bg-gray-100 rounded-md w-[60%]"
        onClick={handleAddIngredient}
      >
        Add Ingredient
      </button>
      <label className="font-bold text-left w-full text-lg">
        Directions<span className="text-red-500"></span>
      </label>
      <div className="flex flex-col gap-2 border rounded-lg p-2 w-full max-h-[30%] overflow-y-scroll">
        {directions.map((direction, index) => (
          <DirectionEditor
            key={index}
            index={index}
            direction={direction}
            onDirectionChange={(updatedDirection: string) => {
              const newDirections = [...directions];
              newDirections[index] = updatedDirection;
              handleDirectionsChange(newDirections);
            }}
            onDelete={handleDeleteDirection}
          />
        ))}
      </div>
      <button
        className="p-2 px-6 bg-gray-100 rounded-md w-[60%]"
        onClick={handleAddDirection}
      >
        Add Direction
      </button>
    </div>
  );
};
export default RecipeEditor;
