import { Recipe } from "@/types";
const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    // <div className="flex flex-col bg-white items-center gap-2 text-sm rounded-lg px-4 py-12 h-full shadow-md">
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold px-4">{recipe.title}</h1>
      <div className="flex flex-col xl:flex-row gap-4 w-full h-full pt-6 pb-4 xl:pb-12 px-4">
        <div className="flex flex-col xl:w-1/3 gap-2">
          <h1 className="text-lg font-bold ">Ingredients</h1>
          <div className="flex flex-col gap-2 h-full overflow-y-scroll">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{ingredient.quantity}</span>
                {ingredient.range_end && <span> - {ingredient.range_end}</span>}
                <span>{ingredient.unit}</span>
                <span>{ingredient.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col xl:w-2/3 gap-2">
          <h1 className="text-lg font-bold ">Instructions</h1>
          <div className="flex flex-col gap-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {recipe.instructions.map((instruction, index) => (
              <div key={index}>
                <span>{index + 1}.</span>
                <span>{instruction}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecipeCard;
