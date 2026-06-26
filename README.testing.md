# React Testing Example

```c:\Users\Roni\Projects\react-langchain\problem init 1\frontend\src\App.test.tsx:1:27
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { runPrompt } from "./api";

vi.mock("./api", () => ({
  runPrompt: vi.fn().mockResolvedValue({ status: "ok" }),
}));

describe("App", () => {
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
