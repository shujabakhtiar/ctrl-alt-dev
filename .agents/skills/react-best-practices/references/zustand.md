# Zustand Reference & Best Practices (v5)

## Core Principles

1. **Keep state minimal and client-only:** Server data belongs in TanStack Query, not Zustand.
2. **Narrow Selectors:** Always select the smallest slice of state needed to avoid re-rendering entire component trees.
3. **Colocate Actions with State:** Define state mutations inside the store definition or slice functions.

---

## 1. Creating a Typed Store (Zustand v5)

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createCommonState, CommonState, clearErrors } from '@/lib/commonState';

type UserSessionState = CommonState & {
  userId: string | null;
  preferences: {
    theme: 'dark' | 'light' | 'system';
    compactMode: boolean;
  };
  setUserId: (id: string | null) => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  reset: () => void;
};

const initialState = {
  ...createCommonState(),
  userId: null,
  preferences: {
    theme: 'system' as const,
    compactMode: false,
  },
};

export const useUserSessionStore = create<UserSessionState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setUserId: (userId) => set({ userId }),
        setTheme: (theme) =>
          set((state) => ({
            preferences: { ...state.preferences, theme },
          })),
        reset: () => set(initialState),
      }),
      {
        name: 'user-session-storage',
        partialize: (state) => ({ preferences: state.preferences }),
      }
    )
  )
);
```

---

## 2. Using Slices for Complex Stores

Split stores by domain slice while maintaining type safety:

```typescript
import { StateCreator } from 'zustand';

export type FilterSlice = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export type PaginationSlice = {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
};

export type TableStore = FilterSlice & PaginationSlice;

export const createFilterSlice: StateCreator<TableStore, [], [], FilterSlice> = (set) => ({
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
});

export const createPaginationSlice: StateCreator<TableStore, [], [], PaginationSlice> = (set) => ({
  page: 1,
  pageSize: 20,
  setPage: (page) => set({ page }),
});
```

Assemble the slices:

```typescript
import { create } from 'zustand';

export const useTableStore = create<TableStore>()((...args) => ({
  ...createFilterSlice(...args),
  ...createPaginationSlice(...args),
}));
```

---

## 3. Selectors & Preventing Re-renders

### Bad (re-renders on any store change):
```tsx
const store = useUserSessionStore(); // ❌ Never do this
```

### Good (atomic selector):
```tsx
const userId = useUserSessionStore((state) => state.userId); // ✅ Only re-renders when userId changes
const setUserId = useUserSessionStore((state) => state.setUserId); // ✅ Action references are stable
```

### Selecting multiple values with `useShallow`:
```tsx
import { useShallow } from 'zustand/react/shallow';

const { theme, compactMode } = useUserSessionStore(
  useShallow((state) => ({
    theme: state.preferences.theme,
    compactMode: state.preferences.compactMode,
  }))
);
```

---

## 4. Testing & Store Resetting

Zustand stores persist across tests unless explicitly reset. Register store resets in your test setup:

```typescript
import { afterEach } from 'vitest';
import { useUserSessionStore } from './userSessionStore';

const initialStoreState = useUserSessionStore.getState();

afterEach(() => {
  useUserSessionStore.setState(initialStoreState, true);
});
```
