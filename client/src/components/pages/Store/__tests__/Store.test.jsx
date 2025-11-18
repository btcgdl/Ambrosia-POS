import { render, screen, act } from "@testing-library/react";
import { I18nProvider } from "../../../../i18n/I18nProvider";
import { Store } from "../Store";

function renderStore() {
  return render(
    <I18nProvider>
      <Store />
    </I18nProvider>
  );
}

describe("Store Dashboard", () => {
  it("renders the dashboard with stats", async () => {
    await act(async () => {
      renderStore();
    });
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("subtitle")).toBeInTheDocument();
    expect(screen.getByText("stats.users")).toBeInTheDocument();
    expect(screen.getByText("stats.products")).toBeInTheDocument();
    expect(screen.getByText("stats.sales")).toBeInTheDocument();
  });
});
