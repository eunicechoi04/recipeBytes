"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Homepage = () => {
  const router = useRouter();
  return (
    <div className="relative h-screen w-screen">
      <Image
        src="/bbblurry.svg" // Path to your image in the public folder
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        quality={100}
        className="z-0"
      />
      <div className="relative z-10 flex flex-col justify-center items-center h-full bg-opacity-50">
        <h1 className="text-3xl font-bold text-center">
          Upload your fav recipes from instagram to get and save recipe details!
        </h1>
        <button
          onClick={() => router.push("/import")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Import
        </button>
      </div>
      <div className="relative z-10 flex justify-center items-center h-12">
        <div className="flex flex-col">
          <p className="text-md">Built with love by Eunice Choi</p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
