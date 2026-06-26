# React Testing Example

```tsx
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { runPrompt } from "./api";

vi.mock("./api", () => ({
  runPrompt: vi.fn().mockResolvedValue({ status: "ok" }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
})


describe("App", () => {
  it("loads", async () => {
    render(<App />);
    console.log('screen', screen)
  })

  it("submits the typed prompt to the API", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByPlaceholderText("Your prompt"), "Write an email");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(runPrompt).toHaveBeenCalledWith({
        userPrompt: "Write an email",
      });
    });
  });
});
```
