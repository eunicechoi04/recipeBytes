import { Folder } from "lucide-react";
const FolderList = () => {
  return (
    <div className="border p-4">
      <h2>Folders</h2>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <Folder size={20} />
          Folder 1
        </div>
        <div className="flex gap-2 items-center">
          <Folder size={20} />
          Folder 1
        </div>
      </div>
    </div>
  );
};

export default FolderList;
