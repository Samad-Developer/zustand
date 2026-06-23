"use client";

import { useUserStore } from "@/store/useUserStore";

const StateUpdateWithImmer = () => {
  const user = useUserStore((state) => state.user);
  const updateCity = useUserStore((state) => state.updateCity);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>{user.name} belongs to {user.address.city} {user.address.country}</h1>
      <input
        // Update the "firstName" state
        onChange={(e) => updateCity(e.currentTarget.value)}
        value={user.address.city}
        className="py-2 rounded-md border-gray-50 mt-5"
        placeholder="Your City..."
      />
    </div>
  );
};

export default StateUpdateWithImmer;
