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

When your state is not nested, updating is dead simple.
Zustand automatically merges the new value — no need to spread the whole state.

```ts
const usePersonStore = create((set) => ({
  firstName: '',
  lastName: '',
  updateFirstName: (firstName) => set({ firstName }),
  updateLastName: (lastName) => set({ lastName }),
}))
```

### Direct vs Updater function

```ts
// direct value — when you don't need current state
set({ age: 23 })

// updater function — when you need current state
set((state) => ({ age: state.age + 1 }))
```

### Why updater function matters

When you call the same action multiple times rapidly — use updater function to always get the latest value:

```ts
// ❌ stale — all three read same old value
setAge(age + 1)
setAge(age + 1)
setAge(age + 1)

// ✅ always gets latest value
setAge((current) => current + 1)
setAge((current) => current + 1)
setAge((current) => current + 1)
```

### replace: true

By default `set` does shallow merge. If you want to completely wipe the store and replace it:

```ts
set({ age: 30 }, true) // everything else is GONE except age
```

Only use this when your entire store is a single primitive or array. Never use in normal object stores.

### Nested updates (painful without help)

```ts
// painful — copy every level manually
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

```ts
import { immer } from 'zustand/middleware/immer'

const useUserStore = create()(
  immer((set) => ({
    user: { name: 'Samad', address: { city: 'Peshawar' } },
    updateCity: (city) => set((state) => {
      state.user.address.city = city // direct mutation — Immer handles copying
    }),
  }))
)
```

> Wrap store with `immer()` once — then mutate directly inside set. Only useful for deeply nested objects.

---

## Topic 3 — TypeScript with Zustand

### Basic typed store

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

### Why `create<Type>()()`  — double parentheses?

TypeScript limitation. The extra `()` helps TypeScript infer types correctly inside the store. Just remember the pattern.

### typeof initialState — avoid repeating types

```ts
const initialState = { bears: 0, food: 'honey' }

type BearState = typeof initialState & {
  increase: (by: number) => void
  reset: () => void
}

const useBearStore = create<BearState>()((set) => ({
  ...initialState,
  increase: (by) => set((s) => ({ bears: s.bears + by })),
  reset: () => set(initialState),
}))
```

TypeScript reads the types from `initialState` automatically. If you add a new field — type updates automatically. Zero repetition.

### ExtractState — reuse store type outside

```ts
import { create, type ExtractState } from 'zustand'

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set(...),
}))

// extract type for use in utility functions, tests, props
export type CartState = ExtractState<typeof useCartStore>
```

---

## Topic 4 — Actions Outside the Store

### Simple words
Normally you need a hook inside a component to call an action.
With this pattern you define actions as plain functions outside the store and call them from anywhere — no hook needed.

### Example

```ts
// store/counter-store.ts
import { create } from 'zustand'

export const useCounterStore = create(() => ({
  count: 0,
}))

// actions outside — plain functions
export const increment = () =>
  useCounterStore.setState((state) => ({ count: state.count + 1 }))

export const decrement = () =>
  useCounterStore.setState((state) => ({ count: state.count - 1 }))

export const reset = () =>
  useCounterStore.setState({ count: 0 })
```

### Call from utility function — outside React

```ts
// lib/utils.ts
import { increment, reset, useCounterStore } from '@/store/counter-store'

export const handleLimit = (limit: number) => {
  const { count } = useCounterStore.getState() // read state outside React
  if (count >= limit) reset()
  else increment()
}
```

### In component — read with hook, call actions directly

```tsx
'use client'
import { useCounterStore, increment, decrement } from '@/store/counter-store'

export function Counter() {
  const count = useCounterStore((state) => state.count)

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```

> This is the biggest win over Redux. In Redux you can't call a reducer outside a component. In Zustand you can.

---

## Topic 5 — Slices Pattern

### Simple words
As your app grows, one store file becomes a mess.
Slices let you split each concern into its own file and combine them into one store.

Each slice is just a function that returns state + actions for one concern.

### Folder structure

```
src/
└── store/
    ├── cart-slice.ts
    ├── auth-slice.ts
    ├── order-slice.ts
    └── index.ts  ← combines everything + middleware
```

### Example slices

```ts
// store/cart-slice.ts
export const createCartSlice = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }),
})

// store/auth-slice.ts
export const createAuthSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
})
```

### Combining everything

```ts
// store/index.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createCartSlice } from './cart-slice'
import { createAuthSlice } from './auth-slice'

export const useStore = create(
  persist(
    (...a) => ({
      ...createCartSlice(...a),
      ...createAuthSlice(...a),
    }),
    { name: 'app-store' }
  )
)
```

`(...a)` is shorthand for `(set, get, api)` — the three arguments Zustand passes to every store.

### Cross-slice action — one action touching two slices

```ts
export const createCheckoutSlice = (set, get) => ({
  checkout: () => {
    const { items, clearCart, addOrder } = get() // get() reads entire combined store
    addOrder({ items, date: new Date() })
    clearCart()
  }
})
```

### TypeScript slices with StateCreator

```ts
import { create, StateCreator } from 'zustand'

interface CartSlice {
  items: string[]
  addItem: (item: string) => void
}

interface AuthSlice {
  user: string | null
  setUser: (user: string) => void
}

const createCartSlice: StateCreator<
  CartSlice & AuthSlice, // full combined store — so get() works across slices
  [],                    // always empty
  [],                    // always empty
  CartSlice              // this slice only
> = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
})
```

> ⚠️ Only add middleware in `index.ts`. Never inside individual slices.

---

## Topic 6 — Resetting State

### Approach 1 — initialState object (recommended with TypeScript)

```ts
const initialState = { bears: 0, food: 'honey' }

type BearState = typeof initialState & {
  increase: (by: number) => void
  reset: () => void
}

const useBearStore = create<BearState>()((set) => ({
  ...initialState,
  increase: (by) => set((s) => ({ bears: s.bears + by })),
  reset: () => set(initialState), // just set back to original object
}))
```

### Approach 2 — getInitialState()

```ts
const useBearStore = create<BearState>()((set, get, store) => ({
  bears: 0,
  food: 'honey',
  increase: (by) => set((s) => ({ bears: s.bears + by })),
  reset: () => set(store.getInitialState()), // Zustand remembers initial state
}))
```

### Why don't actions get reset?

Because `set()` does a **shallow merge** by default. It only updates the keys you pass. Your functions are never touched.

```ts
// reset() calls set(initialState)
// initialState = { bears: 0, food: 'honey' }
// only bears and food reset — increase and reset functions stay untouched
```

---

## Topic 7 — useShallow

### The problem

When your selector returns an array or object — it creates a new reference every render. Zustand sees a new reference and re-renders even if the content didn't change.

```ts
// ❌ re-renders every time ANY store state changes
const names = useProductStore((state) => state.products.map(p => p.name))
```

### The fix

```ts
import { useShallow } from 'zustand/react/shallow'

// ✅ only re-renders when names actually change
const names = useProductStore(
  useShallow((state) => state.products.map(p => p.name))
)
```

### Rule

```
Selector returns string or number → useShallow NOT needed
Selector returns array or object  → always wrap with useShallow
```

### Selecting multiple values

```ts
// ❌ without useShallow — re-renders on ANY store change
const { bears, food } = useStore((state) => ({ bears: state.bears, food: state.food }))

// ✅ with useShallow — only re-renders when bears or food change
const { bears, food } = useStore(
  useShallow((state) => ({ bears: state.bears, food: state.food }))
)
```

> ⚠️ Never do `useStore((state) => state)` — subscribes to entire store, re-renders on everything.

---

## Topic 8 — Auto Generating Selectors

### The problem

Writing selectors for every value is repetitive:

```ts
const bears = useBearStore((state) => state.bears)
const increment = useBearStore((state) => state.increment)
const increase = useBearStore((state) => state.increase)
```

### The solution — createSelectors utility

Create this once in your project:

```ts
// lib/createSelectors.ts
import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }
  return store
}
```

### Apply to your store

```ts
const useBearStoreBase = create<BearState>()((set) => ({
  bears: 0,
  increment: () => set((state) => ({ bears: state.bears + 1 })),
}))

export const useBearStore = createSelectors(useBearStoreBase)
```

### Usage — clean and short

```ts
// before
const bears = useBearStore((state) => state.bears)
const increment = useBearStore((state) => state.increment)

// after
const bears = useBearStore.use.bears()
const increment = useBearStore.use.increment()
```

Note: everything becomes a function with `()` — even plain values like `bears`. That's because `createSelectors` wraps everything in a function for consistency.

---

## Topic 9 — subscribe

### Simple words

`subscribe` runs a callback every time state changes — but **without causing a re-render.**

```ts
// selector in component → state changes → re-render
// subscribe → state changes → callback runs → NO re-render
```

### Example

```ts
useEffect(() => {
  const stopListening = useSalesStore.subscribe((state) => {
    chartInstance.update(state.data) // runs on change — no re-render
  })

  return () => stopListening() // always clean up — avoid memory leak
}, [])
```

### When to use

- Logging state changes for debugging
- Connecting to third party libraries outside React
- Running side effects without touching the UI

> ⚠️ Always return the cleanup function inside `useEffect` — otherwise you get a memory leak.

---

## Topic 10 — persist Middleware

### Basic usage

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useCartStore = create<State & Action>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // localStorage key
      storage: createJSONStorage(() => localStorage), // default — can skip this line
    }
  )
)
```

### partialize — save only specific fields

```ts
persist(
  (set) => ({
    items: [],
    isLoading: false, // UI state — don't save this
    isCartOpen: false, // UI state — don't save this
  }),
  {
    name: 'cart-storage',
    partialize: (state) => ({ items: state.items }) // only save items
  }
)
```

### version + migrate — handle store structure changes

When you change the shape of your stored state — bump the version and write a migrate function. Existing users' old data gets converted automatically.

```ts
persist(
  (set) => ({
    items: [], // new structure
  }),
  {
    name: 'cart-storage',
    version: 1, // bump when structure changes
    migrate: (persistedState: any, version) => {
      if (version === 0) {
        // convert old structure to new structure
        persistedState.items = persistedState.items.map((item) => ({
          ...item,
          title: item.name, // rename field
          price: 0,         // add missing field
        }))
      }
      return persistedState
    }
  }
)
```

### merge — fix nested object hydration

By default persist does shallow merge when loading from localStorage. Nested object fields can get lost. Fix with deep merge:

```ts
import createDeepMerge from '@fastify/deepmerge' // npm install @fastify/deepmerge
const deepMerge = createDeepMerge({ all: true })

persist(
  (set) => ({ position: { x: 0, y: 0 } }),
  {
    name: 'position-storage',
    merge: (persisted, current) => deepMerge(current, persisted)
  }
)
```

### skipHydration — for Next.js SSR

By default persist auto-loads from localStorage on mount. In Next.js if you get `localStorage is not defined` error — skip hydration and rehydrate manually on the client:

```ts
persist(
  (set) => ({ items: [] }),
  {
    name: 'cart-storage',
    skipHydration: true,
  }
)

// in your component or layout
useEffect(() => {
  useCartStore.persist.rehydrate()
}, [])
```

### Custom encrypted storage

```ts
import CryptoJS from 'crypto-js' // npm install crypto-js
import { createJSONStorage } from 'zustand/middleware'

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_SECRET!

const encryptedStorage = {
  getItem: (name: string) => {
    const encrypted = localStorage.getItem(name)
    if (!encrypted) return null
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
    return decrypted.toString(CryptoJS.enc.Utf8)
  },
  setItem: (name: string, value: string) => {
    const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString()
    localStorage.setItem(name, encrypted)
  },
  removeItem: (name: string) => localStorage.removeItem(name),
}

// use in store
persist(
  (set) => ({ items: [] }),
  {
    name: 'cart-storage',
    storage: createJSONStorage(() => encryptedStorage),
  }
)
```

---

## Key Rules to Remember

1. Use Zustand only inside `'use client'` components in Next.js
2. Flat state → `set({ key: value })` — simple
3. Nested state → use Immer middleware
4. Need current state in action → use updater function `set((state) => ...)`
5. Selector returns array/object → wrap with `useShallow`
6. Actions outside components → use `useStore.setState()` pattern
7. Big app → use slices pattern, combine in `index.ts`
8. Middleware → only in the combined store, never in slices
9. Persist → use `partialize` to exclude UI state from localStorage
10. Store structure changed → bump `version` and write `migrate`