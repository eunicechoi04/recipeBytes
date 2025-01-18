"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/context/ApiContext";
import NotFound from "@/components/NotFound";
import Loading from "@/components/Loading";
import RecipeCard from "@/components/viewports/RecipeCard";
import Embed from "@/components/viewports/Embed";
// import OriginalRecipe from "@/components/OriginalRecipe";
import RecipeEditor from "@/components/editors/RecipeEditor";
import Tabs from "@/components/Tabs";

const RecipeViewer = ({ params }: { params: { recipe_id: string } }) => {
  const recipe_id = params.recipe_id;
  const [recipeData, setRecipeData] = useState(null);
  const [tempRecipeData, setTempRecipeData] = useState(null);
  const [link, setLink] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState(false);
  const api = useApi();
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api?.get(`/getRecipe/${recipe_id}`);
        setRecipeData({ ...response?.data });
        setTempRecipeData({
          ...response?.data,
          tagged_ingredients: response?.data.ingredients,
        });
        setLink(response?.data.link);
        setVideoUrl(response?.data.video_url);
      } catch (error) {
        setError(true);
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [recipe_id, api]);

  const handleRecipeChange = (updatedRecipe: any) => {
    setTempRecipeData(updatedRecipe);
  };

  if (error) {
    return <NotFound object={"Recipe"} />;
  }
  if (!recipeData) {
    return <Loading />;
  }

  console.log("set the link", videoUrl);
  console.log(recipeData);
  const tab_names = ["Overview", "Original"];
  const components = [
    <RecipeCard key={0} recipe={recipeData} />,
    <Embed key={1} link={videoUrl} />,
  ];
  return (
    <div className="w-screen h-full pt-8 pb-4 xl:p-0 xl:h-[calc(100vh-4rem)] flex justify-center items-center">
      <Tabs tab_names={tab_names} components={components} />
    </div>
  );
};

export default RecipeViewer;
