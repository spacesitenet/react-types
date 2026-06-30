# React TypeScript Syntax And Events Reference

Use this as a quick reference for the React + TypeScript syntax, event types, and Redux Toolkit patterns you will use most often.

## Installs

Redux Toolkit + React Redux:

```powershell
npm install @reduxjs/toolkit react-redux
```

Material UI:

```powershell
npm install @mui/material @emotion/react @emotion/styled
```

## Components And Props

| Topic | Syntax | Example |
| --- | --- | --- |
| Function component | `function ComponentName() {}` | `function App() { return <h1>Hello</h1>; }` |
| Arrow component | `const ComponentName = () => {}` | `const App = () => <h1>Hello</h1>;` |
| Component return type | `JSX.Element` | `function App(): JSX.Element { return <main />; }` |
| Props type | `type Props = { name: string }` | `function User({ name }: Props) { return <p>{name}</p>; }` |
| Optional prop | `prop?: type` | `type Props = { age?: number };` |
| Default prop value | Destructure with default | `function Button({ label = "Click" }: { label?: string }) {}` |
| Children prop | `React.ReactNode` | `type Props = { children: React.ReactNode };` |
| Event handler prop | `React.MouseEventHandler<HTMLButtonElement>` | `type Props = { onClick: React.MouseEventHandler<HTMLButtonElement> };` |
| Custom callback prop | `(value: Type) => void` | `type Props = { onSave: (name: string) => void };` |
| Component as prop | `React.ComponentType<Props>` | `type Props = { Component: React.ComponentType<{ title: string }> };` |
| Passing rest props | `...props` | `function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...props} />; }` |

## TypeScript Basics

| Topic | Syntax | Example |
| --- | --- | --- |
| Interface | `interface Name {}` | `interface User { id: number; name: string; }` |
| Type alias | `type Name = {}` | `type User = { id: number; name: string };` |
| Union type | `"a" \| "b"` | `type Status = "idle" \| "loading" \| "error";` |
| Import React types | `import type` | `import type { ReactNode } from "react";` |
| CSS style prop | `React.CSSProperties` | `const style: React.CSSProperties = { color: "red" };` |
| Button props | `React.ButtonHTMLAttributes<HTMLButtonElement>` | `type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;` |
| Input props | `React.InputHTMLAttributes<HTMLInputElement>` | `type Props = React.InputHTMLAttributes<HTMLInputElement>;` |
| Div props | `React.HTMLAttributes<HTMLDivElement>` | `type Props = React.HTMLAttributes<HTMLDivElement>;` |
| Component props extraction | `React.ComponentProps<"button">` | `type ButtonProps = React.ComponentProps<"button">;` |
| Element ref extraction | `React.ElementRef<"input">` | `type InputRef = React.ElementRef<"input">;` |

## State And Hooks

| Topic | Syntax | Example |
| --- | --- | --- |
| String state | `useState<string>("")` | `const [name, setName] = useState<string>("");` |
| Number state | `useState<number>(0)` | `const [count, setCount] = useState<number>(0);` |
| Boolean state | `useState<boolean>(false)` | `const [open, setOpen] = useState<boolean>(false);` |
| Array state | `useState<Type[]>([])` | `const [items, setItems] = useState<string[]>([]);` |
| Object state | `useState<Type>({...})` | `const [user, setUser] = useState<User>({ id: 1, name: "Alex" });` |
| Nullable state | `useState<Type \| null>(null)` | `const [user, setUser] = useState<User \| null>(null);` |
| Effect hook | `useEffect(() => {}, [])` | `useEffect(() => { document.title = name; }, [name]);` |
| Memo hook | `useMemo(() => value, deps)` | `const total = useMemo(() => items.length, [items]);` |
| Callback hook | `useCallback(() => {}, deps)` | `const save = useCallback(() => onSave(name), [name, onSave]);` |
| Reducer action | Discriminated union | `type Action = { type: "increment" } \| { type: "reset" };` |
| Reducer hook | `useReducer(reducer, initialState)` | `const [state, dispatch] = useReducer(reducer, { count: 0 });` |
| Context value | `createContext<Type \| null>(null)` | `const UserContext = createContext<User \| null>(null);` |
| Custom hook | `function useName() {}` | `function useCounter() { const [count, setCount] = useState(0); return { count, setCount }; }` |

## Rendering

| Topic | Syntax | Example |
| --- | --- | --- |
| List rendering | `.map()` with `key` | `{items.map((item) => <li key={item.id}>{item.name}</li>)}` |
| Conditional render | `condition && JSX` | `{isOpen && <Modal />}` |
| Ternary render | `condition ? a : b` | `{isLoggedIn ? <Dashboard /> : <Login />}` |
| Fragment | `<>...</>` | `return <> <Header /> <Main /> </>;` |

## Forms And Events

| Topic | Syntax | Example |
| --- | --- | --- |
| Button click event | `React.MouseEvent<HTMLButtonElement>` | `const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};` |
| Div click event | `React.MouseEvent<HTMLDivElement>` | `const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {};` |
| Input change event | `React.ChangeEvent<HTMLInputElement>` | `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);` |
| Textarea change event | `React.ChangeEvent<HTMLTextAreaElement>` | `const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value);` |
| Select change event | `React.ChangeEvent<HTMLSelectElement>` | `const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value);` |
| Form submit event | `React.FormEvent<HTMLFormElement>` | `const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); };` |
| Input event | `React.FormEvent<HTMLInputElement>` | `const handleInput = (e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value);` |
| Before input event | `React.FormEvent<HTMLInputElement>` | `const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {};` |
| Keyboard event | `React.KeyboardEvent<HTMLInputElement>` | `const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {};` |
| Focus event | `React.FocusEvent<HTMLInputElement>` | `const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {};` |
| Blur event | `React.FocusEvent<HTMLInputElement>` | `const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {};` |
| Clipboard event | `React.ClipboardEvent<HTMLInputElement>` | `const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {};` |
| Pointer event | `React.PointerEvent<HTMLButtonElement>` | `const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {};` |
| Touch event | `React.TouchEvent<HTMLDivElement>` | `const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {};` |
| Drag event | `React.DragEvent<HTMLDivElement>` | `const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {};` |
| Wheel event | `React.WheelEvent<HTMLDivElement>` | `const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {};` |
| Scroll event | `React.UIEvent<HTMLDivElement>` | `const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {};` |
| Composition event | `React.CompositionEvent<HTMLInputElement>` | `const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {};` |
| Invalid event | `React.InvalidEvent<HTMLInputElement>` | `const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {};` |
| Animation event | `React.AnimationEvent<HTMLDivElement>` | `const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {};` |
| Transition event | `React.TransitionEvent<HTMLDivElement>` | `const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {};` |
| Image load event | `React.SyntheticEvent<HTMLImageElement>` | `const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {};` |
| Generic event | `React.SyntheticEvent<Element>` | `const handleEvent = (e: React.SyntheticEvent<Element>) => {};` |
| Controlled input | `value` plus `onChange` | `<input value={name} onChange={(e) => setName(e.target.value)} />` |
| Checkbox input | `e.target.checked` | `<input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />` |
| Number input | Convert `e.target.value` | `<input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />` |
| Select input | Use string value | `<select value={role} onChange={(e) => setRole(e.target.value)} />` |
| Form action | Use `onSubmit` | `<form onSubmit={handleSubmit}>...</form>` |

## Event Handler Type Aliases

| Topic | Syntax | Example |
| --- | --- | --- |
| Form submit handler | `React.FormEventHandler<HTMLFormElement>` | `const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => { e.preventDefault(); };` |
| Input change handler | `React.ChangeEventHandler<HTMLInputElement>` | `const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setName(e.target.value);` |
| Textarea change handler | `React.ChangeEventHandler<HTMLTextAreaElement>` | `const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => setBio(e.target.value);` |
| Select change handler | `React.ChangeEventHandler<HTMLSelectElement>` | `const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => setRole(e.target.value);` |
| Button click handler | `React.MouseEventHandler<HTMLButtonElement>` | `const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {};` |
| Div click handler | `React.MouseEventHandler<HTMLDivElement>` | `const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {};` |
| Keyboard handler | `React.KeyboardEventHandler<HTMLInputElement>` | `const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {};` |
| Focus handler | `React.FocusEventHandler<HTMLInputElement>` | `const handleFocus: React.FocusEventHandler<HTMLInputElement> = () => {};` |
| Blur handler | `React.FocusEventHandler<HTMLInputElement>` | `const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {};` |
| Clipboard handler | `React.ClipboardEventHandler<HTMLInputElement>` | `const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = () => {};` |
| Pointer handler | `React.PointerEventHandler<HTMLButtonElement>` | `const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = () => {};` |
| Touch handler | `React.TouchEventHandler<HTMLDivElement>` | `const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = () => {};` |
| Drag handler | `React.DragEventHandler<HTMLDivElement>` | `const handleDragStart: React.DragEventHandler<HTMLDivElement> = () => {};` |
| Wheel handler | `React.WheelEventHandler<HTMLDivElement>` | `const handleWheel: React.WheelEventHandler<HTMLDivElement> = () => {};` |
| Scroll handler | `React.UIEventHandler<HTMLDivElement>` | `const handleScroll: React.UIEventHandler<HTMLDivElement> = () => {};` |
| Composition handler | `React.CompositionEventHandler<HTMLInputElement>` | `const handleCompositionEnd: React.CompositionEventHandler<HTMLInputElement> = () => {};` |
| Animation handler | `React.AnimationEventHandler<HTMLDivElement>` | `const handleAnimationEnd: React.AnimationEventHandler<HTMLDivElement> = () => {};` |
| Transition handler | `React.TransitionEventHandler<HTMLDivElement>` | `const handleTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = () => {};` |

## Refs

| Topic | Syntax | Example |
| --- | --- | --- |
| Ref for DOM element | `useRef<ElementType>(null)` | `const inputRef = useRef<HTMLInputElement>(null);` |
| Ref access | `ref.current` | `inputRef.current?.focus();` |
| Mutable ref value | `useRef<Type>(initialValue)` | `const countRef = useRef<number>(0);` |

## Common HTML Element Types

| Element | Type |
| --- | --- |
| Button | `HTMLButtonElement` |
| Input | `HTMLInputElement` |
| Textarea | `HTMLTextAreaElement` |
| Select | `HTMLSelectElement` |
| Form | `HTMLFormElement` |
| Div | `HTMLDivElement` |
| Span | `HTMLSpanElement` |
| Anchor | `HTMLAnchorElement` |
| Image | `HTMLImageElement` |
| Video | `HTMLVideoElement` |
| Canvas | `HTMLCanvasElement` |

## Redux Setup

| Topic | Syntax | Example |
| --- | --- | --- |
| Install packages | `@reduxjs/toolkit react-redux` | `npm install @reduxjs/toolkit react-redux` |
| Configure store | `configureStore({ reducer })` | `export const store = configureStore({ reducer: { counter: counterReducer } });` |
| Root state type | `ReturnType<typeof store.getState>` | `export type RootState = ReturnType<typeof store.getState>;` |
| App dispatch type | `typeof store.dispatch` | `export type AppDispatch = typeof store.dispatch;` |
| Provider setup | `<Provider store={store}>` | `<Provider store={store}><App /></Provider>` |
| Typed dispatch | `useDispatch<AppDispatch>()` | `const dispatch = useDispatch<AppDispatch>();` |
| Typed selector | `(state: RootState) => state.slice.value` | `const count = useSelector((state: RootState) => state.counter.value);` |

## Redux Slices

| Topic | Syntax | Example |
| --- | --- | --- |
| Slice state type | `type SliceState = {}` | `type CounterState = { value: number };` |
| Initial state | `const initialState: SliceState = {}` | `const initialState: CounterState = { value: 0 };` |
| Create slice | `createSlice({ name, initialState, reducers })` | `const counterSlice = createSlice({ name: "counter", initialState, reducers: {} });` |
| Reducer without payload | `state.value += 1` | `increment: (state) => { state.value += 1; }` |
| Reducer with payload | `PayloadAction<Type>` | `addAmount: (state, action: PayloadAction<number>) => { state.value += action.payload; }` |
| Export actions | `slice.actions` | `export const { increment, addAmount } = counterSlice.actions;` |
| Export reducer | `slice.reducer` | `export default counterSlice.reducer;` |
| Reset state | Return `initialState` | `reset: () => initialState` |
| Prepare callback | `prepare(payload) { return { payload }; }` | `addTodo: { reducer: (state, action: PayloadAction<Todo>) => {}, prepare: (text: string) => ({ payload: { id: crypto.randomUUID(), text } }) }` |

## Redux Usage

| Topic | Syntax | Example |
| --- | --- | --- |
| Dispatch action | `dispatch(actionCreator())` | `dispatch(increment());` |
| Dispatch payload | `dispatch(actionCreator(value))` | `dispatch(addAmount(5));` |
| Select state | `useSelector((state: RootState) => state.slice.value)` | `const count = useSelector((state: RootState) => state.counter.value);` |
| Selector function | `(state: RootState) => value` | `export const selectCount = (state: RootState) => state.counter.value;` |
| Use selector function | `useSelector(selector)` | `const count = useSelector(selectCount);` |

## Redux Async And RTK Query

| Topic | Syntax | Example |
| --- | --- | --- |
| Async thunk | `createAsyncThunk<Return, Arg>()` | `export const fetchUser = createAsyncThunk<User, string>("users/fetchUser", async (id) => getUser(id));` |
| Thunk pending | `builder.addCase(thunk.pending, ...)` | `builder.addCase(fetchUser.pending, (state) => { state.status = "loading"; });` |
| Thunk fulfilled | `builder.addCase(thunk.fulfilled, ...)` | `builder.addCase(fetchUser.fulfilled, (state, action) => { state.user = action.payload; });` |
| Thunk rejected | `builder.addCase(thunk.rejected, ...)` | `builder.addCase(fetchUser.rejected, (state) => { state.status = "failed"; });` |
| Extra reducers | `extraReducers: (builder) => {}` | `extraReducers: (builder) => { builder.addCase(fetchUser.fulfilled, (state, action) => {}); }` |
| Async status union | `"idle" \| "loading" \| "succeeded" \| "failed"` | `type Status = "idle" \| "loading" \| "succeeded" \| "failed";` |
| Entity array state | `Type[]` | `type UsersState = { users: User[]; status: Status };` |
| Matcher reducer | `builder.addMatcher()` | `builder.addMatcher(isAnyOf(fetchUser.pending), (state) => { state.status = "loading"; });` |
| RTK Query API | `createApi({ reducerPath, baseQuery, endpoints })` | `export const api = createApi({ reducerPath: "api", baseQuery: fetchBaseQuery({ baseUrl: "/" }), endpoints: (builder) => ({}) });` |
| RTK Query hook | `useQueryNameQuery(arg)` | `const { data, isLoading } = useGetUsersQuery();` |
