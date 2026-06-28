# React Testing With Reducer Example

```tsx
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { runPrompt } from "./api";
import { createAppStore } from "./store";

vi.mock("./api", () => ({
  runPrompt: vi.fn().mockResolvedValue({
    status: "ok",
    text: "Bonjour, voici votre reponse.",
  }),
}));

function renderApp() {
  return render(
    <Provider store={createAppStore()}>
      <App />
    </Provider>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});


describe("App", () => {
  it("renders the prompt form", () => {
    renderApp();

    expect(
      screen.getByRole("heading", { name: /event marketing agent starter/i }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your prompt")).toBeInTheDocument();
  });

  it("submits the typed prompt to the API", async () => {
    const user = userEvent.setup();

    renderApp();

    await user.type(screen.getByPlaceholderText("Your prompt"), "Write an email");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(runPrompt).toHaveBeenCalledWith({
        userPrompt: "Write an email",
      });
    });

    expect(
      await screen.findByText("Bonjour, voici votre reponse."),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your prompt")).toHaveValue("");
  });
});
```
