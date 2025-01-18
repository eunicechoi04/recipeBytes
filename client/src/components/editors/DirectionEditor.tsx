import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { DirectionEditorProps } from "@/types";

const DirectionEditor = ({
  index,
  direction,
  onDirectionChange,
  onDelete,
}: DirectionEditorProps) => {
  const [text, setText] = useState(direction || "");
  const [trashColor, setTrashColor] = useState("#000000");

  useEffect(() => {
    setText(direction || "");
  }, [direction]);

  const handleTextChange = (e: { target: { value: any } }) => {
    const newText = e.target.value;
    setText(newText);
    onDirectionChange(newText);
  };
  return (
    <div className="flex gap-2 w-full rounded-lg border p-2 bg-slate-50">
      <span className="flex-none w-5 flex flex-col justify-center items-center">
        {index + 1}
      </span>
      <textarea
        placeholder={`Direction #${index + 1}`}
        value={text}
        onChange={handleTextChange}
        className="border rounded p-2 flex-1 overflow-auto max-h-15"
        style={{ lineHeight: "1rem" }}
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
export default DirectionEditor;
