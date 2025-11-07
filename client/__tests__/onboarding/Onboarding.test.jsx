import { render, screen, fireEvent, act } from "@testing-library/react";
import { I18nProvider } from "../../src/i18n/I18nProvider";
import { Onboarding } from "../../src/components/Onboarding";

function renderOnboarding() {
  return render(
    <I18nProvider>
      <Onboarding />
    </I18nProvider>
  );
}

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("aria-label")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("aria-label")
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

describe("Onboarding Wizard", () => {
  it("renders the first step", async () => {
    await act(async () => {
      renderOnboarding();
    });
    expect(screen.getByText("buttons.next")).toBeInTheDocument();
    expect(screen.getByText("1")).toHaveClass("bg-primary");
  });

  it("advances to the next step when Next is clicked", async () => {
    await act(async () => {
      renderOnboarding();
    });
    const nextButton = screen.getByText("buttons.next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(screen.getByText("2")).toHaveClass("bg-primary");
  });

  it("goes back when Back is clicked", async () => {
    await act(async () => {
      renderOnboarding();
    });
    await act(async () => {
      fireEvent.click(screen.getByText("buttons.next"));
    });
    const backButton = screen.getByText("buttons.back");
    await act(async () => {
      fireEvent.click(backButton);
    });
    expect(screen.getByText("1")).toHaveClass("bg-primary");
  });

  it("disables Back on first step", async () => {
    await act(async () => {
      renderOnboarding();
    });
    expect(screen.getByText("buttons.back")).toBeDisabled();
  });
});
