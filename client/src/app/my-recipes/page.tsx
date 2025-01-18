"use client";
import FolderList from "@/components/recipe-library/FolderList";
import RecipeDisplay from "@/components/recipe-library/RecipeDisplay";
import { useEffect, useState } from "react";
import { useApi } from "@/context/ApiContext";
import { useAuth } from "@clerk/nextjs";

const MyRecipes = () => {
  const { userId } = useAuth();
  const api = useApi();
  const [folders, setFolders] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // const fetchFolders = async () => {
    //   try {
    //     const response = await api.get(`/folders/${userId}`);
    //     setFolders(response.data);
    //   } catch (error) {
    //     console.error("Error fetching folders:", error);
    //   }
    // };

    const fetchRecipes = async () => {
      try {
        const response = await api?.get(`/getRecipes/${userId}`);
        setRecipes(response?.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    // fetchFolders();
    fetchRecipes();
  }, [userId, api]);

  return (
    <div className="flex flex-col gap-4 py-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 w-screen">
      <h1>My Recipes</h1>
      <div className="flex">
        {/* <div className="w-[20rem]">
          <FolderList />
        </div> */}
        <div className="w-full">
          <RecipeDisplay recipes={recipes} />
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;
