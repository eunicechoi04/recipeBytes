"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/context/ApiContext";
import { Link } from "lucide-react";

const ImportPage = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    instructions: [],
    ingredients: [],
    tagged_ingredients: [],
  });
  const api = useApi();

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleButtonClick = async () => {
    console.log("Link submitted:", link);
    setLoading(true);
    try {
      const res = await api?.post("/processlink", { link: link });
      if (res.data.error) {
        alert("Please enter a valid instagram link");
      } else if (res && res?.data) {
        setResponse(res.data);
        setLoading(false);
        console.log("Response:", res.data);
        sessionStorage.setItem("recipeData", JSON.stringify(res.data));
        router.push("/edit-recipe");
      }
    } catch (error) {
      console.error("Error processing link:", error);
      alert("Error processing link");
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-1/2 2xl:w-1/3 flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 ">
      <h1 className="text-3xl font-bold text-center mb-6">Get Your Recipe!</h1>
      <div
        className={`flex w-full rounded-lg overflow-hidden border border-gray-300 ${
          loading ? "opacity-50" : ""
        }`}
      >
        <span className="flex items-center justify-center p-2">
          <Link />
        </span>
        <input
          type="text"
          value={link}
          onChange={handleInputChange}
          placeholder="Enter link here"
          className="flex-grow p-2 border border-gray-300 h-30"
        />
        <button
          onClick={handleButtonClick}
          className="p-2 bg-blue-500 text-white h-30"
        >
          Submit
        </button>
      </div>
      {loading && (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-slate-400 motion-reduce:animate-[spin_1.5s_linear_infinite] mt-8"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      )}
    </div>
  );
};
export default ImportPage;
