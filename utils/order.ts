// lib/order-utils.ts
import { addOrder } from "@/store/useOrderStore"

export const placeOrder = (customerName: string, items: string[]) => {
  const newOrder = {
    id: Date.now().toString(),
    customerName,
    status: 'pending' as const,
    items,
  }

  addOrder(newOrder) // calling store action directly — no hook, no component
}