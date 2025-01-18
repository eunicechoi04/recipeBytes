import { Recipe } from "@/types";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const days_ago = Math.floor(
    (new Date().getTime() - new Date(recipe.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="flex flex-col bg-white border rounded-lg gap-2 px-4 py-4 overflow-hidden">
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg">{recipe.title}</h1>
          <p>{recipe.description}</p>
        </div>
        <div className="flex flex-col items-end">
          <span>{days_ago} days ago</span>
        </div>
      </div>
      <div className="flex gap-4">
        <p>Tags:</p>
        {recipe.tags.map((tag: string) => (
          <span
            key={tag}
            className="border border-blue-500 px-3 py-1 rounded-xl"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecipeCard;
