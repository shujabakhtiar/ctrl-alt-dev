---
name: react-best-practices
description: Industry-standard conventions for building, reviewing, and refactoring React apps with TypeScript, Tailwind, and Zustand. Use this skill whenever the user asks to write, scaffold, review, debug, optimize, or refactor React code, create components, hooks, pages, or forms, decide where state should live, set up or change a Zustand store, fix slow renders or re-render problems, structure a React project's folders, or write React tests, even if they don't explicitly say "best practices". Also use it when you are about to generate any React code in a project that has this skill installed.
---

# React Best Practices

Conventions to follow when writing or reviewing React code. Prefer these defaults unless the existing codebase clearly does something different. If it does, match the codebase and mention the difference rather than silently rewriting it.

Stack assumed: React 19, TypeScript (strict), Vite, Tailwind CSS, Zustand for client state, TanStack Query for server state. For Zustand details (v5 API, slices, middleware, testing) read `references/zustand.md` before writing or changing any store.

## Before writing code

1. Inspect `package.json`, the folder structure, and 2-3 existing components. Note React version, router, bundler, Tailwind version, and any UI library. Match existing naming, imports, and file layout.
2. Decide where each piece of state lives (see "State placement" below) before creating any store or context.
3. Prefer editing existing modules over creating parallel ones.

## Project structure: feature/module based

Group by feature, not by file type. In CtrlAltDev, every tool and major feature lives in `src/modules/<kebab-case-name>/` and exposes everything through a single public barrel (`index.ts`).

```
src/
  components/ui/        # shared, generic UI primitives (Button, Card, Badge, Modal)
  hooks/                # shared, cross-feature hooks only
  lib/                  # shared utilities (commonState, errorHandler, format, download)
  modules/
    <tool-name>/        # kebab-case folder (e.g. convert-to-webp, responsive-image-set)
      index.ts          # public API: exports main component, store, and types only
      <ToolName>.tsx    # main container orchestrating layout, toolbar & HUD
      components/       # single-responsibility UI sub-components
        DropZone.tsx    # file upload, drag-and-drop, demo asset loader, privacy note
        ControlsPanel.tsx # tool parameters, quality slider, presets, export buttons
        PreviewPanel.tsx  # visual inspection (split comparison slider, side-by-side)
        StatsHud.tsx    # live savings HUD (original size, optimized size, delta)
      store/            # Zustand client state for this tool
        use<ToolName>Store.ts
      lib/              # pure business logic, calculations, transforms (zero JSX)
        converter.ts    # pure functions (dimension scaling, canvas ops, encoders)
      types/
        index.ts        # all TypeScript contracts for this feature
      workers/          # (optional) Web Workers for heavy compute / WASM
      codecs/           # (optional) WASM codec wrappers & decode/encode verification
      __tests__/        # unit tests for pure lib functions and store logic
  pages/
    <ToolName>Page.jsx  # thin route wrapper: breadcrumb navigation + <ToolName />
```

### Tool Module Rules:
1. **Public API via Barrel**: Modules only expose their top-level component (`<ToolName />`), their hook/store (`use<ToolName>Store`), and public types in `index.ts`. Outside code (pages, other modules) must NEVER import from a module's internal subdirectories.
2. **Thin Pages**: Route pages (`src/pages/*Page.jsx`) are lightweight wrappers responsible only for breadcrumb navigation, route parameters, and rendering the module's container component.
3. **Sub-component Decomposition**: Never build monolithic tool files. Decompose into focused sub-components under `components/`:
   - `DropZone.tsx`: Handles file selection, drop events, demo asset loading, and client-side privacy badges.
   - `StatsHud.tsx`: Displays original vs output sizes and percentage/byte savings using `formatBytes` and `calculateSavingsPercent`.
   - `ControlsPanel.tsx`: Houses inputs, sliders, tactical preset buttons, and primary download/copy actions.
   - `PreviewPanel.tsx`: Interactive preview (split-slider comparison with draggable handle or side-by-side view).
4. **Pure Logic in `lib/`**: Canvas manipulation, image decoding/encoding, dimension math, and filename formatting belong in `lib/*.ts` as pure functions, completely detached from React renders.
5. **Memory Management**: Tool stores dealing with Blobs and Object URLs must proactively call `URL.revokeObjectURL()` on file replacement or clear to prevent client memory leaks.
6. **Debounced Processing**: Interactive parameters (e.g., quality sliders, resize thresholds) must debounce re-encoding (100–120ms) so the UI remains fluid at 60fps.
7. **Legacy Re-exports**: When refactoring a legacy monolithic component into a module, leave a clean one-line re-export in the old location (marked `@deprecated`) to avoid breaking existing imports.

## Components

- Function components only. No classes except error boundaries (or use `react-error-boundary`).
- One component per file; filename matches the component, PascalCase. Hooks are `useThing.ts`, utilities are camelCase.
- Keep components small and single-purpose. If a component needs a long comment to explain its sections, split it.
- Separate concerns: components render, hooks hold logic, `lib/` holds pure functions. Pure logic should be testable without rendering.
- Prefer composition (`children`, slots as props) over configuration (many boolean props). If you have three or more boolean props that interact, redesign the API.
- Type props with an explicit `type` or `interface` named `ComponentNameProps`. Do not use `React.FC`. Destructure props in the signature.
- In React 19, `ref` is a regular prop on function components. Do not add `forwardRef` in new code.
- Use stable, unique `key`s from data (ids). Never use array index as key for lists that can reorder, insert, or delete.
- Avoid defining components inside other components; it remounts them on every render.
- Default exports for route/page components if the router needs it; named exports everywhere else.

```tsx
type UserCardProps = {
  user: User;
  onSelect: (id: string) => void;
  children?: React.ReactNode;
};

export function UserCard({ user, onSelect, children }: UserCardProps) {
  return (
    <button type="button" onClick={() => onSelect(user.id)}>
      {user.name}
      {children}
    </button>
  );
}
```

## State placement (most important decision)

Choose the lowest, simplest option that works:

| Kind of state | Where it lives |
|---|---|
| Used by one component | `useState` / `useReducer` in that component |
| Shared by a parent and a few children | Lift to the nearest common parent, pass as props |
| Server data (fetched, cached, mutated) | TanStack Query, never copied into Zustand or useState |
| Shareable/bookmarkable UI state (filters, tabs, pagination, selected id) | URL (search params / route params) |
| Form state | React Hook Form + Zod schema (or native form + Actions for simple forms) |
| Global client/UI state used across distant components (queues, wizard progress, theme, modals, preferences) | Zustand |
| Rarely-changing, app-wide config (theme, auth user, i18n) | Context is fine; Zustand also works |

Rules:
- **Derive, don't sync.** If a value can be computed from props or state, compute it during render. Never mirror it into another state variable with an effect.
- Do not put server data in Zustand. That duplicates a cache and creates stale data bugs.
- Do not reach for global state first. Most state is local.
- Keep state minimal and normalized; avoid storing both `items` and `itemCount`.
- Use `useReducer` when state transitions are complex or one event updates several fields.

## Effects

Effects synchronize React with external systems (DOM APIs, subscriptions, timers, non-React widgets). They are not for data transformation or event handling.

- Ask "Do I need an effect?" first. Calculate during render, handle user actions in event handlers, and reset state with a `key` rather than an effect.
- Never fetch data in `useEffect` for app data; use TanStack Query (or a framework loader).
- Always return a cleanup function for subscriptions, listeners, timers, and observers.
- Include every reactive value in the dependency array; never disable `react-hooks/exhaustive-deps`. If the deps are annoying, the design needs fixing.
- Do not call `setState` in an effect just to derive a value from other state.
- Avoid object/array/function literals as dependencies; stabilize or move them out.

## Custom hooks

- Name with `use`. One responsibility each. Return a stable, minimal API (an object for 3+ values, a tuple for 2).
- Extract a hook when logic uses hooks and is reused or hides noise; extract a plain function when logic is pure.
- Do not wrap a single `useState` in a hook just for naming.

## Data fetching (TanStack Query)

- One `queryKey` factory per feature; keys are arrays with all inputs that affect the result.
- Wrap each query/mutation in a named hook (`useUserQuery`) inside the feature's `api/` folder.
- Handle `isPending`, `isError`, and empty states explicitly in the UI.
- Invalidate or update the cache after mutations; use optimistic updates only where the UX needs it (`useOptimistic` or Query's optimistic helpers).
- Validate external data at the boundary (Zod), then use inferred types.

## Performance

Measure first with React DevTools Profiler and Lighthouse. Do not optimize by guesswork.

- If the project uses the React Compiler, do not hand-write `useMemo`/`useCallback`/`React.memo` for ordinary cases. If it does not, add them only where profiling shows a problem (expensive calculations, memoized children receiving callbacks, stable context values).
- Code-split routes and heavy components with `React.lazy` + `Suspense`.
- Virtualize long lists (TanStack Virtual / react-window) beyond a few hundred rows.
- Use `useTransition` / `useDeferredValue` to keep input responsive during expensive updates.
- Keep state close to where it's used so updates re-render small subtrees. Split contexts by update frequency.
- Select the minimum from Zustand stores (see zustand reference) to avoid needless re-renders.
- Images are the most common cause of slow load: serve correctly sized, modern formats (WebP/AVIF), set `width`/`height`, use `loading="lazy"` below the fold and `fetchpriority="high"` for the LCP image.
- Watch bundle size: analyze with `vite-bundle-visualizer`, import only what you use, avoid heavy libs for small jobs.

## Forms

- Use React Hook Form with a Zod resolver for anything beyond 2-3 fields. Define the schema once; infer the type from it.
- Label every input; show errors next to fields with `aria-describedby`. Disable submit only while submitting, not on invalid.
- For simple forms, React 19 form Actions with `useActionState` and `useFormStatus` are fine.

## TypeScript

- `strict: true`. No `any`; use `unknown` and narrow. No non-null `!` assertions without a comment explaining why.
- Prefer `type` for unions/props and `interface` when you need declaration merging or `extends` on object shapes; be consistent within the codebase.
- Use discriminated unions for state machines (`{ status: 'idle' } | { status: 'error'; error: Error }`) instead of several booleans.
- Let types be inferred where obvious; annotate function boundaries (exports, hooks, props).
- Use `satisfies` for config objects, `as const` for literal tuples/maps.
- Never silence errors with `@ts-ignore`; use `@ts-expect-error` with a reason if unavoidable.

## Styling (Tailwind)

- Utility classes in JSX; no custom CSS beyond the Tailwind entry file and theme tokens.
- Use a component library (shadcn/ui, daisyUI, etc.) for primitives rather than hand-building them.
- Extract repeated class sets into components, not `@apply`.
- Use `clsx`/`cn` (with `tailwind-merge`) for conditional classes; use `cva` for variants.
- Keep design tokens (colors, spacing, radii) in the Tailwind theme, not hard-coded values.

## Accessibility

- Use semantic HTML first (`button`, `a`, `nav`, `main`, `label`, `ul`). `div onClick` is a bug.
- Everything interactive must be keyboard reachable with visible focus.
- Provide `alt` text (empty `alt=""` for decorative images), labels for inputs, `aria-live` for async status messages.
- Manage focus on dialogs/route changes; prefer accessible primitives (Radix, React Aria) over custom widgets.
- Meet color-contrast requirements; do not rely on color alone for meaning.
- Lint with `eslint-plugin-jsx-a11y`.

## Error handling and loading states

- Wrap route-level (and risky widget-level) UI in error boundaries with a recovery action.
- Use `Suspense` boundaries with meaningful fallbacks/skeletons, placed at sensible granularity.
- Every async UI needs loading, error, and empty states designed, not left blank.
- Never swallow errors silently. Log or report them (Sentry or equivalent in production).

## Repo-wide shared conventions: commonState and handleError

Two shared files live in `src/lib/` and are used everywhere. Templates are in `assets/commonState.ts` and `assets/errorHandler.ts`. If the repo does not have them yet, copy the templates in (after checking that `sonner` is installed and `<Toaster />` is mounted once at the app root) before writing code that needs them.

**commonState (`src/lib/commonState.ts`)** is the single vocabulary for UI state: `loading`, `submitting`, `success`, `error`, `errors`, `show`.
- Use `createCommonState()` for initial state in `useState`/`useReducer` and in Zustand stores (`...createCommonState()`). Extend with feature-specific fields instead of renaming these.
- Do not invent per-component names such as `isLoading`, `hasError`, `open`, `visible`, `isModalOpen` when one of these fits.
- Use `clearErrors()` when starting a new attempt. Never mutate `COMMON_STATE`.
- Server data loading/error states come from TanStack Query, not from commonState. Use commonState for local async work, forms, and UI visibility.

**errorHandler (`src/lib/errorHandler.ts`)** is the only place errors are logged and toasted.
- Every `catch` block calls `handleError(e, { context: 'nameOfOperation' })`. No ad-hoc `console.error`, `toast.error`, `alert`, or silent empty catches.
- `handleError` returns `{ message, fieldErrors, status, code, isAborted }`; store them in state: `setState((s) => ({ ...s, error: message, errors: fieldErrors }))`.
- Throw `AppError` for errors whose message is safe to show users. Plain `Error`s get a generic message (details are only logged).
- Use `silent: true` when the UI already shows the error inline and a toast would be noise. Cancelled requests (`AbortError`) are ignored automatically.
- For TanStack Query, prefer one global handler in `QueryCache`/`MutationCache` `onError` that calls `handleError`; don't also toast again in the component.
- To change toast library, edit `showErrorToast()` only. Never import the toast library in feature code to show errors.

```tsx
const [state, setState] = useState(createCommonState());

async function onSubmit(values: FormValues) {
  setState((s) => ({ ...s, ...clearErrors(), submitting: true, success: false }));
  try {
    await saveUser(values);
    setState((s) => ({ ...s, success: true }));
  } catch (e) {
    const { message, fieldErrors } = handleError(e, { context: 'saveUser' });
    setState((s) => ({ ...s, error: message, errors: fieldErrors }));
  } finally {
    setState((s) => ({ ...s, submitting: false }));
  }
}
```

## Security

- Never use `dangerouslySetInnerHTML` with unsanitized content; sanitize with DOMPurify if unavoidable.
- Never put secrets in client code or `VITE_`-prefixed env vars; those ship to the browser.
- Validate and encode user-supplied URLs (block `javascript:`); use `rel="noopener noreferrer"` on external `target="_blank"` links.
- Keep dependencies updated; run `npm audit` in CI.

## Testing

- Vitest + React Testing Library + `@testing-library/user-event`; MSW for network mocking; Playwright for a few critical end-to-end flows.
- Test behavior the user sees, not implementation. Query by role/label/text, not test ids or class names (test ids only as a last resort).
- Test pure logic (`lib/`, reducers, store actions) directly with unit tests.
- Reset Zustand store state between tests (see zustand reference).
- Don't snapshot-test large trees. Don't test the library.

## Tooling and quality gates

- ESLint (flat config) with `typescript-eslint`, `eslint-plugin-react-hooks`, `jsx-a11y`; Prettier for formatting (with the Tailwind class-sorting plugin).
- CI runs: typecheck, lint, tests, build. All must pass before merge.
- Use absolute imports via a path alias (`@/`) instead of deep relative paths (`../../../`).
- Keep commits small, with Conventional Commit messages.

## Code review checklist

When reviewing or finishing React code, check:
1. Is state in the lowest sensible place, with no duplicated or derived-and-synced state?
2. Any `useEffect` that should be an event handler, derived value, or query?
3. Effects have complete deps and cleanup?
4. Are Zustand selectors narrow (no whole-store subscriptions)?
5. Loading, error, and empty states handled, using commonState names, with every `catch` calling `handleError`?
6. Keys stable and unique? No components defined inside components?
7. Keyboard and screen reader usable? Semantic elements used?
8. Types strict, no `any`, external data validated?
9. Tests cover behavior; no flaky timing hacks?
10. Does it match the existing codebase's conventions?
11. Are developer tools structured as modular features under `src/modules/<tool-name>` with a strict public barrel (`index.ts`) and decomposed sub-components?
12. Are client-side Object URLs (`URL.createObjectURL`) revoked with `URL.revokeObjectURL()` on clear or re-upload to prevent memory leaks?

## How to respond when using this skill

- Follow these rules by default and do not lecture; mention a rule only when it changes what you wrote or when you deviate from it.
- When you choose between options (e.g. Zustand vs. Query vs. URL state), state the choice and the one-line reason.
- If existing code violates these practices, fix only what the task touches, and list other issues briefly at the end instead of rewriting everything.
