const Loading = () => {
  return (
    <div className="w-screen h-[calc(100vh-6rem)] flex justify-center items-center">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
    </div>
  );
};
export default Loading;
