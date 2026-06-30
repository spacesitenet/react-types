# React State Update Patterns

Use these patterns when updating React state. Prefer the callback form, `setState((prev) => ...)`, whenever the next value depends on the current value.

## Most Common Patterns

| Goal | Pattern | Use When |
| --- | --- | --- |
| Replace a simple value | `setName(value)` | The new value does not depend on the old value |
| Toggle a boolean | `setOpen((prev) => !prev)` | Opening and closing modals, menus, and accordions |
| Add item to array | `setMessages((prev) => [...prev, newMessage])` | Appending chat messages, todos, logs, or list rows |
| Remove item from array | `setItems((prev) => prev.filter((item) => item.id !== id))` | Deleting by id |
| Update object field | `setUser((prev) => ({ ...prev, name: value }))` | Updating one field in an object |
| Update form field by name | `setForm((prev) => ({ ...prev, [name]: value }))` | Controlled inputs that share one change handler |
| Update one array item | `setItems((prev) => prev.map((item) => item.id === id ? { ...item, name: value } : item))` | Editing one row/card/item |

## Simple Values

Use direct updates when the value comes directly from the event or from a known value.

```tsx
const [name, setName] = useState("");
const [count, setCount] = useState(0);

setName("Roni");
setCount(10);
```

Use callback updates when the next value depends on the previous value.

```tsx
setCount((prev) => prev + 1);
setCount((prev) => prev - 1);
```

## Boolean Toggle

This is common for modals, menus, drawers, and dropdowns.

```tsx
const [open, setOpen] = useState(false);

setOpen((prev) => !prev);
```

For explicit open/close actions, direct updates are clearer.

```tsx
setOpen(true);
setOpen(false);
```

## Add To Array

This is the pattern for adding a new item without mutating the existing array.

```tsx
type Message = {
  id: string;
  text: string;
};

const [messages, setMessages] = useState<Message[]>([]);

const queuedMessage: Message = {
  id: crypto.randomUUID(),
  text: "Hello",
};

setMessages((currentMessages) => [...currentMessages, queuedMessage]);
```

## Remove From Array

Use `filter` when removing an item.

```tsx
setMessages((currentMessages) =>
  currentMessages.filter((message) => message.id !== messageId),
);
```

## Update One Object

Use object spread when changing one field and keeping the rest.

```tsx
type User = {
  id: string;
  name: string;
  email: string;
};

const [user, setUser] = useState<User>({
  id: "1",
  name: "Roni",
  email: "roni@example.com",
});

setUser((prev) => ({
  ...prev,
  name: "New name",
}));
```

## Update Form Object

This is one of the most useful controlled form patterns.

```tsx
type FormValues = {
  name: string;
  email: string;
};

const [formValues, setFormValues] = useState<FormValues>({
  name: "",
  email: "",
});

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = e.target;

  setFormValues((prev) => ({
    ...prev,
    [name]: value,
  }));
}
```

## Update One Item In An Array

Use `map` when editing one item and keeping the others unchanged.

```tsx
type FormItem = {
  label: string;
  value: string;
  type: string;
};

const [formValues, setFormValues] = useState<FormItem[]>([]);

function updateFormItem(index: number, type: keyof FormItem, value: string) {
  setFormValues((prev) => {
    return prev.map((item, i) => {
      if (index !== i) return item;

      return {
        ...item,
        [type]: value,
      };
    });
  });
}
```

Shorter version:

```tsx
setFormValues((prev) =>
  prev.map((item, i) =>
    index === i
      ? {
          ...item,
          [type]: value,
        }
      : item,
  ),
);
```

## Update Nested Object

Spread each nested level that changes.

```tsx
type Settings = {
  profile: {
    name: string;
    theme: "light" | "dark";
  };
};

const [settings, setSettings] = useState<Settings>({
  profile: {
    name: "Roni",
    theme: "light",
  },
});

setSettings((prev) => ({
  ...prev,
  profile: {
    ...prev.profile,
    theme: "dark",
  },
}));
```

## Reset State

Keep an `initialState` value when you need a reset button or form clear action.

```tsx
const initialFormValues = {
  name: "",
  email: "",
};

const [formValues, setFormValues] = useState(initialFormValues);

setFormValues(initialFormValues);
```

## Rule Of Thumb

Use `setValue(newValue)` for direct replacement. Use `setValue((prev) => nextValue)` when the update depends on the previous state. Use object spread for objects, array spread for adding, `filter` for removing, and `map` for updating one item in an array.
