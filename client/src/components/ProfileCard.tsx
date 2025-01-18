import Link from "next/link";
import { Pencil, Settings, NotebookText } from "lucide-react";
// import { useUser } from "@clerk/nextjs";

const defaultAvatar =
  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
const ProfileCard = ({ user }) => {
  // const { user, isLoaded } = useUser();

  // if (!isLoaded) {
  //     return (
  //     <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
  //     );
  // }
  return (
    <div className="flex flex-col bg-white items-center gap-2 text-sm rounded-lg px-4 py-12 shadow-md">
      {/* <img src={user.profileImageUrl || defaultAvatar} className="h-8 w-8 rounded-full" />
            <div>{user.username}</div> */}
      <img src={defaultAvatar} className="w-32 h-32 rounded-full" />
      <div className="text-lg font-semibold">
        {user.first_name} {user.last_name}
      </div>
      <div>@{user.username}</div>
      <Link href="/profile/edit" className="flex items-center gap-2">
        <Pencil />
        Edit Profile
      </Link>
      <Link href="/profile/recipes" className="flex items-center gap-2">
        <NotebookText />
        My Recipes
      </Link>
      <Link href="/settings" className="flex items-center gap-2">
        <Settings />
        Settings
      </Link>
    </div>
  );
};
export default ProfileCard;
