import { useState } from "react";
import RecipeCard from "@/components/viewports/RecipeCard";
import NutritionCard from "@/components/editors/NutritionCard";
const Tabs = ({
  tab_names,
  components,
}: {
  tab_names: string[];
  components: any;
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  return (
    <div className="flex flex-col w-full rounded-lg px-6 h-[90%]">
      <div className="item-start flex space-x-4 px-2 rounded-lg border">
        {tab_names.map((tab_name, index) => (
          <button
            key={index}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors duration-200 ${
              activeTab === index
                ? "active-tab bg-gray-700 text-white rounded-t-lg"
                : "text-gray-400 hover:text-gray-700"
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab_name}
          </button>
        ))}
      </div>
      <div className="w-full bg-white border h-[90%] p-6">
        {components[activeTab]}
      </div>
    </div>
  );
};
export default Tabs;
