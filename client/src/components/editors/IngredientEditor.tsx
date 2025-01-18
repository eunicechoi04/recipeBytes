import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { IngredientEditorProps } from "@/types";

const IngredientEditor = ({
  index,
  ingredient,
  onIngredientChange,
  onDelete,
}: IngredientEditorProps) => {
  const [quantity, setQuantity] = useState(ingredient.quantity || "");
  const [rangeEnd, setRangeEnd] = useState(ingredient.range_end || "");
  const [unit, setUnit] = useState(ingredient.unit || "");
  const [name, setName] = useState(ingredient.name || "");
  const [comment, setComment] = useState(ingredient.comment || "");
  const [trashColor, setTrashColor] = useState("#000000");
  const [isQuantityValid, setIsQuantityValid] = useState(true);
  const [isRangeEndValid, setIsRangeEndValid] = useState(true);

  useEffect(() => {
    setQuantity(ingredient.quantity || "");
    setRangeEnd(ingredient.range_end || "");
    setUnit(ingredient.unit || "");
    setName(ingredient.name || "");
    setComment(ingredient.comment || "");
  }, [ingredient]);

  const isValidNumberOrFraction = (value: string) => {
    const fractionRegex = /^\d+\/\d*$/;
    const numberRegex = /^\d*\.?\d+$/;

    return fractionRegex.test(value) || numberRegex.test(value) || value === "";
  };

  const handleQuantityChange = (e: { target: { value: any } }) => {
    const newQuantity = e.target.value;
    if (!isValidNumberOrFraction(newQuantity)) {
      setIsQuantityValid(false);
    } else {
      setIsQuantityValid(true);
      setQuantity(newQuantity);
      onIngredientChange({ ...ingredient, quantity: newQuantity });
    }
  };

  const handleRangeEndChange = (e: { target: { value: any } }) => {
    const newRangeEnd = e.target.value;
    if (!isValidNumberOrFraction(newRangeEnd)) {
      setIsRangeEndValid(false);
    } else {
      setIsRangeEndValid(true);
      setRangeEnd(newRangeEnd);
      onIngredientChange({ ...ingredient, range_end: newRangeEnd });
    }
  };

  const handleUnitChange = (e: { target: { value: any } }) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    onIngredientChange({ ...ingredient, unit: newUnit });
  };

  const handleNameChange = (e: { target: { value: any } }) => {
    const newName = e.target.value;
    setName(newName);
    onIngredientChange({ ...ingredient, name: newName });
  };

  const handleCommentChange = (e: { target: { value: any } }) => {
    const newComment = e.target.value;
    console.log("edited comment");
    setComment(newComment);
    onIngredientChange({ ...ingredient, comment: newComment });
  };
  return (
    <div className="flex gap-2 w-full rounded-lg border p-2 bg-slate-50">
      <input
        placeholder="#"
        value={quantity}
        onChange={handleQuantityChange}
        className={`border rounded p-2 flex-none w-10 ${
          !isQuantityValid ? "bg-red-200" : ""
        }`}
      />
      <span> to </span>
      <input
        placeholder="#"
        value={rangeEnd}
        onChange={handleRangeEndChange}
        className={`border rounded p-2 flex-none w-10 ${
          !isRangeEndValid ? "bg-red-200" : ""
        }`}
      />
      <input
        placeholder="unit"
        value={unit}
        onChange={handleUnitChange}
        className="border rounded p-2 flex-none w-20"
      />
      <input
        placeholder="ingredient"
        value={name}
        onChange={handleNameChange}
        className="border rounded p-2 flex-none w-25"
      />

      <input
        placeholder="comment"
        value={comment}
        onChange={handleCommentChange}
        className="border rounded p-2 flex-1"
      />
      <button
        onMouseEnter={() => setTrashColor("#e32400")}
        onMouseLeave={() => setTrashColor("#000000")}
        onClick={() => onDelete(index)}
      >
        <Trash2 size={20} color={trashColor} />
      </button>
    </div>
  );
};
export default IngredientEditor;
