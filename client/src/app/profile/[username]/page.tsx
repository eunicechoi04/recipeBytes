"use client";
import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import Loading from "@/components/Loading";
import { useApi } from "@/context/ApiContext";

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const username = params.username;
  const api = useApi();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/getUser/${username}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [username, api]);

  if (!user) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-screen w-full px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 ">
      <div className="w-full md:w-2/5 xl:w-1/4 py-8 md:py-16">
        <ProfileCard user={user} />
      </div>
      <div className="w-full md:w-3/5 xl:w-3/4 md:py-16">
        <div className="bg-white p-4 rounded-lg shadow-md">recipe stuff</div>
      </div>
    </div>
  );
};
export default ProfilePage;
