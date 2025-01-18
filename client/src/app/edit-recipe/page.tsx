"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useApi } from "@/context/ApiContext";
import RecipeEditor from "@/components/editors/RecipeEditor";

const EditRecipePage = () => {
  const { userId, isSignedIn } = useAuth();
  const [recipeData, setRecipeData] = useState(null);
  const router = useRouter();
  const api = useApi();

  useEffect(() => {
    const data = sessionStorage.getItem("recipeData");
    console.log(data);
    if (data) {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      if (parsedData?.title?.trim() === "") {
        setRecipeData({ ...parsedData, title: "" });
      } else {
        setRecipeData(parsedData);
      }
    }
  }, []);

  const handleBackClick = () => {
    router.push("/import");
  };

  const handleSaveClick = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    } else {
      const isTitleValid = recipeData?.title?.trim() !== "";
      const areIngredientsValid = recipeData?.tagged_ingredients?.length > 0;
      const areIngredientFormatValid = recipeData?.tagged_ingredients?.every(
        (ingredient) => ingredient.quantity && ingredient.name
      );
      const areDirectionsValid = recipeData?.instructions?.length > 0;
      if (
        isTitleValid &&
        areIngredientsValid &&
        areIngredientFormatValid &&
        areDirectionsValid
      ) {
        console.log("Saving recipe...");
        console.log({
          userId,
          recipeData,
        });
        try {
          const response = await api?.post("/saveRecipe", {
            userId,
            recipeData,
          });
          console.log("--------------------");
          console.log("response", response);
          console.log("--------------------");
          const recipeId = recipeData.recipe_id;
          if (response?.status === 201) {
            console.log("Recipe saved successfully!");
            sessionStorage.removeItem("recipeData");
            router.push(`/recipe/${recipeId}`);
          }
        } catch (error) {
          console.error("There was an error saving the recipe!", error);
          alert("Failed to save recipe.");
        }
      } else {
        alert_message = "Please ensure all fields are filled out correctly.";
        if (!isTitleValid) {
          alert_message += "\n- Title is required";
        }
        if (!areIngredientsValid) {
          alert_message += "\n- At least one ingredient is required";
        }
        if (!areIngredientFormatValid) {
          alert_message += "\n- All ingredients must have quantity and name";
        }
        if (!areDirectionsValid) {
          alert_message += "\n- At least one instruction is required";
        }
        alert(alert_message);
        return;
      }
    }
  };

  const handleRecipeChange = (updatedRecipe) => {
    setRecipeData(updatedRecipe);
    sessionStorage.setItem("recipeData", JSON.stringify(updatedRecipe));
    console.log(updatedRecipe);
  };

  if (!recipeData) {
    return <p>Loading...</p>;
  }
  // https://www.instagram.com/p/DEIWDL4PtO8/
  return (
    <div className="flex flex-col w-full min-h-screen py-6 gap-4 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 ">
      <div className="flex justify-between items-center w-full px-8">
        <button
          onClick={handleBackClick}
          className="flex text-blue-500 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        >
          <span className="flex flex-col justify-center">
            <ArrowLeft size={20} />
          </span>
          <span>Back</span>
        </button>
        <button
          onClick={handleSaveClick}
          className="p-2 px-6 bg-blue-500 text-white rounded-md"
        >
          Save
        </button>
      </div>
      {/* <div className="flex w-full min-h-[95%] gap-8 px-8"> */}
      <div className="flex justify-center items-center min-h-[95%] w-full max-h-screen">
        <RecipeEditor
          recipeData={recipeData}
          onRecipeChange={handleRecipeChange}
        />
      </div>
    </div>
  );
};

export default EditRecipePage;
