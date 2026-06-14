# 🐻 Zustand Learning Journal

> Learning Zustand step by step — with simple words, real examples, and no bullshit.

---

## What is Zustand?

Zustand is a state management library for React.  
It is small, fast, and has almost zero boilerplate.

The name "Zustand" means **"state"** in German.  
The logo is a bear — looks cute and cuddly, but it has claws.  
Simple on the outside. Serious on the inside.

---

## Why Zustand over Redux?

| | Redux | Zustand |
|---|---|---|
| Boilerplate | High | Almost none |
| Learning curve | Steep | Easy |
| Actions outside components | ❌ | ✅ |
| Provider needed | ✅ | ❌ |
| DevTools | ✅ | ✅ (via middleware) |

---

## The 3 Types of State (Mental Model)

Before picking any tool, understand what kind of state you have:

| Type | What it is | Tool |
|---|---|---|
| 🌐 Server State | Data from an API — needs fetching, caching, syncing | TanStack Query |
| 🧠 Client State | Shared data across the app — cart, auth, user prefs | Zustand |
| 🎨 UI State | Local component state — modal open/closed, active tab | useState |

> Most Redux pain comes from using it for ALL three. Use the right tool for each.

---

## Installation

```bash
npm install zustand
```

---

## Topic 1 — Creating a Store

A store in Zustand holds your state AND your actions together in one place.

### Docs definition
> Call `create` with a function that returns your state and actions.

### Simple words
Think of a store like a box. The box holds your data (state) and the functions that change that data (actions). You create it once and use it anywhere in your app.

### Example

```ts
// store/cart-store.ts
import { create } from 'zustand'

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}))

export default useCartStore
```

### Using it in a component

```tsx
'use client'

import useCartStore from '@/store/cart-store'

export function CartButton() {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)

  return <p>Total items: {items.length}</p>
}
```

> ⚠️ In Next.js, always use Zustand inside `'use client'` components.

---

## Topic 2 — Updating State

### Flat updates (simple)

When your state is not nested inside objects, updating is dead simple.  
Zustand automatically merges the new value — no need to spread the whole state.

```ts
const usePersonStore = create((set) => ({
  firstName: '',
  lastName: '',
  updateFirstName: (firstName) => set({ firstName }),
  updateLastName: (lastName) => set({ lastName }),
}))
```

### Nested updates (painful without help)

If your state is nested inside objects, you have to manually copy every level:

```ts
// painful way
set((state) => ({
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'Karachi'
    }
  }
}))
```

### Nested updates with Immer (clean way)

Immer lets you write updates as if you're directly changing the value.  
It handles all the copying behind the scenes.

```ts
import { produce } from 'immer'

set(produce((state) => {
  state.user.address.city = 'Karachi'
}))
```

> For flat state like a cart items array — you don't need Immer. It's only useful for deeply nested objects.

---

## Topic 3 — TypeScript with Zustand

You define the shape of your store using two types — one for state, one for actions.  
Then pass both into `create<State & Action>()`.

### What is `<>` (Generics)?

Think of it like a function parameter but for types.  
You're telling Zustand: "hey, my store will look like this shape."

```ts
// Normal function — you pass a value
greet("Samad")

// Generic — you pass a type
create<YourStoreType>()
```

### Example with TypeScript

```ts
import { create } from 'zustand'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type State = {
  items: CartItem[]
}

type Action = {
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<State & Action>()((set) => ({
  items: [],

  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}))
```

> `State & Action` means combine both types into one so Zustand knows the full shape of your store.

---

## Topic 4 — Actions Outside the Store

### Docs definition
> Define actions at module level, external to the store. This allows calling them without a hook.

### Simple words
Normally you need a hook inside a component to call an action.  
But sometimes you need to update state from outside React — like a SignalR listener or a utility function.  
With this pattern you just import the function and call it directly. No hook needed.

### Example

```ts
// store/order-store.ts
import { create } from 'zustand'

export const useOrderStore = create(() => ({
  orders: [],
}))

// actions live outside the store
export const addOrder = (order) =>
  useOrderStore.setState((state) => ({ orders: [...state.orders, order] }))

export const updateOrderStatus = (id, status) =>
  useOrderStore.setState((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  }))
```

### Real use case — SignalR (outside React)

```ts
// lib/signalr.ts — no component, no hook needed
import { addOrder, updateOrderStatus } from '@/store/order-store'

connection.on('OrderReceived', (order) => {
  addOrder(order) // just works
})

connection.on('OrderStatusChanged', (id, status) => {
  updateOrderStatus(id, status) // just works
})
```

> This is the biggest practical win over Redux. In Redux you can't call a reducer outside a component. In Zustand you can.

---

## Topic 5 — Slices Pattern

### Docs definition
> Divide your main store into smaller individual stores to achieve modularity.

### Simple words
As your app grows, one store file becomes a mess.  
Slices let you split each concern into its own file.  
Then you combine them all into one store at the end.

Each slice is not a full store — it's just a function that returns state + actions for one concern.

### Folder structure

```
src/
└── store/
    ├── cart-slice.ts
    ├── auth-slice.ts
    ├── order-slice.ts
    └── index.ts        ← combines everything + middleware
```

### Cart slice

```ts
// store/cart-slice.ts
export const createCartSlice = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
})
```

### Auth slice

```ts
// store/auth-slice.ts
export const createAuthSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
})
```

### Order slice

```ts
// store/order-slice.ts
export const createOrderSlice = (set) => ({
  orders: [],
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),
})
```

### Combining everything

```ts
// store/index.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createCartSlice } from './cart-slice'
import { createAuthSlice } from './auth-slice'
import { createOrderSlice } from './order-slice'

export const useStore = create(
  persist(
    (...a) => ({
      ...createCartSlice(...a),
      ...createAuthSlice(...a),
      ...createOrderSlice(...a),
    }),
    { name: 'roll-inn-store' }
  )
)
```

### What is `(...a)`?

It is shorthand for `(set, get, api)` — the three arguments Zustand passes to every store.  
Instead of writing them three times, you write `...a` and spread them into each slice.

```ts
// these two are identical
(...a) => ({ ...createCartSlice(...a) })

(set, get, api) => ({ ...createCartSlice(set, get, api) })
```

### Cross-slice action — one action touching two slices

When one action needs to update state from two different slices, use `get()`:

```ts
// store/checkout-slice.ts
export const createCheckoutSlice = (set, get) => ({
  checkout: () => {
    const { items, clearCart, addOrder } = get()
    addOrder({ items, date: new Date() })
    clearCart()
  }
})
```

`get()` reads the entire combined store — so you can call actions from other slices.

### Using the combined store in a component

```tsx
'use client'
import { useStore } from '@/store'

export function Cart() {
  const items = useStore((state) => state.items)
  const user = useStore((state) => state.user)
  const addItem = useStore((state) => state.addItem)

  return <p>{items.length} items</p>
}
```

One hook. All slices. Clean.

> ⚠️ Only add middleware (`persist`, `devtools`) in `index.ts`. Never inside individual slices.

---

## Key Rules to Remember

1. Use Zustand only inside `'use client'` components in Next.js
2. Flat state → `set({ key: value })` — simple
3. Nested state → use Immer middleware
4. Actions outside components → use `useStore.setState()` pattern
5. Big app → use slices pattern, combine in `index.ts`
6. Middleware → only in the combined store, never in slices