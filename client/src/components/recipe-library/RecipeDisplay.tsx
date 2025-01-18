"use client";
import { useRouter } from "next/navigation";
import RecipeCard from "./RecipeCard";
import { Plus } from "lucide-react";
const RecipeDisplay = ({ recipes }) => {
  const router = useRouter();

  const handleRecipeClick = (id) => {
    router.push(`/recipe/${id}`);
  };

  return (
    <div className="flex flex-col border p-4 gap-4">
      <div className="flex justify-end items-center gap-6">
        {/* <button className="p-2 px-6 bg-gray-300 text-sm rounded-2xl">
          Select
        </button> */}
        <button
          className="p-2 px-6 bg-gray-300 rounded-2xl"
          onClick={() => router.push("/import")}
        >
          <Plus size={20} />
        </button>
      </div>
      {recipes.length === 0 ? (
        <p>No recipes to display</p>
      ) : (
        recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => handleRecipeClick(recipe.id)}
            className="cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-md hover:shadow-blue-300/30"
          >
            <RecipeCard key={recipe.id} recipe={recipe} />
          </div>
        ))
      )}
    </div>
  );
};

export default RecipeDisplay;
