import { create } from "zustand";

type Product = {
    id: string,
    name: string,
    price: number,
    inStock: boolean
}

type State = {
    products: Product[],

    setProduct: (product: Product) => void,
}

export const useProductStore = create<State>()((set) => ({
    products: [
        { id: '1', name: 'Burger', price: 500, inStock: true },
        { id: '2', name: 'Pizza', price: 800, inStock: true },
        { id: '3', name: 'Fries', price: 200, inStock: false },
    ],

    setProduct: (product) => set((state) => ({
        products: [
            ...state.products,
            product
        ]
    }))
}))


interface Jobs {
    experience : number,
    title: string,
    salary: number,

    setRequiredExperience: (experince: number) => void,
    reset: () => void,
}

const initialStore = {
    title: "Frontend Devloper",
    experience: 2,
    salary: 150,
}

export const jobsStore = create<Jobs>()((set) => ({
    ...initialStore,
    setRequiredExperience: (exp) => set((state) => ({
        ...state,
        experience: exp
    })),

    reset: () => set(initialStore),
}))