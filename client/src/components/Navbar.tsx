import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { House, SquarePlus, NotebookText, CircleUser } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="h-24 flex items-center justify-between">
      <div className="md:hidden lg:block w-[20%]">
        <Link href="/">RecipeBytes</Link>
      </div>
      <div className="hidden md:flex w-[50%] text-sm items-center justify-between">
        <div className="flex gap-6">
          <Link href="/" className="flex items-center gap-2">
            <House />
            <span>Home</span>
          </Link>
          <Link href="/import" className="flex items-center gap-2">
            <SquarePlus />
            <span>Import Recipe</span>
          </Link>
          <Link href="/my-recipes" className="flex items-center gap-2">
            <NotebookText />
            <span>My Recipes</span>
          </Link>
        </div>
      </div>
      <div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end">
        <ClerkLoading>
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <CircleUser />
              <Link href="/sign-in">Login/Register</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
};
export default Navbar;
