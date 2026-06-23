import { get } from "http";
import { create, StateCreator } from "zustand";

import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

interface BearSlice {
    bears: number,
    addBear: () => void,
    eatFish: () => void,
}

interface FishSlice {
    fishes: number,
    addFish: () => void,
}

interface SharedSlice {
    addBoth: () => void,
    getBoth: () => number,
}

const bearSlice: StateCreator<
    BearSlice & FishSlice,
    [],
    [],
    BearSlice
> = (set) => ({
    bears: 0,
    addBear : () => set((state) => ({ bears: state.bears + 1})),
    eatFish: () => set((state) => ({ fishes: state.fishes - 1}))
})

const fishSlice: StateCreator<
    BearSlice & FishSlice,
    [],
    [],
    FishSlice
> = (set, get) => ({
    fishes: 0,
    addFish: () => set((state) => ({ fishes: state.fishes + 1})),  
})

const sharedSlice: StateCreator<
    BearSlice & FishSlice & SharedSlice,
    [],
    [],
    SharedSlice
> = (set, get) => ({
    addBoth: () => {
        const { addBear, addFish} = get()
        addBear()
        addFish()
     },
    getBoth: () => {
        const { bears, fishes } = get()

        return bears + fishes;
    },
})

const useBoundStore = create<BearSlice & FishSlice & SharedSlice>()((...a) => ({
    ...bearSlice(...a),
    ...fishSlice(...a),
    ...sharedSlice(...a),
}))

export const useTestStore = createSelectors(useBoundStore);



type Bear = {
    bears: number
}

type BearActions = {
    addBears : () => void;
    reset: ()=> void;
}


export const useSomeStore = create<Bear & BearActions>()((set, get, store) => ({
    bears: 5,

    addBears: () => set((state) => ({
        bears: state.bears + 1, 
    })),
    
    reset: () => set(store.getInitialState())
}))