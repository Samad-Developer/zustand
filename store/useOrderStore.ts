import { create } from 'zustand'

type Order = {
  id: string
  customerName: string
  status: 'pending' | 'preparing' | 'delivered'
  items: string[]
}

type State = {
  orders: Order[]
}

const dummyOrders: Order[] = [
  {
    id: '1',
    customerName: 'Samad Khan',
    status: 'pending',
    items: ['Burger', 'Fries', 'Coke'],
  },
  {
    id: '2',
    customerName: 'Ali Hassan',
    status: 'preparing',
    items: ['Pizza', 'Garlic Bread'],
  },
  {
    id: '3',
    customerName: 'Sara Ahmed',
    status: 'delivered',
    items: ['Shawarma', 'Pepsi'],
  },
]

// store has ONLY state — no actions inside
export const useOrderStore = create<State>()(() => ({
  orders: dummyOrders,
}))

// actions live outside as plain functions
export const addOrder = (order: Order) =>
  useOrderStore.setState((state) => ({
    orders: [...state.orders, order]
  }))

export const updateOrderStatus = (id: string, status: Order['status']) =>
  useOrderStore.setState((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status: status } : o)
  }))

export const removeOrder = (id: string) =>
  useOrderStore.setState((state) => ({
    orders: state.orders.filter(o => o.id !== id)
  }))