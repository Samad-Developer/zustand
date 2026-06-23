import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Human = {
  name: string;
  age: number;

  ageUpdate: (age: number) => void;
};

export const useHuman = create<Human>()(
  persist(
    (set, get, store) => ({
      name: "samad",
      age: 25,
      ageUpdate: (age) => set((state) => ({ age: age })),
    }),
    {
      name: "samad-storage",
      storage: createJSONStorage(() => localStorage),
      version: 3
    },
  ),
);
