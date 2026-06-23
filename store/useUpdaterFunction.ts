import { create } from "zustand";

type AgeStore = { age: number };

type AgeStoreFunction = {
  setAge: (
    nextAge:
      | AgeStore["age"]
      | ((currentAge: AgeStore["age"]) => AgeStore["age"]),
  ) => void;
};

type StoreType = AgeStore & AgeStoreFunction;

export const useAgeStore = create<StoreType>()((set, get, store) => ({
  age: 25,
  setAge: (nextAge) => {
    set(
      (state) => ({
        age: typeof nextAge === "function" ? nextAge(state.age) : nextAge,
        setAge: state.setAge,
      }),
      true,
    );
  },
}));

type XStore = {
  X: number;
  Y: number;
};

export const useXStore = create<XStore>()((set) => ({
  X: 0,
  Y: 0,
}));

export const setXY = (nextOjb: { X: number; Y: number }) =>
  useXStore.setState(nextOjb);
