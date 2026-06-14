import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  firstName: string;
  lastName: string;
};

type Action = {
  updateFirstName: (firstName: string) => void;
  updateLastName: (lastName: string) => void;
};

// Create your store, which includes both state and (optionally) actions
export const usePersonStore = create<State & Action>()(
  persist(
    (set) => ({
      firstName: "",
      lastName: "",
      updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
      updateLastName: (lastName) => set(() => ({ lastName: lastName })),
    }),
    {
      name: "persons",
    },
  ),
);


export const combineBoth = (fullName: State['firstName']) => usePersonStore.setState((state) => ({ firstName: fullName, lastName: fullName}))