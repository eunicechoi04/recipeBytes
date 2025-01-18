import { useRouter } from "next/navigation";

const NotFound = ({ object }) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };
  return (
    <div className="w-screen h-[calc(100vh-6rem)] flex flex-col gap-6 justify-center items-center">
      <div className="text-red-500 text-xl">Error: {object} Not Found</div>
      <button
        className="p-2 px-6 bg-blue-500 text-white rounded-3xl"
        onClick={() => handleBackClick()}
      >
        Back
      </button>
    </div>
  );
};
export default NotFound;
